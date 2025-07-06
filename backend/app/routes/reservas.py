from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status, Query, Path, Form
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import os
import shutil
from pathlib import Path as PathLib
from typing import List, Optional

from .. import models, schemas
from ..database import get_db
from ..schemas import StatusReserva

router = APIRouter(prefix="/api/reservas", tags=["reservas"])

UPLOAD_DIR = PathLib("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

def check_disponibilidade_veiculo(
    db: Session, 
    veiculo: str, 
    inicio: datetime, 
    fim: datetime, 
    reserva_id: int = None
) -> bool:
    """Verifica se o veículo está disponível no período especificado"""
    query = db.query(models.Reserva).filter(
        models.Reserva.veiculo == veiculo,
        models.Reserva.status_devolucao.in_([
            StatusReserva.RESERVADO, 
            StatusReserva.EM_ANDAMENTO
        ]),
        (
            (models.Reserva.data_retirada <= fim) &
            (models.Reserva.data_devolucao_prevista >= inicio)
        )
    )
    
    if reserva_id:
        query = query.filter(models.Reserva.id != reserva_id)
        
    return db.query(query.exists()).scalar() is False

@router.post("/", 
    response_model=schemas.Reserva,
    status_code=status.HTTP_201_CREATED,
    summary="Cria uma nova reserva de veículo"
)
def criar_reserva(reserva: schemas.ReservaCreate, db: Session = Depends(get_db)):
    """
    Cria uma nova reserva de veículo.
    
    - **veiculo**: Nome do veículo a ser reservado
    - **data_retirada**: Data e hora de retirada do veículo
    - **data_devolucao_prevista**: Data e hora prevista para devolução
    - **responsavel**: Nome do responsável pela reserva
    - **email**: E-mail do responsável
    - **departamento**: Departamento do responsável
    """
    # Verificar disponibilidade do veículo
    if not check_disponibilidade_veiculo(
        db, 
        reserva.veiculo, 
        reserva.data_retirada, 
        reserva.data_devolucao_prevista
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Veículo já reservado neste período"
        )
    
    # Criar a reserva
    db_reserva = models.Reserva(**reserva.model_dump())
    db.add(db_reserva)
    db.commit()
    db.refresh(db_reserva)
    
    return db_reserva

@router.get("/", 
    response_model=List[schemas.Reserva],
    summary="Lista todas as reservas com filtros opcionais"
)
def listar_reservas(
    veiculo: Optional[str] = Query(None, description="Filtrar por veículo"),
    status: Optional[StatusReserva] = Query(None, description="Filtrar por status"),
    responsavel: Optional[str] = Query(None, description="Filtrar por nome do responsável"),
    data_inicio: Optional[datetime] = Query(None, description="Data inicial para filtro"),
    data_fim: Optional[datetime] = Query(None, description="Data final para filtro"),
    db: Session = Depends(get_db)
):
    """
    Lista todas as reservas, com filtros opcionais.
    """
    query = db.query(models.Reserva)
    
    # Aplicar filtros
    if veiculo:
        query = query.filter(models.Reserva.veiculo.ilike(f"%{veiculo}%"))
    if status:
        query = query.filter(models.Reserva.status_devolucao == status)
    if responsavel:
        query = query.filter(models.Reserva.responsavel.ilike(f"%{responsavel}%"))
    if data_inicio:
        query = query.filter(models.Reserva.data_retirada >= data_inicio)
    if data_fim:
        query = query.filter(models.Reserva.data_devolucao_prevista <= data_fim)
    
    # Ordenar por data de retirada (mais recentes primeiro)
    return query.order_by(models.Reserva.data_retirada.desc()).all()

@router.get("/minhas/{email}", 
    response_model=List[schemas.Reserva],
    summary="Lista as reservas de um e-mail específico"
)
def minhas_reservas(
    email: str = Path(..., description="E-mail do responsável"),
    db: Session = Depends(get_db)
):
    """
    Lista todas as reservas associadas a um e-mail específico.
    """
    return (
        db.query(models.Reserva)
        .filter(models.Reserva.email == email)
        .order_by(models.Reserva.data_retirada.desc())
        .all()
    )

@router.post("/devolucao",
    status_code=status.HTTP_200_OK,
    summary="Registra a devolução de um veículo"
)
async def registrar_devolucao(
    reserva_id: int = Form(..., description="ID da reserva"),
    km_devolvido: int = Form(..., description="Quilometragem no momento da devolução"),
    local_estacionado: str = Form(..., description="Local onde o veículo foi estacionado"),
    observacoes: Optional[str] = Form(None, description="Observações adicionais"),
    imagem_painel: UploadFile = File(..., description="Foto do painel do veículo"),
    db: Session = Depends(get_db)
):
    """
    Registra a devolução de um veículo, atualizando a reserva com os dados da devolução.
    """
    # Verificar se a reserva existe
    reserva = db.query(models.Reserva).filter(models.Reserva.id == reserva_id).first()
    if not reserva:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Reserva não encontrada"
        )
        
    # Verificar se o veículo já foi devolvido
    if reserva.status_devolucao == StatusReserva.DEVOLVIDO:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Veículo já foi devolvido"
        )
    
    try:
        # Criar diretório de uploads se não existir
        (UPLOAD_DIR / "paineis").mkdir(exist_ok=True)
        
        # Salvar a imagem do painel
        file_ext = PathLib(imagem_painel.filename).suffix or '.jpg'
        file_name = f"painel_{reserva_id}_{int(datetime.utcnow().timestamp())}{file_ext}"
        file_path = UPLOAD_DIR / "paineis" / file_name
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(imagem_painel.file, buffer)
        
        # Atualizar a reserva com os dados da devolução
        reserva.km_devolvido = km_devolvido
        reserva.local_estacionado = local_estacionado
        reserva.imagem_painel = str(file_path.relative_to(UPLOAD_DIR))
        reserva.status_devolucao = StatusReserva.DEVOLVIDO
        reserva.data_devolucao_real = datetime.utcnow()
        reserva.observacoes = observacoes
        
        db.commit()
        db.refresh(reserva)
        
        return {
            "ok": True, 
            "message": "Devolução registrada com sucesso",
            "reserva_id": reserva.id
        }
        
    except Exception as e:
        # Em caso de erro, fazer rollback e retornar erro
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao processar devolução: {str(e)}"
        )

@router.delete(
    "/{reserva_id}",
    status_code=status.HTTP_200_OK,
    summary="Remove uma reserva (apenas para administradores)"
)
def excluir_reserva(
    reserva_id: int = Path(..., description="ID da reserva a ser removida"),
    senha: str = Query(..., description="Senha de administração"),
    db: Session = Depends(get_db)
):
    """
    Remove uma reserva do sistema (apenas para administradores).
    Em produção, substitua a verificação de senha por autenticação JWT.
    """
    # Em um ambiente real, use autenticação JWT
    if senha != "admin123":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Não autorizado"
        )
        
    # Buscar a reserva
    reserva = db.query(models.Reserva).filter(models.Reserva.id == reserva_id).first()
    if not reserva:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Reserva não encontrada"
        )
    
    # Não permitir exclusão de reservas já finalizadas sem confirmação
    if reserva.status_devolucao == StatusReserva.DEVOLVIDO:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Não é possível excluir uma reserva já finalizada"
        )
    
    try:
        # Remover a reserva
        db.delete(reserva)
        db.commit()
        
        return {
            "ok": True, 
            "message": "Reserva removida com sucesso"
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao remover reserva: {str(e)}"
        )
