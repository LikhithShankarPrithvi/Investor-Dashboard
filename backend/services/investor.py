from sqlalchemy.orm import Session
from sqlalchemy import func
import models
from typing import Optional, List


def get_all_investors(db: Session):
    """Get all investors with their total commitments"""
    investors = (
        db.query(
            models.Investor.id,
            models.Investor.investor_name,
            models.Investor.investor_type,
            models.Investor.investor_country,
            models.Investor.investor_date_added,
            models.Investor.investor_last_updated,
            func.coalesce(func.sum(models.Commitment.amount), 0).label("total_commitment")
        )
        .outerjoin(models.Commitment, models.Investor.id == models.Commitment.investor_id)
        .group_by(models.Investor.id)
        .all()
    )
    return investors


def get_investor_by_id(db: Session, investor_id: int):
    """Get a specific investor by ID"""
    return db.query(models.Investor).filter(models.Investor.id == investor_id).first()


def get_investor_commitments(db: Session, investor_id: int, asset_class: Optional[str] = None):
    """Get commitments for a specific investor, optionally filtered by asset class"""
    query = db.query(models.Commitment).filter(models.Commitment.investor_id == investor_id)
    
    if asset_class:
        query = query.filter(models.Commitment.asset_class == asset_class)
    
    commitments = query.all()
    
    # Get all available asset classes for this investor
    asset_classes_query = (
        db.query(models.Commitment.asset_class)
        .filter(models.Commitment.investor_id == investor_id)
        .distinct()
    )
    asset_classes = [row[0] for row in asset_classes_query.all()]
    
    return commitments, asset_classes


def get_commitments(db: Session):
    """Get all commitments with all asset classes"""
    commitments = db.query(models.Commitment).all()
    asset_classes = [row[0] for row in db.query(models.Commitment.asset_class).distinct()]
    return commitments, asset_classes


def get_asset_classes(db: Session):
    """Get all unique asset classes"""
    asset_classes_result = db.query(models.Commitment.asset_class).distinct().all()
    return [row[0] for row in asset_classes_result]
