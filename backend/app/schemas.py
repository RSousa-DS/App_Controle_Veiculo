from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

class ReservaBase(BaseModel):
    veiculo: str
    data_retirada: datetime
    data_devolucao_prevista: datetime
    responsavel: str
    email: EmailStr
    departamento: str

class ReservaCreate(ReservaBase):
    pass

class Reserva(ReservaBase):
    id: int
    status_devolucao: str
    data_criacao: datetime
    
    class Config:
        from_attributes = True

class DevolucaoCreate(BaseModel):
    reserva_id: int
    km_devolvido: int = Field(..., gt=0, description="Quilometragem deve ser maior que zero")
    local_estacionado: str

class ReservaFiltro(BaseModel):
    veiculo: Optional[str] = None
    status: Optional[str] = None
    responsavel: Optional[str] = None
    data: Optional[str] = None
