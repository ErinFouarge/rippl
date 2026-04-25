import db.neo4j.user as neo4j_user
from utils.secure_password import hash_password, verify_password

async def register_user(email: str, username: str, password: str):
    user_by_email = await neo4j_user.get_user_by_email(email)
    if user_by_email:
        raise ValueError("Email déjà utilisé")

    user_by_username = await neo4j_user.get_user_by_username(username)
    if user_by_username:
        raise ValueError("Nom d'utilisateur déjà pris")

    hashed = hash_password(password)
    return await neo4j_user.create_user(username, email, hashed)

async def login_user(email: str, password: str):
    user = await neo4j_user.get_user_by_email(email)
    if not user or not verify_password(password, user["password"]):
        raise ValueError("Identifiants incorrects")

    return user
