from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

# Import schemas
from schemas import (
    CommitmentListResponse,
    AssetClassListResponse
)

# Import services
import services.investor as investor_service

# Import database dependency
from db.connection import SessionLocal

# Create router
router = APIRouter(prefix="/commitments", tags=["commitments"])

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=CommitmentListResponse)
def get_commitments(db: Session = Depends(get_db)):
    """Get all commitments with all asset classes"""
    commitments, asset_classes = investor_service.get_commitments(db)
    return {
        "commitments": commitments,
        "asset_classes": asset_classes
    }


@router.get("/asset-classes", response_model=AssetClassListResponse)
def get_asset_classes(db: Session = Depends(get_db)):
    """Get all unique asset classes"""
    asset_classes = investor_service.get_asset_classes(db)
    return {
        "asset_classes": asset_classes
    }
