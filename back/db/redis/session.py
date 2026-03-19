import uuid
from datetime import timedelta
import json
from db.redis.redis_driver import client

SESSION_TTL = timedelta(hours=24)

def create_session(user_id: str, username: str) -> str:
    session_token = str(uuid.uuid4())
    session_data = {
        "user_id": user_id,
        "username": username,
    }
    client.setex(
        f"session:{session_token}",
        SESSION_TTL,
        json.dumps(session_data)
    )
    return session_token


def get_session(session_token: str) -> dict | None:
    data = client.get(f"session:{session_token}")
    if not data:
        return None
    return json.loads(data)

def delete_session(session_token: str) -> None:
    client.delete(f"session:{session_token}")

def refresh_session(session_token: str) -> bool:
    return client.expire(f"session:{session_token}", SESSION_TTL)