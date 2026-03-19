from db.redis.redis_driver import client

def update_post_score(post_id: str, likes_count: int) -> None:
    client.zadd("top_posts", {post_id: likes_count})

def get_top_posts(limit: int = 10) -> list[dict]:
    results = client.zrevrange("top_posts", 0, limit - 1, withscores=True)
    return [{"post_id": post_id, "likes": int(score)} for post_id, score in results]

def remove_post_score(post_id: str) -> None:
    client.zrem("top_posts", post_id)