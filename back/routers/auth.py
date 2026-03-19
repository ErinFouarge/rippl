from starlette.responses import JSONResponse
from db.redis import session as redis_session
from fastapi import HTTPException, Cookie
from dto.request.login import LoginRequest
from dto.request.register import RegisterRequest
from utils.secure_password import hash_password, verify_password
from fastapi import APIRouter
import db.neo4j.user as neo4j_user

router = APIRouter()

@router.post("/register")
async def register(data: RegisterRequest):
    existing = await neo4j_user.get_user_by_email(data.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")

    hashed = hash_password(data.password)
    user = await neo4j_user.create_user(data.username, data.email, hashed)

    token = redis_session.create_session(user["id"], user["username"])

    response = JSONResponse({"message": "Connecté", "username": user["username"]})
    response.set_cookie(
        key="session_token",
        value=token,
        httponly=True,
        max_age=86400
    )
    return response

@router.post("/login")
async def login(data: LoginRequest):
    user = await neo4j_user.get_user_by_email(data.email)
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Identifiants incorrects")

    token = redis_session.create_session(user["id"], user["username"])

    response = JSONResponse({"message": "Connecté", "username": user["username"]})
    response.set_cookie(
        key="session_token",
        value=token,
        httponly=True,
        max_age=86400
    )
    return response

@router.post("/logout")
def logout(session_token: str = Cookie(None)):
    if session_token:
        redis_session.delete_session(session_token)
    response = JSONResponse({"message": "Déconnecté"})
    response.delete_cookie("session_token")
    return response