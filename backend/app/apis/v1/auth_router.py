from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.apis.deps import get_current_user_async, get_db_session
from app.services.auth_service import auth_service
from app.schemas.token_schemas import Token
from app.schemas.user_schemas import UserCreate, UserPublic, UserFullPublic
from app.models.auth_models import User

router = APIRouter()

@router.post("/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
async def register_new_user(
    user_in: UserCreate, 
    db: AsyncSession = Depends(get_db_session)
):
    """Register a new user"""
    return await auth_service.register_user(db=db, user_in=user_in)

@router.post("/login", response_model=Token)
async def login_access_token(
    db: AsyncSession = Depends(get_db_session),
    form_data: OAuth2PasswordRequestForm = Depends()
):
    """OAuth2 compatible login endpoint, get access token for future requests"""
    return await auth_service.login_user(db=db, form_data=form_data)

@router.get("/me", response_model=UserFullPublic)
async def read_users_me(
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(get_current_user_async)
):
    """Get current user details including profile and roles"""
    return await auth_service.get_user_details(db=db, user_id=current_user.id)