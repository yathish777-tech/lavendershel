from pydantic import BaseModel
from typing import List, Dict, Any

class MonthlyShipmentStat(BaseModel):
    month: str
    parcels: int
    height: str

class DashboardStatsResponse(BaseModel):
    total_revenue: float
    revenue_growth: str
    total_orders: int
    orders_trend: str
    active_products: int
    hidden_products: int
    total_categories: int
    monthly_shipments: List[MonthlyShipmentStat]
    recent_orders: List[Dict[str, Any]]
