# Lavendershell Backend (FastAPI, Python 3.10+)

Welcome to the backend service for **Lavendershell** — a dreamy stationery and monthly snail mail e-commerce boutique.

---

## 🌸 Stack & Architectural Overview

- **Framework**: FastAPI with Pydantic v2
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Object Storage**: Supabase Storage public bucket (`product-images`)
- **Payments**: Razorpay (INR currency, amounts processed in paise with HMAC SHA256 verification and webhooks)
- **Authentication**: Supabase Auth JWT verification with `require_admin` dependency checking `profiles.role == 'admin'`

---

## 🛠️ Setup Instructions

### 1. Supabase Project & Database Setup
1. Create a new project at [database.new](https://database.new) (Supabase).
2. Navigate to **SQL Editor** in your Supabase dashboard.
3. Open `backend/sql/schema.sql` and run the entire script. This will:
   - Create tables: `categories`, `products`, `profiles`, `orders`, `order_items`, `contact_messages`.
   - Set up foreign keys, indexes, and RLS policies.
   - Automatically configure the `on_auth_user_created` trigger for profile rows.
   - Create the `product-images` public storage bucket and access policies.
   - Seed the 5 initial categories and realistic INR product catalog.

### 2. Creating Your First Admin User
1. Go to **Authentication > Users** in Supabase and click **Add User > Create User** (e.g., `admin@lavendershell.co` with a strong password).
2. Go to **SQL Editor** or **Table Editor > profiles** and update that user's role:
   ```sql
   UPDATE public.profiles
   SET role = 'admin', full_name = 'Lavendershell Studio Admin'
   WHERE id = '<USER_UUID_FROM_AUTH_USERS>';
   ```
3. When this user logs in through the Admin App (`/admin-app`), their JWT grants access to all `/api/admin/*` endpoints.

### 3. Razorpay Setup
1. Sign up or log into [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Switch to **Test Mode**.
3. Under **Settings > API Keys**, generate a **Key ID** and **Key Secret**.
4. Under **Settings > Webhooks**, create a webhook pointing to `https://<YOUR_API_DOMAIN>/api/payments/webhook`, select `payment.captured` and `payment.failed`, and set a secret.

### 4. Local Environment Configuration
Create a `.env` file in `/backend` based on `.env.example`:
```bash
cp .env.example .env
```
Fill in:
```env
SUPABASE_URL="https://xyzcompany.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..."
SUPABASE_JWT_SECRET="your-jwt-secret-from-api-settings"

RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="..."
RAZORPAY_WEBHOOK_SECRET="..."

FRONTEND_URL="http://localhost:5173"
ADMIN_URL="http://localhost:5174"

FREE_SHIPPING_THRESHOLD=999.00
FLAT_SHIPPING_FEE=79.00
```

---

## 🚀 Running the Server

1. Create and activate a Python virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
4. Access interactive API documentation:
   - **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
   - **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 📡 API Reference Summary

### Public Storefront Routes
- `GET /api/categories`: List active product categories in sort order.
- `GET /api/products`: Filter products (`category`, `search`, `min_price`, `max_price`, `sort`, `featured`, `page`, `limit`).
- `GET /api/products/{slug_or_id}`: Single product details.
- `POST /api/orders/create`: Create pending order, server recalculates price and generates Razorpay order in paise (Rate limited: 10/min).
- `GET /api/orders/{id}`: Order lookup for success confirmation page.
- `POST /api/payments/verify`: HMAC SHA256 verification of Razorpay signature, marks order paid, decrements stock atomically.
- `POST /api/payments/webhook`: Webhook handler for async capture/failure.
- `POST /api/contact`: Customer contact inquiry (Rate limited: 5/min).

### Admin Portal Routes (`require_admin`)
- `GET /api/admin/categories`: All categories including inactive.
- `POST /api/admin/categories`: Create category.
- `PUT /api/admin/categories/{id}`: Update category.
- `DELETE /api/admin/categories/{id}`: Delete category.
- `PATCH /api/admin/categories/{id}/toggle-active`: Toggle visibility.
- `POST /api/admin/categories/reorder`: Batch reorder categories.
- `GET /api/admin/products`: All products.
- `POST /api/admin/products`: Create product.
- `PUT /api/admin/products/{id}`: Update product.
- `DELETE /api/admin/products/{id}`: Delete product & clean up storage images.
- `PATCH /api/admin/products/{id}/toggle-active`: Toggle active.
- `PATCH /api/admin/products/{id}/toggle-featured`: Toggle featured star.
- `POST /api/admin/uploads`: Upload product image (validates JPG/PNG/WebP, max 5MB).
- `GET /api/admin/orders`: View customer orders & items.
- `PATCH /api/admin/orders/{id}/status`: Update order dispatch status.
- `GET /api/admin/dashboard/stats`: Analytics metrics, revenue, charts.
- `GET /api/admin/contact-messages`: View received messages.
