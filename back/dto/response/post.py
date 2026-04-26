from __future__ import annotations
from pydantic import BaseModel
from typing import List

class Comment(BaseModel):
    id: str
    content: str
    created_at: str
    username: str

class Post(BaseModel):
    id: str
    content: str
    likes: int
    date: str
    username: str
    is_liked: bool
    is_followed: bool
    comments: List[Comment] = []