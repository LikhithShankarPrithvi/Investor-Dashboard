from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from db.connection import Base


class Commitment(Base):
    __tablename__ = "commitments"

    id = Column(Integer, primary_key=True, index=True)
    asset_class = Column(String)
    amount = Column(Float)
    currency = Column(String)

    investor_id = Column(Integer, ForeignKey("investors.id"))
    investor = relationship("Investor", back_populates="commitments")
