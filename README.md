# 🛒 AI SMART SHOP
> **AI-Powered Intelligent Inventory & Shop Assistant**

**AI Smart Shop** is a commercial-grade, intelligent web application built for small and medium-sized retail businesses. It bridges the gap between traditional inventory management systems and modern artificial intelligence by combining **proactive critical stock alerts**, **natural-language inventory queries**, **voice command interactions**, and **dynamic stock intelligence**.

---

## 📌 Problem Statement

Conventional retail inventory management systems suffer from major operational hurdles:
1. **Lack of Proactive Stock Alerts**: Shopkeepers are often unaware when inventory reaches a critical level until items run out completely, resulting in lost sales and customer dissatisfaction.
2. **Complex Multi-Screen Navigation**: Routine operations—such as checking stock, logging sales, or identifying reorder levels—require navigating complex tabular screens.
3. **Usability & Typing Barriers**: Workers who are uncomfortable with traditional computer interfaces or English typing face friction and operational delays.

---

## 🎯 Project Objectives

- Provide a single unified, intelligent SaaS-style dashboard for complete retail shop management.
- Automate stock status calculation dynamically (`NORMAL`, `LOW`, `CRITICAL`).
- Generate proactive, automated alerts when stock crosses low or critical thresholds.
- Enable simple natural-language and voice interactions for instant stock inquiries.
- Bridge accessibility gaps without introducing unnecessary complexity for the shopkeeper.

---

## 💡 Key Features & Modules

### 1. 📊 Smart Dashboard Shell ([Dashboard.tsx](file:///c:/Users/user/Documents/AI-Smart-Shop/src/pages/Dashboard.tsx))
- **Live KPI Metrics**: Total Products, Total Stock Units, Inventory Valuation, Low Stock Count, Critical Stock Count, Today's Sales Revenue, Today's Purchase Costs.
- **Proactive Critical Alert Banner**: Automatically displays urgent warnings when critical stock items are detected.
- **Quick Action Triggers**: Instant modal launches for `+ Add Product`, `+ Record Sale`, `+ Record Purchase`, and `🤖 Ask AI`.

### 2. 📦 Inventory Management Module ([Inventory.tsx](file:///c:/Users/user/Documents/AI-Smart-Shop/src/pages/Inventory.tsx))
- Real-time stock tracking with category & status filtering.
- **ProductModal**: Add new products or edit existing ones with custom low/critical thresholds.
- **StockAdjustModal**: Quick stock quantity increment/decrement (+ / -).

### 3. 💳 Sales Management Module ([Sales.tsx](file:///c:/Users/user/Documents/AI-Smart-Shop/src/pages/Sales.tsx))
- **RecordSaleModal**: Log customer sales with automatic inventory stock reduction.
- **Stock Validation Guard**: Prevents selling more quantity than currently available in stock.

### 4. 🚚 Purchase Management Module ([Purchases.tsx](file:///c:/Users/user/Documents/AI-Smart-Shop/src/pages/Purchases.tsx))
- **RecordPurchaseModal**: Record wholesale purchase orders with automatic stock replenishment.

### 5. 🤝 Supplier Management Module ([Suppliers.tsx](file:///c:/Users/user/Documents/AI-Smart-Shop/src/pages/Suppliers.tsx))
- **SupplierModal**: Manage wholesale vendors, contact details, and supplied product catalogs.

### 6. 🤖 AI Smart Assistant & Voice Interface ([AIAssistant.tsx](file:///c:/Users/user/Documents/AI-Smart-Shop/src/pages/AIAssistant.tsx))
- **Web Speech API Voice Recognition**: Real-time microphone-to-text input with **zero hardcoded defaults**.
- **Speech Synthesis**: Spoken audio output of AI short responses.
- **Natural-Language Query Engine**: Answers questions such as *"Which products are critical?"*, *"What should I restock?"*, *"Show today's sales"*.

### 7. 🚨 Proactive Alerts & Notification Center ([Alerts.tsx](file:///c:/Users/user/Documents/AI-Smart-Shop/src/pages/Alerts.tsx))
- Automated notification generation for low and critical stock events, synchronized with top header badge counters.

