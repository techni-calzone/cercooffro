from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes, ConversationHandler, CommandHandler, CallbackQueryHandler
from app.services.auth.telegram import TelegramAuth
from app.services.searcher import SearcherService
from app.models.entities.searcher import SearcherType, SearchPreferences, PriceRange, LocationPreference, DatePreference, Requirements
from datetime import datetime
import json

# Conversation states
(
    SELECTING_TYPE,
    SETTING_PRICE_MIN,
    SETTING_PRICE_MAX,
    SELECTING_CITIES,
    SELECTING_AREAS,
    SETTING_MOVE_IN_DATE,
    SETTING_DURATION,
    SETTING_REQUIREMENTS,
    CONFIRMING_PREFERENCES
) = range(9)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Start the conversation and ask for searcher type."""
    keyboard = [
        [
            InlineKeyboardButton("Student 🎓", callback_data=SearcherType.STUDENT),
            InlineKeyboardButton("Worker 💼", callback_data=SearcherType.WORKER)
        ],
        [InlineKeyboardButton("Both 🎓💼", callback_data=SearcherType.ANY)]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        "Welcome to CercoOffro! 🏠\n\n"
        "I'll help you find the perfect place to stay. "
        "First, tell me what type of searcher you are:",
        reply_markup=reply_markup
    )
    
    return SELECTING_TYPE

async def type_selected(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle searcher type selection and start preferences setup."""
    query = update.callback_query
    await query.answer()
    
    searcher_type = SearcherType(query.data)
    context.user_data['searcher_type'] = searcher_type
    
    # Create or update searcher in database
    telegram_id = str(update.effective_user.id)
    searcher = await TelegramAuth.get_or_create_searcher(telegram_id, searcher_type)
    
    await query.edit_message_text(
        f"Great! You're registered as a {searcher_type.value}. 🎉\n\n"
        "Now, let's set up your search preferences.\n"
        "What's your minimum monthly budget in euros? 💶\n"
        "(Just send the number, e.g., 400)"
    )
    
    return SETTING_PRICE_MIN

