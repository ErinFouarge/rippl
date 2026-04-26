from fastapi import APIRouter, Depends, Body, HTTPException
from utils.session import get_current_user
from services.users import follow as follow_service
from services.users import unfollow as unfollow_service

router = APIRouter()

@router.post("/follow")
async def follow_user(
        username: str = Body(embed=True),
        user: dict = Depends(get_current_user)
):
    try:
        await follow_service(username, user["id"])
        return {"status": "success"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/unfollow")
async def unfollow_user(
        username: str = Body(embed=True),
        user: dict = Depends(get_current_user)
):
    try:
        await unfollow_service(username, user["id"])
        return {"status": "success"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
