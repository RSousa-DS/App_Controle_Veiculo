from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from . import models
from .database import engine, get_db
from .routes import veiculos, reservas
import os

# Cria as tabelas no banco de dados
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sistema de Controle de Veículos")

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotas da API
app.include_router(veiculos.router, prefix="/api/veiculos", tags=["veiculos"])
app.include_router(reservas.router, prefix="/api/reservas", tags=["reservas"])

# Servir arquivos estáticos (imagens)
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
async def root():
    return {"message": "API do Sistema de Controle de Veículos"}
