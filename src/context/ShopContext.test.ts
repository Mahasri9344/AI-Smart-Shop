import { describe, it, expect, beforeEach } from 'vitest';
import type { Product, Sale, Purchase, NotificationItem } from '../types';
import { updateProductStockStatus } from '../services/stockIntelligence';

describe('Inventory & Sales Transaction Rules (ShopContext Business Logic)', () => {
  let products: Product[];
  let sales: Sale[];
  let purchases: Purchase[];
  let notifications: NotificationItem[];

  beforeEach(() => {
    products = [
      {
        id: 'prod-almonds',
        name: 'California Almonds',
        category: 'Dry Fruits',
        description: 'Raw Almonds',
        quantity: 5,
        unit: 'kg',
        purchasePrice: 600,
        sellingPrice: 900,
        lowStockThreshold: 10,
        criticalStockThreshold: 3,
        supplierId: 'sup-1',
        supplierName: 'Royal Spices',
        status: 'LOW',
        createdAt: '2026-09-01T10:00:00Z',
        updatedAt: '2026-09-01T10:00:00Z'
      },
      {
        id: 'prod-cashews',
        name: 'Whole Cashews',
        category: 'Dry Fruits',
        description: 'Kaju W240',
        quantity: 20,
        unit: 'kg',
        purchasePrice: 700,
        sellingPrice: 1000,
        lowStockThreshold: 12,
        criticalStockThreshold: 4,
        supplierId: 'sup-1',
        supplierName: 'Royal Spices',
        status: 'NORMAL',
        createdAt: '2026-09-01T10:00:00Z',
        updatedAt: '2026-09-01T10:00:00Z'
      }
    ];
    sales = [];
    purchases = [];
    notifications = [];
  });

  // Business Logic Simulation Helpers matching ShopContext.tsx implementation
  const adjustStock = (productId: string, deltaQuantity: number) => {
    products = products.map(p => {
      if (p.id === productId) {
        const newQty = Math.max(0, p.quantity + deltaQuantity);
        const updated = updateProductStockStatus({ ...p, quantity: newQty });
        checkAndCreateStockAlert(updated);
        return updated;
      }
      return p;
    });
  };

  const checkAndCreateStockAlert = (updatedProd: Product) => {
    if (updatedProd.status === 'CRITICAL') {
      const exists = notifications.some(n => n.productId === updatedProd.id && n.type === 'CRITICAL_STOCK' && !n.read);
      if (!exists) {
        notifications.unshift({
          id: `notif-${Date.now()}`,
          type: 'CRITICAL_STOCK',
          title: `Urgent Restock: ${updatedProd.name}`,
          message: `${updatedProd.name} quantity is ${updatedProd.quantity}`,
          timestamp: new Date().toISOString(),
          read: false,
          productId: updatedProd.id
        });
      }
    } else if (updatedProd.status === 'LOW') {
      const exists = notifications.some(n => n.productId === updatedProd.id && n.type === 'LOW_STOCK' && !n.read);
      if (!exists) {
        notifications.unshift({
          id: `notif-${Date.now()}`,
          type: 'LOW_STOCK',
          title: `Low Stock: ${updatedProd.name}`,
          message: `${updatedProd.name} quantity is ${updatedProd.quantity}`,
          timestamp: new Date().toISOString(),
          read: false,
          productId: updatedProd.id
        });
      }
    }
  };

  const recordSale = (productId: string, quantity: number) => {
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

    sales.unshift(newSale);
    adjustStock(productId, -quantity);
    return { success: true, message: `Recorded sale of ${quantity} ${targetProd.unit}` };
  };

  const recordPurchase = (productId: string, quantity: number, purchasePrice: number, supplierId: string) => {
    const targetProd = products.find(p => p.id === productId);
    if (!targetProd) return;

    const totalAmount = quantity * purchasePrice;
    const newPurchase: Purchase = {
      id: `purch-${Date.now()}`,
      productId: targetProd.id,
      productName: targetProd.name,
      supplierId,
      supplierName: targetProd.supplierName,
      quantity,
      unit: targetProd.unit,
      unitPrice: purchasePrice,
      totalAmount,
      timestamp: new Date().toISOString()
    };

    purchases.unshift(newPurchase);
    adjustStock(productId, quantity);
  };

  describe('Sales Transaction Validation Guard', () => {
    it('should REJECT sale when attempting to sell more than available stock', () => {
      const result = recordSale('prod-almonds', 10); // Current stock is 5 kg
      expect(result.success).toBe(false);
      expect(result.message).toContain('Insufficient stock');
      expect(sales.length).toBe(0);
      expect(products.find(p => p.id === 'prod-almonds')?.quantity).toBe(5); // Quantity unchanged
    });

    it('should PROCESS valid sale, deduct stock, calculate revenue, and update status', () => {
      const result = recordSale('prod-cashews', 5); // Current stock is 20 kg
      expect(result.success).toBe(true);
      expect(sales.length).toBe(1);
      expect(sales[0].totalAmount).toBe(5 * 1000); // 5 kg * ₹1000 = ₹5000

      const updatedCashews = products.find(p => p.id === 'prod-cashews');
      expect(updatedCashews?.quantity).toBe(15);
      expect(updatedCashews?.status).toBe('NORMAL'); // 15 > 12 low threshold
    });

    it('should trigger CRITICAL status and alert when sale drops stock below critical threshold', () => {
      const result = recordSale('prod-almonds', 3); // Almonds stock drops 5 -> 2 kg (Critical threshold: 3)
      expect(result.success).toBe(true);

      const updatedAlmonds = products.find(p => p.id === 'prod-almonds');
      expect(updatedAlmonds?.quantity).toBe(2);
      expect(updatedAlmonds?.status).toBe('CRITICAL');
      expect(notifications.length).toBe(1);
      expect(notifications[0].type).toBe('CRITICAL_STOCK');
    });
  });

  describe('Purchase Order Replenishment', () => {
    it('should INCREMENT stock quantity and calculate correct purchase cost', () => {
      recordPurchase('prod-almonds', 15, 600, 'sup-1'); // Almonds quantity 5 + 15 = 20 kg

      const updatedAlmonds = products.find(p => p.id === 'prod-almonds');
      expect(updatedAlmonds?.quantity).toBe(20);
      expect(updatedAlmonds?.status).toBe('NORMAL'); // 20 > 10 low threshold
      expect(purchases.length).toBe(1);
      expect(purchases[0].totalAmount).toBe(15 * 600); // ₹9000
    });
  });
});
