from neo4j import AsyncGraphDatabase

URI = "bolt://localhost:7687"
USER = "neo4j"
PASSWORD = "rippl_password"

driver = AsyncGraphDatabase.driver(URI, auth=(USER, PASSWORD))

async def close():
    await driver.close()

async def init_db():
    async with driver.session() as session:
        await session.run("CREATE CONSTRAINT IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE")
        await session.run("CREATE CONSTRAINT IF NOT EXISTS FOR (u:User) REQUIRE u.email IS UNIQUE")
        await session.run("CREATE CONSTRAINT IF NOT EXISTS FOR (p:Post) REQUIRE p.id IS UNIQUE")
        await session.run("CREATE INDEX IF NOT EXISTS FOR (p:Post) ON (p.likes_count)")