from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from datetime import datetime
import os
from typing import List, Optional

from .. import models, schemas
from ..database import get_db

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def check_disponibilidade_veiculo(db: Session, veiculo: str, inicio: datetime, fim: datetime, reserva_id: int = None):
    query = db.query(models.Reserva).filter(
        models.Reserva.veiculo == veiculo,
        models.Reserva.status_devolucao == "Reservado",
        (
            (models.Reserva.dataRetirada <= fim) &
            (models.Reserva.dataDevolucaoPrevista >= inicio)
        )
    )
    
    if reserva_id:
        query = query.filter(models.Reserva.id != reserva_id)
        
    return query.first() is None

@router.post("/", response_model=schemas.Reserva)
def criar_reserva(reserva: schemas.ReservaCreate, db: Session = Depends(get_db)):
    if not check_disponibilidade_veiculo(db, reserva.veiculo, reserva.dataRetirada, reserva.dataDevolucaoPrevista):
        raise HTTPException(
            status_code=400,
            detail="Veículo já reservado neste período"
        )
    
    db_reserva = models.Reserva(**reserva.model_dump())
    db.add(db_reserva)
    db.commit()
    db.refresh(db_reserva)
    return db_reserva

@router.get("/", response_model=List[schemas.Reserva])
def listar_reservas(
    veiculo: Optional[str] = None,
    status: Optional[str] = None,
    responsavel: Optional[str] = None,
    data: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Reserva)
    
    if veiculo:
        query = query.filter(models.Reserva.veiculo == veiculo)
    if status:
        query = query.filter(models.Reserva.status_devolucao == status)
    if responsavel:
        query = query.filter(models.Reserva.responsavel.ilike(f"%{responsavel}%"))
    if data:
        query = query.filter(
            (models.Reserva.dataRetirada <= f"{data} 23:59:59") &
            (models.Reserva.dataDevolucaoPrevista >= f"{data} 00:00:00")
        )
    
    return query.order_by(models.Reserva.dataRetirada.desc()).all()

@router.get("/minhas-reservas/{email}", response_model=List[schemas.Reserva])
def minhas_reservas(email: str, db: Session = Depends(get_db)):
    return (
        db.query(models.Reserva)
        .filter(
            models.Reserva.email == email,
            models.Reserva.status_devolucao == "Reservado"
        )
        .order_by(models.Reserva.dataRetirada)
        .all()
    )

@router.post("/{reserva_id}/devolucao")
async def registrar_devolucao(
    reserva_id: int,
    km_devolvido: int,
    local_estacionado: str,
    imagem_painel: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Verifica se a reserva existe e está ativa
    reserva = db.query(models.Reserva).filter(
        models.Reserva.id == reserva_id,
        models.Reserva.status_devolucao == "Reservado"
    ).first()
    
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva não encontrada ou já finalizada")
    
    # Salva a imagem
    file_path = os.path.join(UPLOAD_DIR, f"painel_{reserva_id}_{imagem_painel.filename}")
    with open(file_path, "wb") as buffer:
        buffer.write(await imagem_painel.read())
    
    # Atualiza a reserva
    reserva.status_devolucao = "Devolvido"
    reserva.km_devolvido = km_devolvido
    reserva.local_estacionado = local_estacionado
    reserva.imagem_painel = f"/{file_path.replace('\\', '/')}"
    reserva.data_devolucao_real = datetime.utcnow()
    
    db.commit()
    return {"status": "success", "message": "Devolução registrada com sucesso"}

@router.delete("/{reserva_id}")
def excluir_reserva(reserva_id: int, senha: str, db: Session = Depends(get_db)):
    if senha != "12345":
        raise HTTPException(status_code=403, detail="Senha incorreta")
    
    reserva = db.query(models.Reserva).filter(
        models.Reserva.id == reserva_id,
        models.Reserva.status_devolucao == "Reservado"
    ).first()
    
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva não encontrada ou já finalizada")
    
    db.delete(reserva)
    db.commit()
    return {"status": "success", "message": "Reserva excluída com sucesso"}
