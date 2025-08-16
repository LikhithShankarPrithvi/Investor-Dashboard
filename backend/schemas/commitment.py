from pydantic import BaseModel
from typing import List, Optional


class CommitmentBase(BaseModel):
    asset_class: str
    amount: float
    currency: str

class CommitmentResponse(BaseModel):
    id: int
    asset_class: str
    amount: float
    currency: str

    class Config:
        orm_mode = True


class CommitmentDetail(BaseModel):
    id: int
    asset_class: str
    amount: float
    currency: str
    investor_id: int

    class Config:
        orm_mode = True


class CommitmentListResponse(BaseModel):
    commitments: List[CommitmentResponse]
    asset_classes: List[str]


class InvestorCommitmentsResponse(BaseModel):
    commitments: List[CommitmentResponse]
    asset_classes: List[str]


class AssetClassListResponse(BaseModel):
    asset_classes: List[str]


class APIResponse(BaseModel):
    message: str
