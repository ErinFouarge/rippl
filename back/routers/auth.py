from starlette.responses import JSONResponse
from db.redis import session as redis_session
from fastapi import HTTPException, Cookie, Depends
from dto.request.login import LoginRequest
from dto.request.register import RegisterRequest
from fastapi import APIRouter
from services.auth import register_user, login_user
from utils.session import create_auth_response, get_current_user

router = APIRouter()

@router.post("/register")
async def register(data: RegisterRequest):
    try:
        user = await register_user(data.email, data.username, data.password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return create_auth_response(user)

@router.post("/login")
async def login(data: LoginRequest):
    try:
        user = await login_user(data.email, data.password)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))

    return create_auth_response(user)

@router.get("/me")
async def me(user: dict = Depends(get_current_user)):
    return user


@router.post("/logout")
def logout(session_token: str = Cookie(None)):
    if session_token:
        redis_session.delete_session(session_token)
    response = JSONResponse({"message": "Déconnecté"})
    response.delete_cookie("session_token")
    return response