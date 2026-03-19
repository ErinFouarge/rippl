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
            created_at=datetime.datetime.utcnow().isoformat()
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