async def price_min_received(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle minimum price input and ask for maximum price."""
    try:
        min_price = float(update.message.text)
        if min_price < 0:
            raise ValueError
        
        context.user_data['price_min'] = min_price
        
        await update.message.reply_text(
            f"Minimum budget set to €{min_price:.2f}.\n\n"
            "Now, what's your maximum monthly budget? 💶\n"
            "(Just send the number, e.g., 800)"
        )
        return SETTING_PRICE_MAX
        
    except ValueError:
        await update.message.reply_text(
            "Please enter a valid number for your minimum budget. 🙏\n"
            "For example: 400"
        )
        return SETTING_PRICE_MIN

async def price_max_received(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle maximum price input and ask for city preferences."""
    try:
        max_price = float(update.message.text)
        min_price = context.user_data['price_min']
        
        if max_price < min_price:
            await update.message.reply_text(
                "Maximum budget cannot be less than minimum budget.\n"
                f"Your minimum is €{min_price:.2f}. Please enter a higher maximum."
            )
            return SETTING_PRICE_MAX
            
        context.user_data['price_max'] = max_price
        
        # Common cities in Italy
        keyboard = [
            [InlineKeyboardButton("Milan 🏙", callback_data="Milan")],
            [InlineKeyboardButton("Rome 🏛", callback_data="Rome")],
            [InlineKeyboardButton("Florence 🎨", callback_data="Florence")],
            [InlineKeyboardButton("Bologna 📚", callback_data="Bologna")],
            [InlineKeyboardButton("Turin 🏰", callback_data="Turin")],
            [InlineKeyboardButton("Done ✅", callback_data="done")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        context.user_data['selected_cities'] = []
        
        await update.message.reply_text(
            "Great! Now, select the cities you're interested in:\n"
            "(You can select multiple cities)",
            reply_markup=reply_markup
        )
        return SELECTING_CITIES
        
    except ValueError:
        await update.message.reply_text(
            "Please enter a valid number for your maximum budget. 🙏\n"
            "For example: 800"
        )
        return SETTING_PRICE_MAX

async def city_selected(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle city selection."""
    query = update.callback_query
    await query.answer()
    
    if query.data == "done":
        if not context.user_data.get('selected_cities'):
            await query.edit_message_text(
                "Please select at least one city. 🏙"
            )
            return SELECTING_CITIES
            
        # Move to areas selection based on selected cities
        areas_keyboard = []
        if "Milan" in context.user_data['selected_cities']:
            areas_keyboard.extend([
                [InlineKeyboardButton("Città Studi 📚", callback_data="Città Studi")],
                [InlineKeyboardButton("Navigli 🌊", callback_data="Navigli")],
                [InlineKeyboardButton("Centrale 🚂", callback_data="Centrale")]
            ])
        # Add areas for other cities as needed
        
        areas_keyboard.append([InlineKeyboardButton("Done ✅", callback_data="done")])
        reply_markup = InlineKeyboardMarkup(areas_keyboard)
        
        context.user_data['selected_areas'] = []
        
        await query.edit_message_text(
            "Now, select the specific areas you're interested in:\n"
            "(You can select multiple areas)",
            reply_markup=reply_markup
        )
        return SELECTING_AREAS
        
    # Add selected city
    selected_cities = context.user_data.get('selected_cities', [])
    if query.data not in selected_cities:
        selected_cities.append(query.data)
        context.user_data['selected_cities'] = selected_cities
        
    # Update message with current selections
    current_selections = ", ".join(selected_cities)
    await query.edit_message_text(
        f"Selected cities: {current_selections}\n\n"
        "Select more cities or click Done when finished:",
        reply_markup=query.message.reply_markup
    )
    return SELECTING_CITIES

async def area_selected(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle area selection and move to move-in date."""
    query = update.callback_query
    await query.answer()
    
    if query.data == "done":
        await query.edit_message_text(
            "When would you like to move in? 📅\n"
            "Please enter the date in format YYYY-MM-DD\n"
            "For example: 2024-02-01"
        )
        return SETTING_MOVE_IN_DATE
        
    # Add selected area
    selected_areas = context.user_data.get('selected_areas', [])
    if query.data not in selected_areas:
        selected_areas.append(query.data)
        context.user_data['selected_areas'] = selected_areas
        
    # Update message with current selections
    current_selections = ", ".join(selected_areas)
    await query.edit_message_text(
        f"Selected areas: {current_selections}\n\n"
        "Select more areas or click Done when finished:",
        reply_markup=query.message.reply_markup
    )
    return SELECTING_AREAS

async def move_in_date_received(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle move-in date and ask for duration."""
    try:
        move_in_date = datetime.strptime(update.message.text, "%Y-%m-%d")
        if move_in_date < datetime.now():
            await update.message.reply_text(
                "Please enter a future date. 🗓"
            )
            return SETTING_MOVE_IN_DATE
            
        context.user_data['move_in_date'] = move_in_date
        
        await update.message.reply_text(
            "How many months do you plan to stay? 📅\n"
            "Enter a number between 1 and 36"
        )
        return SETTING_DURATION
        
    except ValueError:
        await update.message.reply_text(
            "Please enter a valid date in format YYYY-MM-DD\n"
            "For example: 2024-02-01"
        )
        return SETTING_MOVE_IN_DATE

async def duration_received(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle duration and ask for requirements."""
    try:
        duration = int(update.message.text)
        if duration < 1 or duration > 36:
            await update.message.reply_text(
                "Please enter a number between 1 and 36 months."
            )
            return SETTING_DURATION
            
        context.user_data['duration'] = duration
        
        keyboard = [
            [
                InlineKeyboardButton("Furnished 🪑", callback_data="furnished"),
                InlineKeyboardButton("Internet 🌐", callback_data="internet")
            ],
            [
                InlineKeyboardButton("Utilities Included 💡", callback_data="utilities")
            ],
            [InlineKeyboardButton("Done ✅", callback_data="done")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        context.user_data['requirements'] = {
            'furnished': False,
            'internet': False,
            'utilities_included': False
        }
        
        await update.message.reply_text(
            "Last step! Select your requirements:\n"
            "(You can select multiple options)",
            reply_markup=reply_markup
        )
        return SETTING_REQUIREMENTS
        
    except ValueError:
        await update.message.reply_text(
            "Please enter a valid number of months."
        )
        return SETTING_DURATION

async def requirements_selected(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle requirements selection and save preferences."""
    query = update.callback_query
    await query.answer()
    
    if query.data == "done":
        # Create preferences object
        preferences = SearchPreferences(
            price_range=PriceRange(
                min=context.user_data['price_min'],
                max=context.user_data['price_max']
            ),
            location=LocationPreference(
                cities=context.user_data['selected_cities'],
                areas=context.user_data.get('selected_areas', [])
            ),
            dates=DatePreference(
                move_in=context.user_data['move_in_date'],
                duration=context.user_data['duration']
            ),
            requirements=Requirements(
                furnished=context.user_data['requirements']['furnished'],
                internet=context.user_data['requirements']['internet'],
                utilities_included=context.user_data['requirements']['utilities_included']
            )
        )
        
        # Save preferences to database
        telegram_id = str(update.effective_user.id)
        updated_searcher = await SearcherService.update_preferences(telegram_id, preferences)
        
        if updated_searcher:
            await query.edit_message_text(
                "Perfect! Your preferences have been saved. 🎉\n\n"
                "I'll notify you when I find properties matching your criteria.\n\n"
                "You can use these commands:\n"
                "/preferences - View your current preferences\n"
                "/update - Update your preferences\n"
                "/search - Search for properties now\n"
                "/help - Get help with commands"
            )
        else:
            await query.edit_message_text(
                "There was an error saving your preferences. Please try again later."
            )
        
        return ConversationHandler.END
        
    # Toggle requirement
    requirements = context.user_data['requirements']
    requirements[query.data] = not requirements[query.data]
    
    # Update message with current selections
    selected = [k for k, v in requirements.items() if v]
    selected_text = ", ".join(selected) if selected else "None"
    
    await query.edit_message_text(
        f"Selected requirements: {selected_text}\n\n"
        "Select more requirements or click Done when finished:",
        reply_markup=query.message.reply_markup
    )
    return SETTING_REQUIREMENTS

async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Cancel the conversation."""
    await update.message.reply_text(
        "Setup cancelled. You can start again with /start"
    )
    return ConversationHandler.END

def get_searcher_conversation_handler():
    """Create and return the conversation handler for searcher setup."""
    return ConversationHandler(
        entry_points=[CommandHandler('start', start)],
        states={
            SELECTING_TYPE: [CallbackQueryHandler(type_selected)],
            SETTING_PRICE_MIN: [MessageHandler(filters.TEXT & ~filters.COMMAND, price_min_received)],
            SETTING_PRICE_MAX: [MessageHandler(filters.TEXT & ~filters.COMMAND, price_max_received)],
            SELECTING_CITIES: [CallbackQueryHandler(city_selected)],
            SELECTING_AREAS: [CallbackQueryHandler(area_selected)],
            SETTING_MOVE_IN_DATE: [MessageHandler(filters.TEXT & ~filters.COMMAND, move_in_date_received)],
            SETTING_DURATION: [MessageHandler(filters.TEXT & ~filters.COMMAND, duration_received)],
            SETTING_REQUIREMENTS: [CallbackQueryHandler(requirements_selected)]
        },
        fallbacks=[CommandHandler('cancel', cancel)]
    )
