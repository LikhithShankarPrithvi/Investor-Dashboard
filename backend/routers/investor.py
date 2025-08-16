from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

# Import schemas
from schemas import (
    InvestorListResponse, 
    InvestorDetailResponse,
    InvestorCommitmentsResponse
)

# Import services
import services.investor as investor_service

# Import database dependency
from db.connection import SessionLocal

# Create router
router = APIRouter(prefix="/investors", tags=["investors"])

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=InvestorListResponse)
def get_investors(db: Session = Depends(get_db)):
    """Get all investors with their total commitments"""
    investors = investor_service.get_all_investors(db)
    return {
        "message": "Investors fetched successfully",
        "data": investors
    }


@router.get("/{investor_id}", response_model=InvestorDetailResponse)
def get_investor_by_id(investor_id: int, db: Session = Depends(get_db)):
    """Get a specific investor by ID"""
    investor = investor_service.get_investor_by_id(db, investor_id)
    if not investor:
        raise HTTPException(status_code=404, detail="Investor not found")
    
    return {
        "message": "Investor fetched successfully",
        "data": investor
    }


@router.get("/{investor_id}/commitments", response_model=InvestorCommitmentsResponse)
def get_investor_commitments(
    investor_id: int,
    asset_class: Optional[str] = Query(None, description="Filter by asset class"),
    db: Session = Depends(get_db)
):
    """Get commitments for a specific investor, optionally filtered by asset class"""
    # First check if investor exists
    investor = investor_service.get_investor_by_id(db, investor_id)
    if not investor:
        raise HTTPException(status_code=404, detail="Investor not found")
    
    # Get commitments and asset classes
    commitments, asset_classes = investor_service.get_investor_commitments(
        db, investor_id, asset_class
    )
    
    return {
        "commitments": commitments,
        "asset_classes": asset_classes
    }
