from fastapi import APIRouter, Depends, HTTPException, status, Query, Path, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional, Union
from datetime import datetime, timedelta
import shutil
from pathlib import Path as PathLib

from .. import models, schemas
from ..database import get_db
from ..schemas import StatusReserva, VeiculoCreate, VeiculoUpdate

router = APIRouter(prefix="/api/veiculos", tags=["veiculos"])

# Configuração para upload de imagens
UPLOAD_DIR = PathLib("uploads/veiculos")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "gif"}

def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@router.get(
    "/", 
    response_model=List[schemas.Veiculo],
    summary="Lista todos os veículos disponíveis"
)
def listar_veiculos(
    disponivel: Optional[bool] = Query(
        None, 
        description="Filtrar por disponibilidade"
    ),
    tipo: Optional[str] = Query(
        None, 
        description="Filtrar por tipo de veículo"
    ),
    db: Session = Depends(get_db)
):
    """
    Retorna a lista de veículos cadastrados no sistema, com opção de filtrar 
    por disponibilidade e/ou tipo.
    """
    query = db.query(models.Veiculo)
    
    if disponivel is not None:
        # Verifica se o veículo não tem reservas ativas no momento
        now = datetime.utcnow()
        query = query.outerjoin(
            models.Reserva,
            (models.Reserva.veiculo_id == models.Veiculo.id) &
            (models.Reserva.status_devolucao.in_([
                StatusReserva.RESERVADO,
                StatusReserva.EM_ANDAMENTO
            ])) &
            (models.Reserva.data_retirada <= now) &
            (models.Reserva.data_devolucao_prevista >= now)
        ).group_by(models.Veiculo.id)
        
        if disponivel:
            query = query.having(db.func.count(models.Reserva.id) == 0)
        else:
            query = query.having(db.func.count(models.Reserva.id) > 0)
    
    if tipo:
        query = query.filter(models.Veiculo.tipo.ilike(f"%{tipo}%"))
    
    # Ordena por status (disponíveis primeiro) e depois por modelo
    return query.order_by(
        models.Veiculo.status.asc(),
        models.Veiculo.modelo.asc()
    ).all()

@router.get(
    "/{veiculo_id}",
    response_model=schemas.Veiculo,
    summary="Obtém detalhes de um veículo específico"
)
def obter_veiculo(
    veiculo_id: int = Path(..., description="ID do veículo"),
    db: Session = Depends(get_db)
):
    """
    Retorna os detalhes de um veículo específico, incluindo seu status atual.
    """
    veiculo = db.query(models.Veiculo).filter(
        models.Veiculo.id == veiculo_id
    ).first()
    
    if not veiculo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Veículo não encontrado"
        )
    
    # Inclui a URL da imagem se existir
    veiculo_dict = {**veiculo.__dict__}
    if veiculo_dict.get("imagem_url"):
        veiculo_dict["imagem_url"] = f"/uploads/veiculos/{veiculo.imagem_url}"
    return veiculo_dict

@router.get(
    "/{veiculo_id}/disponibilidade",
    response_model=bool,
    summary="Verifica a disponibilidade de um veículo em um período"
)
def verificar_disponibilidade(
    veiculo_id: int,
    data_inicio: datetime = Query(..., description="Data/hora de início do período"),
    data_fim: datetime = Query(..., description="Data/hora de fim do período"),
    db: Session = Depends(get_db)
):
    """
    Verifica se um veículo está disponível para reserva no período especificado.
    Retorna True se estiver disponível, False caso contrário.
    """
    # Verifica se o veículo existe
    veiculo = db.query(models.Veiculo).get(veiculo_id)
    if not veiculo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Veículo não encontrado"
        )
    
    # Verifica se há reservas conflitantes
    reserva_conflitante = db.query(models.Reserva).filter(
        models.Reserva.veiculo_id == veiculo_id,
        models.Reserva.status_devolucao.in_([
            StatusReserva.RESERVADO,
            StatusReserva.EM_ANDAMENTO
        ]),
        (models.Reserva.data_retirada <= data_fim) &
        (models.Reserva.data_devolucao_prevista >= data_inicio)
    ).first()
    
    return reserva_conflitante is None


