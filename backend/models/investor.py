from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.orm import relationship
from db.connection import Base


class Investor(Base):
    __tablename__ = "investors"

    id = Column(Integer, primary_key=True, index=True)
    investor_name = Column(String, nullable=False)
    investor_type = Column(String)
    investor_country = Column(String)
    investor_date_added = Column(Date)
    investor_last_updated = Column(Date)

    commitments = relationship("Commitment", back_populates="investor")
