from db.neo4j import posts as neo_posts
from db.redis.posts import update_post_score, get_top_posts

async def create_post(user_id: str, content: str):
    created = await neo_posts.create_post(user_id, content)

    if not created:
        raise ValueError("Utilisateur introuvable")

    update_post_score(str(created["id"]), 0)
    return created

async def get_posts(user_id: str):
    posts = await neo_posts.get_posts_excluding_user(user_id)
    return posts or []

async def vote_post(user_id: str, post_id: str, action: str):
    new_score = await neo_posts.toggle_post_like(user_id, post_id, action)
    if new_score is None:
        raise ValueError("Action impossible")
    update_post_score(post_id, new_score)
    return new_score

async def comment_post(user_id: str, post_id: str, content: str):
    return await neo_posts.comment_post(user_id, post_id, content)

async def get_top10():
    top_data = get_top_posts(limit=10)
    if not top_data:
        return []

    post_ids = [item["post_id"] for item in top_data]
    return await neo_posts.get_posts_by_ids(post_ids)