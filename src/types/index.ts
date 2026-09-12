export type StockStatus = 'NORMAL' | 'LOW' | 'CRITICAL';

export type UnitType = 'kg' | 'g' | 'L' | 'ml' | 'units' | 'packets' | 'boxes';

export type ProductCategory = 
  | 'Dry Fruits'
  | 'Spices'
  | 'Groceries'
  | 'Natural Sugars'
  | 'Beverages'
  | 'Other';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  quantity: number;
  unit: UnitType;
  purchasePrice: number;
  sellingPrice: number;
  lowStockThreshold: number;
  criticalStockThreshold: number;
  supplierId: string;
  supplierName: string;
  status: StockStatus;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: UnitType;
  unitPrice: number;
  totalAmount: number;
  timestamp: string;
}

export interface Purchase {
  id: string;
  productId: string;
  productName: string;
  supplierId: string;
  supplierName: string;
  quantity: number;
  unit: UnitType;
  unitPrice: number;
  totalAmount: number;
  timestamp: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactNumber: string;
  email: string;
  address: string;
  productsSupplied: string[];
  totalPurchases: number;
  lastPurchaseDate: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface NotificationItem {
  id: string;
  type: 'CRITICAL_STOCK' | 'LOW_STOCK' | 'STOCK_UPDATED' | 'SALE_RECORDED' | 'PURCHASE_RECORDED' | 'AI_RECOMMENDATION';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  productId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  shopName: string;
  phone: string;
  address: string;
  role: string;
}
