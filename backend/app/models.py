from sqlalchemy import Column, Integer, String, DateTime, Boolean
from .database import Base
from datetime import datetime

class Reserva(Base):
    __tablename__ = "reservas"

    id = Column(Integer, primary_key=True, index=True)
    veiculo = Column(String, index=True)
    data_retirada = Column(DateTime, nullable=False)
    data_devolucao_prevista = Column(DateTime, nullable=False)
    data_devolucao_real = Column(DateTime, nullable=True)
    responsavel = Column(String, nullable=False)
    email = Column(String, nullable=False)
    departamento = Column(String, nullable=False)
    km_devolvido = Column(Integer, nullable=True)
    local_estacionado = Column(String, nullable=True)
    imagem_painel = Column(String, nullable=True)
    status_devolucao = Column(String, default="Reservado")
    data_criacao = Column(DateTime, default=datetime.utcnow)
