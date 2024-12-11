from typing import List
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl, validator


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "CercoOffro"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"
    
    # MongoDB
    MONGODB_URL: str
    MONGODB_DB_NAME: str
    
    # Telegram
    TELEGRAM_BOT_TOKEN: str
    TELEGRAM_WEBHOOK_URL: str
    TELEGRAM_ADMIN_USER_ID: str
    
    # Security
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    MAX_REQUESTS_PER_MINUTE: int = 60
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    @validator("CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: str | List[str]) -> List[str]:
        if isinstance(v, str):
            return [i.strip() for i in v.split(",")]
        return v

    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings()
