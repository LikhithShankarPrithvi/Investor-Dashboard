import csv
from datetime import datetime
from db.connection import SessionLocal
import models

def load_csv(csv_path: str):
    db = SessionLocal()

    with open(csv_path, newline='', encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)

        # Keep a cache to avoid duplicate investor inserts
        investor_cache = {}

        for row in reader:
            name = row["Investor Name"].strip()
            
            # Check if investor already in cache, else create
            if name not in investor_cache:
                # Parse date strings to date objects
                date_added = datetime.strptime(row["Investor Date Added"].strip(), "%Y-%m-%d").date()
                date_updated = datetime.strptime(row["Investor Last Updated"].strip(), "%Y-%m-%d").date()
                
                investor = models.Investor(
                    investor_name=name,
                    investor_type=row["Investory Type"].strip(),
                    investor_country=row["Investor Country"].strip(),
                    investor_date_added=date_added,
                    investor_last_updated=date_updated
                )
                db.add(investor)
                db.flush()  # Get investor.id before commit
                investor_cache[name] = investor
            else:
                investor = investor_cache[name]

            # Create commitment for this row
            commitment = models.Commitment(
                investor_id=investor.id,
                asset_class=row["Commitment Asset Class"].strip(),
                amount=float(row["Commitment Amount"]) if row["Commitment Amount"] else 0,
                currency=row["Commitment Currency"].strip()
            )
            db.add(commitment)

        db.commit()

    db.close()
