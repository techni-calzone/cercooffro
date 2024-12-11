from telegram.ext import Application, CommandHandler
from app.core.config.settings import settings
from app.telegram.handlers.searcher_handlers import (
    get_searcher_conversation_handler,
)

async def help_command(update, context):
    """Send a message when the command /help is issued."""
    help_text = (
        "Here are the available commands:\n\n"
        "/start - Start or restart the setup process\n"
        "/preferences - View your current preferences\n"
        "/update - Update your preferences\n"
        "/search - Search for properties now\n"
        "/help - Show this help message\n"
        "/cancel - Cancel the current operation"
    )
    await update.message.reply_text(help_text)

def create_application() -> Application:
    """Create and configure the bot application."""
    # Create application
    application = Application.builder().token(settings.TELEGRAM_BOT_TOKEN).build()

    # Add conversation handler
    application.add_handler(get_searcher_conversation_handler())

    # Add basic command handlers
    application.add_handler(CommandHandler("help", help_command))

    return application

async def start_bot():
    """Start the bot."""
    app = create_application()
    await app.initialize()
    await app.start()
    await app.run_polling()

async def stop_bot(app: Application):
    """Stop the bot."""
    await app.stop()
    await app.shutdown()
