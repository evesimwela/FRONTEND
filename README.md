# Asthma Prediction — Backend

Flask REST API that serves the Asthma Prediction system. Handles user authentication, ML-based asthma risk prediction, recommendation generation, and admin analytics.

## Tech Stack

- **Flask 3.0** with Blueprints
- **Flask-SQLAlchemy** — ORM for MySQL
- **Flask-JWT-Extended** — JWT authentication (tokens expire after 1 day)
- **Flask-CORS** — Cross-origin support
- **PyMySQL** — MySQL driver
- **scikit-learn 1.8** — Model inference
- **pandas / numpy** — Data processing

## Getting Started

### Prerequisites

- Python 3.10+
- MySQL server with a database named `asthma_prediction`
- Model files (`asthma_prediction_model.pkl` and `preprocessing_pipeline.pkl`) in the parent directory

### Installation

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Database Setup

```sql
CREATE DATABASE asthma_prediction;
```

Tables are auto-created on first run via `db.create_all()`.

### Running

```bash
python app.py
```

The server starts on `http://localhost:5000` in debug mode.

### Seed Admin User

```bash
flask create-admin
```

Default: `admin@example.com` / `admin123`. Customize with flags:

```bash
flask create-admin --username myadmin --email admin@mysite.com --password securepass
```

## Project Structure

```
backend/
├── app.py                  # Flask app factory, blueprint registration, CLI commands
├── config.py               # Configuration (DB URI, JWT secret, token expiry)
├── requirements.txt        # Python dependencies
├── models/
│   ├── __init__.py         # SQLAlchemy db instance
│   ├── user.py             # User model (username, email, password hash, role)
│   └── prediction.py       # Prediction model (20 input fields + results)
├── routes/
│   ├── __init__.py
│   ├── auth.py             # /api/auth — register, login, me
│   ├── predict.py          # /api/predict — predict, history, detail
│   └── admin.py            # /api/admin — stats, users, predictions (admin only)
├── services/
│   ├── __init__.py
│   ├── ml_service.py       # Model loading, feature engineering, prediction
│   └── recommendation_service.py  # Rule-based health recommendations
└── utils/
    ├── __init__.py
    └── decorators.py       # admin_required decorator
```

## API Endpoints

### Auth (`/api/auth`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Create new user | No |
| POST | `/login` | Login, returns JWT token | No |
| GET | `/me` | Get current user info | Required |

### Predictions (`/api/predict`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Submit health data, get prediction | Required |
| GET | `/history` | Paginated prediction history | Required |
| GET | `/<id>` | Single prediction detail | Required |

### Admin (`/api/admin`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/stats` | System-wide analytics | Admin |
| GET | `/users` | Paginated user list | Admin |
| PUT | `/users/<id>/role` | Update user role | Admin |
| GET | `/predictions` | All predictions (paginated) | Admin |

## Database Models

### User

| Column | Type | Description |
|--------|------|-------------|
| id | Integer (PK) | Auto-increment |
| username | String(80) | Unique |
| email | String(120) | Unique |
| password | String(256) | Werkzeug hash |
| role | String(20) | `user` or `admin` |
| created_at | DateTime | UTC timestamp |

### Prediction

Stores 20 input fields (personal info, lifestyle, medical history, symptoms), plus computed results:

| Column | Type | Description |
|--------|------|-------------|
| prediction_result | Integer | 0 (low risk) or 1 (high risk) |
| prediction_probability | Float | Probability of asthma (0–1) |
| risk_score | Float | Composite risk score (0–8) |
| symptom_count | Integer | Number of active symptoms (0–7) |
| recommendations | Text | JSON-encoded list of recommendations |

## Configuration

Set via environment variables or edit `config.py`:

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `mysql+pymysql://root:@localhost/asthma_prediction` | MySQL connection string |
| `SECRET_KEY` | `dev-secret-key-change-in-production` | Flask secret key |
| `JWT_SECRET_KEY` | `jwt-secret-key-change-in-production` | JWT signing key |

JWT tokens expire after **1 day** (`JWT_ACCESS_TOKEN_EXPIRES`).
