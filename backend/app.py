
import os
import models
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.investor import router as investor_router
from routers.commitment import router as commitment_router
from db.connection import engine, SessionLocal, Base
from db.loader import load_csv

Base.metadata.create_all(bind=engine)

def init_db():
    db = SessionLocal()
    if db.query(models.Investor).count() == 0:  # Empty DB → load CSV
        if os.path.exists("db/data.csv"):
            load_csv("db/data.csv")
        elif os.path.exists("data.csv"):
            load_csv("data.csv")
    db.close()

init_db()



app = FastAPI(
    title="Investor Management API",
    description="API for managing investors and their commitments",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"],  # Vite dev server ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(investor_router)
app.include_router(commitment_router)

@app.get("/")
def root():
    return {"message": "Investor Management API is running with SQLite DB"}