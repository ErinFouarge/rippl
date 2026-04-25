from fastapi import Cookie, HTTPException
from db.redis import session as redis_session
from fastapi.responses import JSONResponse

def create_auth_response(user: dict) -> JSONResponse:
    token = redis_session.create_session(user["id"], user["username"], user["email"])

    response = JSONResponse({
        "id": user["id"],
        "username": user["username"],
        "email": user["email"]
    })

    response.set_cookie(
        key="session_token",
        value=token,
        httponly=True,
        samesite="lax",
        max_age=86400
    )
    return response

async def get_current_user(session_token: str = Cookie(None)):
    if not session_token:
        raise HTTPException(status_code=401, detail="Non authentifié")

    user = redis_session.get_session(session_token)
    if not user:
        raise HTTPException(status_code=401, detail="Session expirée ou invalide")

    return user