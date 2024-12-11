import asyncio
from app.telegram.bot import start_bot
from app.core.config.mongodb import db

async def main():
    # Connect to database
    await db.connect_to_database()
    
    try:
        # Start the bot
        await start_bot()
    finally:
        # Close database connection
        await db.close_database_connection()

if __name__ == "__main__":
    asyncio.run(main())
