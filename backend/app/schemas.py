from pydantic import BaseModel, EmailStr, Field, validator, HttpUrl
from datetime import datetime, date
from typing import Optional, List
from enum import Enum

class StatusReserva(str, Enum):
    RESERVADO = "Reservado"
    EM_ANDAMENTO = "Em Andamento"
    DEVOLVIDO = "Devolvido"
    CANCELADO = "Cancelado"

class ReservaBase(BaseModel):
    veiculo: str = Field(..., min_length=1, max_length=100)
    data_retirada: datetime
    data_devolucao_prevista: datetime
    responsavel: str = Field(..., min_length=3, max_length=100)
    email: EmailStr
    departamento: str = Field(..., min_length=3, max_length=100)

    @validator('data_devolucao_prevista')
    def validar_datas(cls, v, values):
        if 'data_retirada' in values and v <= values['data_retirada']:
            raise ValueError('A data de devolução deve ser posterior à data de retirada')
        return v

class ReservaCreate(ReservaBase):
    pass

class ReservaUpdate(BaseModel):
    veiculo: Optional[str] = Field(None, min_length=1, max_length=100)
    data_retirada: Optional[datetime] = None
    data_devolucao_prevista: Optional[datetime] = None
    responsavel: Optional[str] = Field(None, min_length=3, max_length=100)
    email: Optional[EmailStr] = None
    departamento: Optional[str] = Field(None, min_length=3, max_length=100)
    km_devolvido: Optional[int] = Field(None, ge=0)
    local_estacionado: Optional[str] = Field(None, max_length=200)
    observacoes: Optional[str] = Field(None, max_length=500)
    status_devolucao: Optional[StatusReserva] = None

class Reserva(ReservaBase):
    id: int
    km_devolvido: Optional[int] = None
    local_estacionado: Optional[str] = None
    imagem_painel: Optional[str] = None
    status_devolucao: StatusReserva = StatusReserva.RESERVADO
    data_devolucao_real: Optional[datetime] = None
    data_criacao: datetime
    observacoes: Optional[str] = None
    
    class Config:
        from_attributes = True

class DevolucaoCreate(BaseModel):
    reserva_id: int
    km_devolvido: int = Field(..., gt=0, description="Quilometragem deve ser maior que zero")
    local_estacionado: str = Field(..., min_length=3, max_length=200)
    observacoes: Optional[str] = Field(None, max_length=500)

class ReservaFiltro(BaseModel):
    veiculo: Optional[str] = None
    status: Optional[StatusReserva] = None
    responsavel: Optional[str] = None
    data_inicio: Optional[datetime] = None
    data_fim: Optional[datetime] = None


# Esquemas para Veiculo
class VeiculoBase(BaseModel):
    placa: str = Field(..., min_length=7, max_length=10, regex=r'^[A-Z0-9]+$')
    modelo: str = Field(..., max_length=50)
    marca: str = Field(..., max_length=50)
    ano: int = Field(..., gt=1900, le=date.today().year + 1)
    cor: str = Field(..., max_length=30)
    tipo: str = Field(..., max_length=30, description="Tipo do veículo (ex: SUV, Sedan, Hatch)")
    capacidade_passageiros: int = Field(..., gt=0, le=50)
    quilometragem_atual: int = Field(0, ge=0)
    status: str = Field("Disponível", max_length=20)
    observacoes: Optional[str] = Field(None, max_length=500)

    @validator('placa')
    def validar_placa(cls, v):
        # Remove espaços e hífens e converte para maiúsculas
        v = v.upper().replace(" ", "").replace("-", "")
        if not v.isalnum():
            raise ValueError("A placa deve conter apenas letras e números")
        return v


class VeiculoCreate(VeiculoBase):
    pass


class VeiculoUpdate(BaseModel):
    modelo: Optional[str] = Field(None, max_length=50)
    marca: Optional[str] = Field(None, max_length=50)
    ano: Optional[int] = Field(None, gt=1900, le=date.today().year + 1)
    cor: Optional[str] = Field(None, max_length=30)
    tipo: Optional[str] = Field(None, max_length=30)
    capacidade_passageiros: Optional[int] = Field(None, gt=0, le=50)
    quilometragem_atual: Optional[int] = Field(None, ge=0)
    status: Optional[str] = Field(None, max_length=20)
    observacoes: Optional[str] = Field(None, max_length=500)


class Veiculo(VeiculoBase):
    id: int
    data_cadastro: datetime
    data_atualizacao: Optional[datetime] = None

    class Config:
        from_attributes = True
