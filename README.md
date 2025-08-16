# Investor Dashboard

A full-stack web application for managing investor data and commitments, built with React (Frontend) and FastAPI (Backend).

##  Architecture

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: FastAPI + SQLAlchemy + SQLite
- **Database**: SQLite (default) with CSV data loader

##  Prerequisites

Before running this application, make sure you have the following installed:

- **Python 3.8+** (for backend)
- **Node.js 16+** (for frontend)
- **npm** or **yarn** (package manager)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Investor-Dashboard
```

### 2. Backend Setup

#### Navigate to Backend Directory
```bash
cd backend
```

#### Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### Install Dependencies
```bash
pip install -r requirements.txt
```

#### Environment Configuration (Optional)
Create a `.env` file in the backend directory:
```env
DATABASE_URL=sqlite:///./data.db

# Server Configuration  
HOST=localhost
PORT=8000

# Development Environment
ENVIRONMENT=development
```

## Initialize Database

#### Please add data.csv file in backend/db folder, incase if it is missing.

The application will automatically:
- Create database tables on startup
- Load CSV data if the database is empty
- Look for `db/data.csv` or `data.csv` files

#### Run Backend Server
```bash
python -m uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at: `http://localhost:8000`

### 3. Frontend Setup

#### Navigate to Frontend Directory
```bash
# Open a new terminal window/tab
cd frontend
```

#### Install Dependencies
```bash
npm install
# OR
yarn install
```

#### Environment Configuration (Optional)
Create a `.env` file in the frontend directory:
```env
# API Configuration
API_BASE_URL=http://localhost:8000

# Development Environment
NODE_ENV=development

```

#### Run Frontend Development Server
```bash
npm run dev
# OR
yarn dev
```

The frontend application will be available at: `http://localhost:5173`

## 📊 Application Features

### Dashboard
- **Investor Management**: View and browse investor information
- **Commitment Tracking**: View commitments by selected investor
- **Asset Class Filtering**: Filter commitments by asset class
- **Responsive Design**: Modern UI with Tailwind CSS

### API Endpoints
- `GET /` - Health check
- `GET /investors/` - List all investors
- `GET /investors/{investor_id}` - Get specific investor
- `GET /commitments/` - List all commitments
- `GET /commitments/by-investor/{investor_id}` - Get commitments by investor
- `GET /asset-classes/` - List all asset classes

## 🛠️ Development

### Backend Development
- FastAPI with automatic API documentation at `http://localhost:8000/docs`
- SQLAlchemy ORM for database operations
- Pydantic for data validation
- CORS enabled for frontend integration

### Frontend Development
- React with TypeScript for type safety
- Vite for fast development and building
- Tailwind CSS for styling
- ESLint for code quality

### Hot Reload
Both frontend and backend support hot reload during development:
- Backend: Use `uvicorn app:app --reload`
- Frontend: `npm run dev` automatically enables hot reload

## 📁 Project Structure

```
website/
├── backend/
│   ├── app.py                 # FastAPI application entry point
│   ├── requirements.txt       # Python dependencies
│   ├── db/                    # Database configuration and data
│   │   ├── connection.py      # Database connection setup
│   │   ├── loader.py          # CSV data loader
│   │   └── data.csv          # Sample data
│   ├── models/               # SQLAlchemy models
│   ├── routers/              # API route handlers
│   ├── schemas/              # Pydantic schemas
│   └── services/             # Business logic
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utility functions
│   ├── package.json         # Node.js dependencies
│   └── vite.config.ts       # Vite configuration
└── README.md               # This file
```

## 🔧 Troubleshooting


**Database Issues**
- Delete `data.db` file to reset database
- Ensure CSV data file exists in `db/data.csv` or `data.csv`

**Virtual Environment Issues**
- Ensure virtual environment is activated
- Reinstall dependencies: `pip install -r requirements.txt`

### Frontend Issues

**Node Modules Issues**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Port Already in Use**
- Vite will automatically try the next available port
- Or specify a custom port: `npm run dev -- --port 3000`

### API Connection Issues
- Ensure backend is running on `http://localhost:8000`
- Check CORS settings in `backend/app.py`
- Verify `VITE_API_BASE_URL` in frontend `.env` file



## 📝 Notes

- The application uses SQLite by default for simplicity
- CSV data is automatically loaded on first run
- Both frontend and backend have CORS configured for local development
- The application is designed to be easily deployable to cloud platforms


## 📄 License

This project is open source and available under the [MIT License](LICENSE).
