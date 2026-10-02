# Lavendershell Frontend (React, Vite, Tailwind CSS)

Welcome to the frontend application for **Lavendershell** — a dreamy stationery and snail mail e-commerce boutique.

---

## 🌸 Tech Stack

- **Framework**: React 19 with Vite 8
- **Language**: JavaScript / JSX
- **Styling**: Tailwind CSS v4 with custom theme tokens (`src/styles/tokens.js`)
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Payments**: Razorpay Checkout standard integration
- **State Management**: React Context API (`ProductsContext`, `CartContext`, `WishlistContext`)
- **Routing**: React Router v7

---

## 📁 Directory Structure

```
frontend/
├── src/
│   ├── components/       # UI primitives, layout, cart, and product cards
│   ├── context/          # React contexts for products, cart, wishlist
│   ├── dashboard/        # Admin Studio portal (overview, products, categories, orders)
│   ├── data/             # Mock catalog, testimonials, and FAQs
│   ├── hooks/            # Custom hooks (scroll position, localStorage)
│   ├── pages/            # Home, Product, About, Contact
│   ├── services/         # API client layer with backend & fallback support (api.js)
│   ├── styles/           # Design tokens and theme variables
│   ├── utils/            # Price formatting and utilities
│   ├── App.jsx           # App shell, routing, and transitions
│   ├── index.css         # Tailwind directives and custom pastel styles
│   └── main.jsx          # React DOM entry point
├── index.html            # HTML entry point with Google Fonts
├── package.json          # Node.js dependencies and scripts
├── vite.config.ts        # Vite build configuration
└── .env.example          # Environment variables template
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Available variables:
- `VITE_API_URL`: Backend API URL (default: `http://localhost:8000`)
- `VITE_RAZORPAY_KEY_ID`: Razorpay Test Key ID (e.g. `rzp_test_...`)

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```
The optimized production bundle will be generated in `dist/`.

---

## 💌 Features
- **Dreamy Aesthetics**: Wax seals, pastel gradients, and handwritten accents.
- **Storefront**: Snail Mail Club subscriptions, stationery treasures, gift sets, and mindful journals.
- **Admin Studio**: Accessible via `/dashboard` or `/admin` for product and category management, order dispatch, and image uploads.
- **Razorpay Checkout**: Seamless order placement with server-side price calculation and payment verification.
