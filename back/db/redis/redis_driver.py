import redis

client = redis.Redis(
    host="localhost",
    port=6379,
    password="rippl_password",
    decode_responses=True
)