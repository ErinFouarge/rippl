import bcrypt

MAX_BCRYPT_LEN = 72

def hash_password(password: str) -> str:
    pw = password[:MAX_BCRYPT_LEN].encode("utf-8")
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pw, salt)
    return hashed.decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    pw = plain[:MAX_BCRYPT_LEN].encode("utf-8")
    return bcrypt.checkpw(pw, hashed.encode("utf-8"))