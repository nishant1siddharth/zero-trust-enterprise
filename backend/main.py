from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth_router, employee_router, hr_router, finance_router, admin_router
from seed import seed_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: seed DB
    seed_db()
    yield
    # Shutdown

app = FastAPI(title="Zero Trust Enterprise Backend", lifespan=lifespan)

# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, this should be explicitly set
    allow_credentials=False, # Must be False when allow_origins is '*'
    allow_methods=["*"],
    allow_headers=["*"],
)

import os
SERVICE_TYPE = os.getenv("SERVICE_TYPE", "ALL").upper()

if SERVICE_TYPE in ("ALL", "AUTH"):
    app.include_router(auth_router.router)

if SERVICE_TYPE in ("ALL", "EMPLOYEE"):
    app.include_router(employee_router.router)

if SERVICE_TYPE in ("ALL", "HR"):
    app.include_router(hr_router.router)

if SERVICE_TYPE in ("ALL", "FINANCE"):
    app.include_router(finance_router.router)

if SERVICE_TYPE in ("ALL", "ADMIN"):
    app.include_router(admin_router.router)

if SERVICE_TYPE in ("ALL", "AUDIT", "SECURITY"):
    from routers import audit_router
    app.include_router(audit_router.router)

@app.get("/health")
def health_check():
    """Health check endpoint to verify the service is running."""
    return {"status": "healthy", "service": "Core Backend"}

@app.get("/")
def root():
    return {"message": "Zero Trust Enterprise API is running. Access /docs for API documentation."}
