from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from app.config import settings
from app.routers import (
    products,
    categories,
    orders,
    payments,
    auth,
    uploads,
    dashboard,
    contact
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("lavendershell.main")

app = FastAPI(
    title="Lavendershell API",
    description="Backend API for Lavendershell Snail Mail & Stationery Storefront & Admin Portal",
    version="1.0.0"
)

# CORS Middleware allowing only FRONTEND_URL, ADMIN_URL, and development hosts
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(categories.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(payments.router)
app.include_router(auth.router)
app.include_router(uploads.router)
app.include_router(dashboard.router)
app.include_router(contact.router)

@app.get("/")
def root():
    return {
        "app": "Lavendershell Snail Mail & Stationery Boutique API",
        "status": "healthy",
        "version": "1.0.0",
        "currency": settings.CURRENCY
    }

@app.get("/health")
@app.get("/api/health")
def health_check():
    from app.services.supabase_client import check_supabase_health
    db_status = check_supabase_health()
    return {
        "status": "ok",
        "service": "lavendershell-backend",
        "database": db_status
    }

@app.get("/api/admin/supabase-status")
def supabase_status():
    from app.services.supabase_client import check_supabase_health
    return check_supabase_health()

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception at {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal error occurred. Please contact the studio team."}
    )
