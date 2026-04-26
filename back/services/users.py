from db.neo4j import user as neo_user

async def follow(username: str, user_id: str):
    follower = await neo_user.get_user_by_username(username)
    if not follower:
        raise ValueError("Utilisateur inconnu")
    await neo_user.follow_user(follower["id"], user_id)

async def unfollow(username: str, user_id: str):
    follower = await neo_user.get_user_by_username(username)
    if not follower:
        raise ValueError("Utilisateur inconnu")
    await neo_user.unfollow_user(user_id, follower["id"])