### 8. 📈 Analytics & Financial Intelligence ([Analytics.tsx](file:///c:/Users/user/Documents/AI-Smart-Shop/src/pages/Analytics.tsx))
- **Financial Cards**: Valuation, Revenue, Purchase Expenses, Estimated Profit Margins (`Revenue - Purchase Costs`).
- **Top-Selling Products**: Ranked list by total sales revenue.
- **Inventory Velocity**: Fast-moving vs slow-moving goods breakdown.
- **Category Valuation Distribution**: Relative visual distribution bars across categories.

---

## 📐 Stock Calculation Logic

Stock status is computed dynamically using mathematical threshold rules:

$$\text{Status} = \begin{cases} \text{CRITICAL} & \text{if } \text{quantity} \le \text{criticalStockThreshold} \\ \text{LOW} & \text{if } \text{quantity} \le \text{lowStockThreshold} \text{ and } \text{quantity} > \text{criticalStockThreshold} \\ \text{NORMAL} & \text{if } \text{quantity} > \text{lowStockThreshold} \end{cases}$$

---

## 🛠️ Technology Stack

- **Frontend Core**: React 19 + TypeScript + Vite
- **UI & Styling**: Custom SaaS CSS System (Vanilla CSS tokens, HSL status indicators, CSS Grid/Flexbox)
- **Icons**: Lucide React
- **State Management**: Reactive `ShopContext` with `DataService` LocalStorage persistence & 21 realistic pre-seeded products
- **Speech & Voice**: Web Speech API (`SpeechRecognition` & `SpeechSynthesis`)

---

## 📂 Project Architecture

```
AI-Smart-Shop/
├── public/              # Favicon and static icons
├── src/
│   ├── assets/          # SVG branding assets
│   ├── components/      # Reusable UI components
│   │   ├── common/      # Header, Sidebar, StatCard, StatusBadge, Modal
│   │   ├── inventory/   # ProductModal, StockAdjustModal
│   │   ├── sales/       # RecordSaleModal
│   │   ├── purchases/   # RecordPurchaseModal
│   │   └── suppliers/   # SupplierModal
│   ├── context/         # ShopContext (central reactive state provider)
│   ├── data/            # Sample dataset (21 realistic retail products across 6 categories)
│   ├── layouts/         # MainLayout SaaS shell
│   ├── pages/           # Module Views (Dashboard, Inventory, Sales, Purchases, Suppliers, AI Assistant, Alerts, Analytics, Settings, Profile, Login, Signup)
│   ├── services/        # DataService, StockIntelligence, AIService, VoiceService
│   ├── types/           # TypeScript interfaces & types
│   ├── App.tsx          # Router setup
│   ├── main.tsx         # App entry point
│   └── index.css        # Global CSS variables & design tokens
├── .gitignore           # Git ignore rules (.env, node_modules, dist)
├── package.json         # NPM manifest
├── README.md            # Comprehensive project documentation
└── vite.config.ts       # Vite configuration
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
3. **Start local development server**:
   ```bash
   npm run dev
   ```
4. **Open in browser**:
   Navigate to `http://localhost:5173`.

---

## 📊 Review-1 Evaluation Scope

- [x] **Smart Dashboard Shell**: Live KPIs, critical alert banner, quick action modals.
- [x] **Full Inventory CRUD & Stock Adjust**: Add, edit, delete products and quick stock updates.
- [x] **Sales & Purchase Sync**: Automatic stock deduction on sale and increment on purchase.
- [x] **Supplier Directory**: Vendor contacts and product catalogs.
- [x] **AI Assistant & Voice Input**: Real-time Web Speech API recognition & speech synthesis.
- [x] **Proactive Notifications**: Dynamic alert generation and synchronized header counter.
- [x] **Analytics**: Profit margin metrics, top-selling items, fast/slow-moving goods intelligence.

---

## 📄 License & Evaluation Note
Submitted for academic evaluation (Review 1). Developed for AI SMART SHOP presentation.
