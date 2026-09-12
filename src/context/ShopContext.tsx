import React, { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import type { Product, Sale, Purchase, Supplier, NotificationItem, UserProfile } from '../types';
import { DataService } from '../services/dataService';
import { updateProductStockStatus, calculateStockStatus } from '../services/stockIntelligence';

interface ShopContextType {
  products: Product[];
  sales: Sale[];
  purchases: Purchase[];
  suppliers: Supplier[];
  notifications: NotificationItem[];
  userProfile: UserProfile;
  
  // Dynamic Calculated Metrics
  totalProducts: number;
  totalStockUnits: number;
  inventoryValue: number;
  lowStockCount: number;
  criticalStockCount: number;
  todaySalesAmount: number;
  todayPurchasesAmount: number;
  unreadNotificationsCount: number;

  // Actions
  addProduct: (product: Omit<Product, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (productId: string, deltaQuantity: number) => void;
  recordSale: (productId: string, quantity: number) => { success: boolean; message: string };
  recordPurchase: (productId: string, quantity: number, purchasePrice: number, supplierId: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  resetToSampleData: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(DataService.getUserProfile());

  // Load initial data
  useEffect(() => {
    setProducts(DataService.getProducts());
    setSales(DataService.getSales());
    setPurchases(DataService.getPurchases());
    setSuppliers(DataService.getSuppliers());
    setNotifications(DataService.getNotifications());
    setUserProfile(DataService.getUserProfile());
  }, []);

  // Save changes to LocalStorage
  useEffect(() => {
    if (products.length > 0) DataService.saveProducts(products);
  }, [products]);

  useEffect(() => {
    DataService.saveSales(sales);
  }, [sales]);

  useEffect(() => {
    DataService.savePurchases(purchases);
  }, [purchases]);

  useEffect(() => {
    DataService.saveNotifications(notifications);
  }, [notifications]);

  // Derived Metrics
  const totalProducts = products.length;
  
  const totalStockUnits = useMemo(() => {
    return products.reduce((acc, p) => acc + p.quantity, 0);
  }, [products]);

  const inventoryValue = useMemo(() => {
    return products.reduce((acc, p) => acc + (p.quantity * p.sellingPrice), 0);
  }, [products]);

  const lowStockCount = useMemo(() => {
    return products.filter(p => p.status === 'LOW').length;
  }, [products]);

  const criticalStockCount = useMemo(() => {
    return products.filter(p => p.status === 'CRITICAL').length;
  }, [products]);

  const todaySalesAmount = useMemo(() => {
    const today = new Date().toDateString();
    return sales
      .filter(s => new Date(s.timestamp).toDateString() === today)
      .reduce((acc, s) => acc + s.totalAmount, 0);
  }, [sales]);

  const todayPurchasesAmount = useMemo(() => {
    const today = new Date().toDateString();
    return purchases
      .filter(p => new Date(p.timestamp).toDateString() === today)
      .reduce((acc, p) => acc + p.totalAmount, 0);
  }, [purchases]);

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  // Helper to trigger proactive notification when stock drops
  const checkAndCreateStockAlert = (updatedProd: Product) => {
    if (updatedProd.status === 'CRITICAL') {
      const existingCriticalNotif = notifications.find(
        n => n.productId === updatedProd.id && n.type === 'CRITICAL_STOCK' && !n.read
      );
      if (!existingCriticalNotif) {
        const newNotif: NotificationItem = {
          id: `notif-${Date.now()}`,
          type: 'CRITICAL_STOCK',
          title: `🚨 Urgent Restock Needed: ${updatedProd.name}`,
          message: `${updatedProd.name} quantity is now ${updatedProd.quantity} ${updatedProd.unit} (Critical Threshold: ${updatedProd.criticalStockThreshold} ${updatedProd.unit}).`,
          timestamp: new Date().toISOString(),
          read: false,
          productId: updatedProd.id
        };
        setNotifications(prev => [newNotif, ...prev]);
      }
    } else if (updatedProd.status === 'LOW') {
      const existingLowNotif = notifications.find(
        n => n.productId === updatedProd.id && n.type === 'LOW_STOCK' && !n.read
      );
      if (!existingLowNotif) {
        const newNotif: NotificationItem = {
          id: `notif-${Date.now()}`,
          type: 'LOW_STOCK',
          title: `⚠ Low Stock Warning: ${updatedProd.name}`,
          message: `${updatedProd.name} quantity is now ${updatedProd.quantity} ${updatedProd.unit} (Low Threshold: ${updatedProd.lowStockThreshold} ${updatedProd.unit}).`,
          timestamp: new Date().toISOString(),
          read: false,
          productId: updatedProd.id
        };
        setNotifications(prev => [newNotif, ...prev]);
      }
    }
  };

  const addProduct = (newP: Omit<Product, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    const id = `prod-${Date.now()}`;
    const now = new Date().toISOString();
    const rawProd: Product = {
      ...newP,
      id,
      status: calculateStockStatus(newP.quantity, newP.lowStockThreshold, newP.criticalStockThreshold),
      createdAt: now,
      updatedAt: now
    };
    setProducts(prev => [rawProd, ...prev]);
  };

  const updateProduct = (updated: Product) => {
    const refreshed = updateProductStockStatus(updated);
    setProducts(prev => prev.map(p => p.id === refreshed.id ? refreshed : p));
    checkAndCreateStockAlert(refreshed);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const adjustStock = (productId: string, deltaQuantity: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const newQty = Math.max(0, p.quantity + deltaQuantity);
        const updated = updateProductStockStatus({ ...p, quantity: newQty });
        checkAndCreateStockAlert(updated);
        return updated;
      }
      return p;
    }));
  };

  const recordSale = (productId: string, quantity: number): { success: boolean; message: string } => {
    const targetProd = products.find(p => p.id === productId);
    if (!targetProd) return { success: false, message: 'Product not found' };
    if (targetProd.quantity < quantity) {
      return { success: false, message: `Insufficient stock. Current: ${targetProd.quantity} ${targetProd.unit}` };
    }

    const totalAmount = quantity * targetProd.sellingPrice;
    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      productId: targetProd.id,
      productName: targetProd.name,
      quantity,
      unit: targetProd.unit,
      unitPrice: targetProd.sellingPrice,
      totalAmount,
      timestamp: new Date().toISOString()
    };

    setSales(prev => [newSale, ...prev]);
    adjustStock(productId, -quantity);
    return { success: true, message: `Recorded sale of ${quantity} ${targetProd.unit} of ${targetProd.name}` };
  };

  const recordPurchase = (productId: string, quantity: number, purchasePrice: number, supplierId: string) => {
    const targetProd = products.find(p => p.id === productId);
    if (!targetProd) return;

    const supplierObj = suppliers.find(s => s.id === supplierId);
    const supplierName = supplierObj ? supplierObj.name : targetProd.supplierName;
    const totalAmount = quantity * purchasePrice;

    const newPurchase: Purchase = {
      id: `purch-${Date.now()}`,
      productId: targetProd.id,
      productName: targetProd.name,
      supplierId,
      supplierName,
      quantity,
      unit: targetProd.unit,
      unitPrice: purchasePrice,
      totalAmount,
      timestamp: new Date().toISOString()
    };

    setPurchases(prev => [newPurchase, ...prev]);
    
    // Automatically increment stock on purchase
    adjustStock(productId, quantity);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const resetToSampleData = () => {
    DataService.resetToSampleData();
    setProducts(DataService.getProducts());
    setSales(DataService.getSales());
    setPurchases(DataService.getPurchases());
    setSuppliers(DataService.getSuppliers());
    setNotifications(DataService.getNotifications());
    setUserProfile(DataService.getUserProfile());
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        sales,
        purchases,
        suppliers,
        notifications,
        userProfile,
        totalProducts,
        totalStockUnits,
        inventoryValue,
        lowStockCount,
        criticalStockCount,
        todaySalesAmount,
        todayPurchasesAmount,
        unreadNotificationsCount,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustStock,
        recordSale,
        recordPurchase,
        markNotificationAsRead,
        clearAllNotifications,
        resetToSampleData
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
