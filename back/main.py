from fastapi import FastAPI
from contextlib import asynccontextmanager
from db.neo4j import neo4j_driver as neo4j
from routers import auth

@asynccontextmanager
async def lifespan(app: FastAPI):
    await neo4j.init_db()
    yield
    await neo4j.close()
app = FastAPI(lifespan=lifespan)

app.include_router(auth.router, prefix="/auth", tags=["auth"])