@router.post(
    "/",
    response_model=schemas.Veiculo,
    status_code=status.HTTP_201_CREATED,
    summary="Cadastra um novo veículo"
)
def criar_veiculo(
    veiculo: VeiculoCreate,
    db: Session = Depends(get_db)
):
    """
    Cadastra um novo veículo no sistema.
    
    - **placa**: Placa do veículo (formato: AAA0000 ou AAA0A00)
    - **modelo**: Modelo do veículo (ex: Onix, HB20, etc.)
    - **marca**: Marca do veículo (ex: Chevrolet, Hyundai, etc.)
    - **ano**: Ano de fabricação
    - **cor**: Cor predominante
    - **tipo**: Categoria do veículo (ex: Hatch, Sedan, SUV, etc.)
    - **capacidade_passageiros**: Número de passageiros
    - **status**: Status atual (Disponível, Em Manutenção, Indisponível)
    - **observacoes**: Informações adicionais
    """
    # Verifica se já existe veículo com a mesma placa
    db_veiculo = db.query(models.Veiculo).filter(
        models.Veiculo.placa == veiculo.placa
    ).first()
    
    if db_veiculo:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Já existe um veículo cadastrado com esta placa"
        )
    
    # Cria o veículo no banco de dados
    db_veiculo = models.Veiculo(**veiculo.model_dump())
    db.add(db_veiculo)
    db.commit()
    db.refresh(db_veiculo)
    
    return db_veiculo


@router.put(
    "/{veiculo_id}",
    response_model=schemas.Veiculo,
    summary="Atualiza os dados de um veículo"
)
def atualizar_veiculo(
    veiculo_id: int = Path(..., description="ID do veículo a ser atualizado"),
    veiculo: VeiculoUpdate = None,
    db: Session = Depends(get_db)
):
    """
    Atualiza os dados de um veículo existente.
    """
    db_veiculo = db.query(models.Veiculo).filter(
        models.Veiculo.id == veiculo_id
    ).first()
    
    if not db_veiculo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Veículo não encontrado"
        )
    
    # Atualiza apenas os campos fornecidos
    update_data = veiculo.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_veiculo, field, value)
    
    db_veiculo.data_atualizacao = datetime.utcnow()
    db.commit()
    db.refresh(db_veiculo)
    
    return db_veiculo


@router.delete(
    "/{veiculo_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Remove um veículo do sistema"
)
def remover_veiculo(
    veiculo_id: int = Path(..., description="ID do veículo a ser removido"),
    db: Session = Depends(get_db)
):
    """
    Remove um veículo do sistema.
    
    **Atenção:** Esta operação não pode ser desfeita e removerá 
    todas as reservas associadas ao veículo.
    """
    db_veiculo = db.query(models.Veiculo).filter(
        models.Veiculo.id == veiculo_id
    ).first()
    
    if not db_veiculo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Veículo não encontrado"
        )
    
    # Verifica se o veículo tem reservas futuras
    reservas_futuras = db.query(models.Reserva).filter(
        models.Reserva.veiculo_id == veiculo_id,
        models.Reserva.data_retirada > datetime.utcnow()
    ).count()
    
    if reservas_futuras > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Não é possível remover um veículo com reservas futuras"
        )
    
    # Remove o veículo e suas reservas
    db.query(models.Reserva).filter(
        models.Reserva.veiculo_id == veiculo_id
    ).delete()
    
    db.delete(db_veiculo)
    db.commit()
    
    return None


@router.post(
    "/{veiculo_id}/upload-imagem",
    response_model=schemas.Veiculo,
    summary="Faz upload de uma imagem para o veículo"
)
async def upload_imagem_veiculo(
    veiculo_id: int = Path(..., description="ID do veículo"),
    arquivo: UploadFile = File(..., description="Imagem do veículo"),
    db: Session = Depends(get_db)
):
    """
    Faz upload de uma imagem para o veículo.
    
    Formatos suportados: JPG, JPEG, PNG, GIF
    Tamanho máximo: 5MB
    """
    # Verifica se o veículo existe
    db_veiculo = db.query(models.Veiculo).get(veiculo_id)
    if not db_veiculo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Veículo não encontrado"
        )
    
    # Verifica o tipo do arquivo
    if not allowed_file(arquivo.filename):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Formato de arquivo não suportado. Use JPG, JPEG, PNG ou GIF."
        )
    
    try:
        # Gera um nome único para o arquivo
        extensao = arquivo.filename.split('.')[-1].lower()
        nome_arquivo = f"veiculo_{veiculo_id}_{int(datetime.utcnow().timestamp())}.{extensao}"
        caminho_arquivo = UPLOAD_DIR / nome_arquivo
        
        # Salva o arquivo
        with open(caminho_arquivo, "wb") as buffer:
            shutil.copyfileobj(arquivo.file, buffer)
        
        # Remove a imagem antiga se existir
        if db_veiculo.imagem_url:
            caminho_antigo = UPLOAD_DIR / db_veiculo.imagem_url
            if caminho_antigo.exists():
                caminho_antigo.unlink()
        
        # Atualiza o caminho da imagem no banco de dados
        db_veiculo.imagem_url = nome_arquivo
        db_veiculo.data_atualizacao = datetime.utcnow()
        db.commit()
        db.refresh(db_veiculo)
        
        return db_veiculo
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao fazer upload da imagem: {str(e)}"
        )
