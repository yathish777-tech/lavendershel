import hmac
import hashlib
import time
from datetime import datetime, timedelta
import jwt
import logging
from app.config import settings

logger = logging.getLogger("lavendershell.admin_auth")

try:
    import bcrypt
    _HAS_BCRYPT = True
except ImportError:
    _HAS_BCRYPT = False
    logger.warning("bcrypt module not installed in Python environment, falling back to pbkdf2_sha256")

# Salt and precomputed startup hash
_STARTUP_SALT = b"lavendershell_salt_2026"

if _HAS_BCRYPT:
    _HASHED_ADMIN_PASSWORD = bcrypt.hashpw(
        settings.ADMIN_PASSWORD.encode("utf-8"),
        bcrypt.gensalt()
    )
else:
    _HASHED_ADMIN_PASSWORD = hashlib.pbkdf2_hmac(
        "sha256",
        settings.ADMIN_PASSWORD.encode("utf-8"),
        _STARTUP_SALT,
        100000
    )

def verify_admin_credentials(username: str, password: str) -> bool:
    """
    Constant-time validation of admin username and bcrypt-hashed password.
    """
    if not username or not password:
        return False

    # 1. Constant-time check on username
    username_valid = hmac.compare_digest(
        username.strip().encode("utf-8"),
        settings.ADMIN_USERNAME.strip().encode("utf-8")
    )

    # 2. Constant-time check on password
    if _HAS_BCRYPT:
        try:
            password_valid = bcrypt.checkpw(
                password.encode("utf-8"),
                _HASHED_ADMIN_PASSWORD
            )
        except Exception as e:
            logger.error(f"Error checking bcrypt password: {e}")
            password_valid = False
    else:
        computed = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            _STARTUP_SALT,
            100000
        )
        password_valid = hmac.compare_digest(computed, _HASHED_ADMIN_PASSWORD)

    return username_valid and password_valid

def create_admin_token(username: str) -> dict:
    """
    Generates an 8-hour JWT signed with ADMIN_JWT_SECRET.
    """
    now = datetime.utcnow()
    expires_delta = timedelta(hours=settings.ADMIN_JWT_EXPIRATION_HOURS)
    expires_at = now + expires_delta

    payload = {
        "sub": username,
        "role": "admin",
        "iat": int(now.timestamp()),
        "exp": int(expires_at.timestamp())
    }

    token = jwt.encode(payload, settings.ADMIN_JWT_SECRET, algorithm="HS256")

    return {
        "access_token": token,
        "token_type": "bearer",
        "expires_in": int(expires_delta.total_seconds()),
        "expires_at": expires_at.isoformat(),
        "username": username
    }

def verify_admin_token(token: str) -> dict:
    """
    Decodes and validates admin JWT token.
    """
    try:
        payload = jwt.decode(
            token,
            settings.ADMIN_JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_exp": True}
        )
        if payload.get("role") != "admin":
            raise ValueError("Token is not an admin token")
        return payload
    except Exception as e:
        raise ValueError(f"Invalid or expired admin token: {e}")
