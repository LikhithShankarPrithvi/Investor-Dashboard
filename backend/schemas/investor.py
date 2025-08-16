from pydantic import BaseModel
from typing import Optional, List
from datetime import date


class InvestorBase(BaseModel):
    investor_name: str
    investor_type: Optional[str] = None
    investor_country: Optional[str] = None


class InvestorSummary(BaseModel):
    id: int
    investor_name: str
    investor_type: Optional[str] = None
    investor_country: Optional[str] = None
    investor_date_added: Optional[date] = None
    total_commitment: float

    class Config:
        orm_mode = True


class InvestorDetail(BaseModel):
    id: int
    investor_name: str
    investor_type: Optional[str] = None
    investor_country: Optional[str] = None
    investor_date_added: Optional[date] = None
    investor_last_updated: Optional[date] = None

    class Config:
        orm_mode = True


class InvestorListResponse(BaseModel):
    message: str
    data: List[InvestorSummary]


class InvestorDetailResponse(BaseModel):
    message: str
    data: InvestorDetail
