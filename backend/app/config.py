from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
import os

class Settings(BaseSettings):
    # Supabase
    SUPABASE_URL: str = "https://placeholder-project.supabase.co"
    SUPABASE_SERVICE_ROLE_KEY: str = "placeholder-service-role-key"
    SUPABASE_JWT_SECRET: str = "placeholder-jwt-secret"

    # Razorpay
    RAZORPAY_KEY_ID: str = "rzp_test_placeholder"
    RAZORPAY_KEY_SECRET: str = "placeholder-key-secret"
    RAZORPAY_WEBHOOK_SECRET: str = "placeholder-webhook-secret"

    # CORS & Client URLs (Storefront on 5713, Admin on 5714)
    FRONTEND_URL: str = "http://localhost:5713"
    ADMIN_URL: str = "http://localhost:5714"
    ADDITIONAL_ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5713",
        "http://127.0.0.1:5713",
        "http://localhost:5714",
        "http://127.0.0.1:5714",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174"
    ]

    # Admin Credentials & Auth (Stored in .env)
    ADMIN_USERNAME: str = "lavendershelladmin"
    ADMIN_PASSWORD: str = "AdminLSE"
    ADMIN_JWT_SECRET: str = "lavendershell-studio-secret-jwt-key-2026-soft-plum"
    ADMIN_JWT_EXPIRATION_HOURS: int = 8

    # Shipping Rules (INR)
    FREE_SHIPPING_THRESHOLD: float = 999.00
    FLAT_SHIPPING_FEE: float = 79.00
    CURRENCY: str = "INR"

    # Rate Limiting & Storage
    STORAGE_BUCKET_NAME: str = "product-images"
    MAX_FILE_SIZE_BYTES: int = 5 * 1024 * 1024  # 5MB

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def cors_origins(self) -> List[str]:
        origins = {self.FRONTEND_URL, self.ADMIN_URL}
        for o in self.ADDITIONAL_ALLOWED_ORIGINS:
            origins.add(o)
        return list(origins)

settings = Settings()
