"""
Authentication module alias for test suites and external callers.
Re-exports security and auth service functions.
"""

from utils.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)
from services.auth_service import (
    register_user,
    authenticate_user,
    get_current_user,
)

__all__ = [
    "create_access_token",
    "decode_access_token",
    "hash_password",
    "verify_password",
    "register_user",
    "authenticate_user",
    "get_current_user",
]
