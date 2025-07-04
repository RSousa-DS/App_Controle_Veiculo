from fastapi import APIRouter, HTTPException
from typing import List

router = APIRouter()

@router.get("/", response_model=List[str])
async def listar_veiculos():
    return ["T-Cross", "Polo VW"]
