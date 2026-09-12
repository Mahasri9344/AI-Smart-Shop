# 🛒 AI SMART SHOP
> **AI-Powered Intelligent Inventory & Shop Assistant**

AI Smart Shop is a commercial-grade, intelligent web application designed specifically for small and medium retail businesses. It combines traditional inventory, sales, purchase, and supplier management with **proactive stock intelligence**, **natural-language query processing**, **voice interaction**, and **automated restocking alerts**.

---

## 📌 Problem Statement

Conventional retail inventory management systems present major operational challenges for small and medium retail shopkeepers:
1. **Lack of Proactive Critical Stock Alerts**: Shopkeepers are often unaware when stock reaches critical thresholds until products are completely depleted, leading to lost customer sales.
2. **Complex Navigation**: Traditional systems require navigating multiple complex tables and screens just to inspect stock levels or perform daily transactions.
3. **Usability & Typing Barriers**: Workers who are uncomfortable with complex computer interfaces or English typing face friction and delays when recording stock movement.

---

## 🎯 Project Objectives

- Build a unified SaaS-style dashboard for complete retail shop management.
- Automate stock status calculation dynamically (`NORMAL`, `LOW`, `CRITICAL`).
- Generate proactive, automated alerts when stock crosses critical thresholds.
- Provide simple natural-language and voice interaction for quick stock inquiries.
- Bridge shop management gaps without adding interface complexity for the shopkeeper.

---

## 💡 Proposed Solution

**AI Smart Shop** provides a centralized, modern solution featuring:
- **Smart Dashboard**: High-level KPI metrics (*Total Products, Units, Valuation, Low/Critical counts, Today's Sales & Revenue*).
- **Dynamic Stock Intelligence**: Automatic mathematical calculation of stock status based on live quantities and thresholds.
- **Proactive Notification Center**: Instant visual alerts for critical stock depletion.
- **AI Smart Assistant**: Natural-language query interface with suggested commands (*"Which products are critical?"*, *"Check stock for Almonds"*).
- **Voice Commands**: Microphone-triggered speech recognition and Text-to-Speech audio feedback.
- **Sales & Purchase Management**: Real-time stock reduction on sales and automatic stock increment on purchase orders.
- **Supplier & Analytics Modules**: Comprehensive vendor directories and category-wise stock distribution metrics.

---

## 🚀 Current Phase 1 Implementation

In **Phase 1**, the complete foundational architecture and core UI/UX SaaS layout shell have been established:
- **Vite + React 19 + TypeScript**: Modular, high-performance web app structure.
- **Custom Design System**: Dark SaaS visual theme, HSL color-coded status badges, micro-animations, glassmorphic cards.
- **Responsive Navigation**: Collapsible sidebar, header with critical stock notification badges, mobile drawer navigation.
- **Dynamic Stock Status Engine**: `NORMAL` (Green), `LOW` (Amber), `CRITICAL` (Red with pulse animation).
- **Realistic Sample Dataset**: 21 retail products across 6 categories (*Dry Fruits, Spices, Groceries, Natural Sugars, Beverages*).
- **Smart Dashboard Shell**: Live stats widgets, critical stock warning banner, recent sales activity stream.
- **Router Navigation**: Fully connected routes for all 12 planned application modules.

---

## 🛠️ Technology Stack

- **Frontend Core**: React 19 + TypeScript + Vite
- **UI & Styling**: Custom SaaS CSS System (Vanilla CSS tokens, HSL status indicators, CSS Grid/Flexbox)
- **Icons**: Lucide React
- **State Management**: Reactive `ShopContext` with `DataService` LocalStorage persistence & sample data fallback
- **Speech & Voice**: Web Speech API (`SpeechRecognition` & `SpeechSynthesis`)

---

## 📂 Project Structure

```
AI-Smart-Shop/
├── public/              # Favicon and static assets
├── src/
│   ├── assets/          # SVG icons & image assets
│   ├── components/      # Reusable UI components
│   │   ├── common/      # Header, Sidebar, StatCard, StatusBadge, Modal
│   │   ├── dashboard/   # QuickActions, CriticalAlertBanner
│   │   └── inventory/   # ProductTable, SearchFilterBar
│   ├── context/         # ShopContext (central state provider)
│   ├── data/            # Sample dataset (21 realistic retail products)
│   ├── layouts/         # MainLayout SaaS shell
│   ├── pages/           # Module Views (Dashboard, Inventory, Sales, Purchases, AI Assistant, etc.)
│   ├── services/        # DataService, StockIntelligence engine
│   ├── types/           # TypeScript interfaces & types
│   ├── App.tsx          # Router setup
│   ├── main.tsx         # App entry point
│   └── index.css        # Global CSS variables & design tokens
├── .gitignore           # Git ignore configuration
├── package.json         # NPM manifest & dependencies
├── README.md            # Project documentation
└── vite.config.ts       # Vite build configuration
```

---

## 💻 How to Run Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Steps
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Mahasri9344/AI-Smart-Shop.git
   cd AI-Smart-Shop
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the local development server**:
   ```bash
   npm run dev
   ```
4. **Open in browser**:
   Navigate to `http://localhost:5173`.

---

## 🎯 Review-1 Completed Scope

- [x] Professional SaaS Dashboard Layout
- [x] Responsive Navigation Sidebar & Top Header
- [x] 20+ Realistic Retail Products Seed Data
- [x] Dynamic Stock Status Calculation (`NORMAL`, `LOW`, `CRITICAL`)
- [x] Proactive Critical Alert Banner
- [x] Product Search & Filter Shell
- [x] AI Assistant Chat & Voice UI Shell
- [x] Routing for all 12 modules

---

## 🔮 Future Scope (Phase 2 - Phase 12)

- **Predictive Demand Forecasting**: AI-driven stock depletion prediction based on historic sales speed.
- **Firebase Auth & Firestore Integration**: Cloud user authentication and real-time database sync.
- **WhatsApp & Email Alerts**: Direct automated vendor restocking messages via WhatsApp.
- **Advanced Supplier Comparison**: Price comparison and automated purchase order generation.
- **Multi-language Voice Support**: Voice interaction in regional languages (Hindi, Tamil, Telugu, etc.).

---

## 📄 License & Academic Note
Submitted for academic project evaluation (Review 1).
