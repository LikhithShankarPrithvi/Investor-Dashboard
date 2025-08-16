import sys
from db.loader import load_csv

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python scripts/load_csv.py <csv_path>")
    else:
        load_csv(sys.argv[1])
