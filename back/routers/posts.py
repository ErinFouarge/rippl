from dto.request.comment_create import CommentCreate
from dto.response.post import Post
from fastapi import APIRouter, HTTPException, status, Body, Depends
from dto.request.post_create import PostCreate
from services.post import create_post, get_posts, vote_post, comment_post, get_top10
from utils.session import get_current_user

router = APIRouter()

@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create(
    request: PostCreate,
    user: dict = Depends(get_current_user)
):
    try:
        post = await create_post(user["id"], request.content)
        return post
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/", response_model=list[Post])
async def get_posts_exclude_user(
    user: dict = Depends(get_current_user)
):
    return await get_posts(user["id"])

@router.post("/{post_id}/vote")
async def vote(
    post_id: str,
    action: str = Body(..., pattern="^(like|dislike)$", embed=True),
    user: dict = Depends(get_current_user)
):
    try:
        new_score = await vote_post(user["id"], post_id, action)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    return {"status": "success", "new_likes": new_score}

@router.post("/{post_id}/comment")
async def comment_on_post(
    post_id: str,
    comment: CommentCreate,
    user: dict = Depends(get_current_user)
):
    await comment_post(user["id"], post_id, comment.content)
    return {"status": "success"}

@router.get("/top10", response_model=list[Post])
async def get_top10_posts():
    return await get_top10()