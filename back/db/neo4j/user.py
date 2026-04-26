import datetime
import uuid
from db.neo4j.neo4j_driver import driver

async def create_user(username: str, email: str, hashed_password: str) -> dict:
    user_id = str(uuid.uuid4())
    async with driver.session() as session:
        result = await session.run(
            """
            CREATE (u:User {
                id: $id,
                username: $username,
                email: $email,
                password: $password,
                created_at: $created_at
            })
            RETURN u
            """,
            id=user_id,
            username=username,
            email=email,
            password=hashed_password,
            created_at=datetime.datetime.now(datetime.timezone.utc).isoformat()
        )
        record = await result.single()
        return dict(record["u"].items())

async def get_user_by_email(email: str) -> dict | None:
    async with driver.session() as session:
        result = await session.run(
            "MATCH (u:User {email: $email}) RETURN u",
            email=email
        )
        record = await result.single()
        return dict(record["u"].items()) if record else None

async def get_user_by_username(username: str) -> dict | None:
    async with driver.session() as session:
        result = await session.run(
            "MATCH (u:User {username: $username}) RETURN u",
            username=username
        )
        record = await result.single()
        return dict(record["u"].items()) if record else None

async def follow_user(follower_id: str, followed_id: str) -> None:
    async with driver.session() as session:
        query = """
        MATCH (follower:User {id: $follower_id}), (followed:User {id: $followed_id})
        MERGE (followed)-[:FOLLOWS]->(follower)
        """
        await session.run(query, follower_id=follower_id, followed_id=followed_id)

async def unfollow_user(follower_id: str, followed_id: str) -> None:
    async with driver.session() as session:
        query = """
        MATCH (follower:User {id: $follower_id})-[r:FOLLOWS]->(followed:User {id: $followed_id})
        DELETE r
        """
        await session.run(query, follower_id=follower_id, followed_id=followed_id)