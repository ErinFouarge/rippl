import datetime
import uuid
from db.neo4j.neo4j_driver import driver


async def create_post(user_id: str, content: str) -> dict:
    post_id = str(uuid.uuid4())
    created_at = datetime.datetime.now(datetime.timezone.utc).isoformat()

    async with driver.session() as session:
        result = await session.run(
            """
            MATCH (u:User {id: $user_id})
            CREATE (p:Post {
                id: $post_id,
                content: $content,
                created_at: $created_at
            })
            CREATE (u)-[:POSTED]->(p)
            RETURN p, u.username AS username
            """,
            user_id=user_id,
            post_id=post_id,
            content=content,
            created_at=created_at
        )

        record = await result.single()

        if not record:
            return {}

        post_node = record["p"]
        username = record["username"]

        post_data = dict(post_node.items())
        post_data["author"] = username

        return post_data


async def get_posts_excluding_user(user_id: str) -> list[dict]:
    async with driver.session() as session:
        result = await session.run(
            """
            MATCH (author:User)-[:POSTED]->(p:Post)
            WHERE author.id <> $user_id
            
            OPTIONAL MATCH (me:User {id: $user_id})-[r:LIKED]->(p)
            WITH p, author, r
            
            OPTIONAL MATCH (p)<-[l:LIKED]-(:User)
            OPTIONAL MATCH (commenter:User)-[:COMMENTED]->(c:Comment)-[:ON]->(p)
            
            WITH p, author.username AS username, r,
                 count(DISTINCT l) AS likes,
                 collect(CASE WHEN c IS NOT NULL THEN {
                     id: c.id,
                     content: c.content,
                     created_at: c.created_at,
                     username: commenter.username
                 } END) AS comments
            
            RETURN
            p,
            username,
            r IS NOT NULL AS is_liked,
            likes,
            [x IN comments WHERE x IS NOT NULL] AS comments
            ORDER BY p.created_at DESC
            """,
            user_id=user_id
        )

        posts = []
        async for record in result:
            p_node = record["p"]
            post_data = dict(p_node.items())

            comments = record["comments"] if record["comments"] is not None else []

            posts.append({
                "id": post_data["id"],
                "content": post_data["content"],
                "likes": record["likes"],
                "date": post_data["created_at"],
                "username": record["username"],
                "is_liked": record["is_liked"],
                "comments": comments
            })

        return posts

async def get_posts_by_ids(post_ids: list[str]) -> list[dict]:
    if not post_ids:
        return []

    async with driver.session() as session:
        result = await session.run(
            """
                UNWIND $post_ids AS pid
                MATCH (u:User)-[:POSTED]->(p:Post {id: pid})
                OPTIONAL MATCH (:User)-[l:LIKED]->(p)
                WITH p, u, count(l) AS likes
                RETURN p, u, likes
            """,
            post_ids=post_ids
        )

        posts = []
        async for record in result:
            p_node = record["p"]
            u_node = record["u"]

            post_data = dict(p_node.items())
            posts.append({
                "id": post_data["id"],
                "content": post_data["content"],
                "likes": record["likes"],
                "date": post_data["created_at"],
                "username": u_node["username"],
                "is_liked": False,
                "comments": []
            })
        return posts

async def toggle_post_like(user_id: str, post_id: str, action: str) -> int:
    async with driver.session() as session:

        if action == "like":
            query = """
            MATCH (u:User {id: $user_id})
            MATCH (p:Post {id: $post_id})
            MERGE (u)-[:LIKED]->(p)
            """
        else:
            query = """
            MATCH (u:User {id: $user_id})-[r:LIKED]->(p:Post {id: $post_id})
            DELETE r
            """

        await session.run(query, user_id=user_id, post_id=post_id)

        result = await session.run(
            """
            MATCH (:User)-[r:LIKED]->(p:Post {id: $post_id})
            RETURN count(r) AS likes
            """,
            post_id=post_id
        )

        record = await result.single()
        return record["likes"] if record else 0


async def comment_post(user_id: str, post_id: str, content: str) -> dict:
    comment_id = str(uuid.uuid4())
    created_at = datetime.datetime.now(datetime.timezone.utc).isoformat()

    async with driver.session() as session:
        result = await session.run(
            """
            MATCH (p:Post {id: $post_id})
            MATCH (u:User {id: $user_id})
            CREATE (c:Comment {
                id: $comment_id,
                content: $content,
                created_at: $created_at
            })
            MERGE (u)-[r:COMMENTED]->(c)
            MERGE (c)-[r2:ON]->(p)
            RETURN c, u.username AS username
            """,
            user_id=user_id,
            post_id=post_id,
            comment_id=comment_id,
            content=content,
            created_at=created_at
        )
        record = await result.single()

        if record:
            comment_data = dict(record["c"].items())
            comment_data["username"] = record["username"]
            return comment_data

        return {}