from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Enum, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime
from sqlalchemy.sql import func
from .schemas import StatusReserva

class Reserva(Base):
    __tablename__ = "reservas"

    id = Column(Integer, primary_key=True, index=True)
    veiculo = Column(String(100), nullable=False, index=True)
    data_retirada = Column(DateTime, nullable=False)
    data_devolucao_prevista = Column(DateTime, nullable=False)
    data_devolucao_real = Column(DateTime, nullable=True)
    responsavel = Column(String(100), nullable=False, index=True)
    email = Column(String(100), nullable=False, index=True)
    departamento = Column(String(100), nullable=False)
    km_devolvido = Column(Integer, nullable=True)
    local_estacionado = Column(String(200), nullable=True)
    imagem_painel = Column(String(500), nullable=True)
    status_devolucao = Column(Enum(StatusReserva), default=StatusReserva.RESERVADO, nullable=False)
    observacoes = Column(Text, nullable=True)
    data_criacao = Column(DateTime, server_default=func.now())
    data_atualizacao = Column(DateTime, onupdate=func.now())
    
    # Relacionamento com Veiculo
    veiculo_id = Column(Integer, ForeignKey('veiculos.id'), nullable=False)
    veiculo_rel = relationship("Veiculo", back_populates="reservas")


class Veiculo(Base):
    __tablename__ = "veiculos"

    id = Column(Integer, primary_key=True, index=True)
    placa = Column(String(10), unique=True, nullable=False, index=True)
    modelo = Column(String(50), nullable=False)
    marca = Column(String(50), nullable=False)
    ano = Column(Integer, nullable=False)
    cor = Column(String(30), nullable=False)
    tipo = Column(String(30), nullable=False)  # Ex: SUV, Sedan, Hatch, etc.
    capacidade_passageiros = Column(Integer, nullable=False)
    quilometragem_atual = Column(Integer, nullable=False, default=0)
    status = Column(String(20), default="Disponível", nullable=False)  # Disponível, Manutenção, Indisponível
    imagem_url = Column(String(255), nullable=True)
    observacoes = Column(Text, nullable=True)
    data_cadastro = Column(DateTime, server_default=func.now())
    data_atualizacao = Column(DateTime, onupdate=func.now())
    
    # Relacionamento com Reserva
    reservas = relationship("Reserva", back_populates="veiculo_rel")
