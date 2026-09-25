import { describe, it, expect } from 'vitest';
import { AIService } from './aiService';
import type { Product, Sale, Purchase } from '../types';

describe('AI Assistant Intent Processor (aiService.ts)', () => {
  const sampleProducts: Product[] = [
    {
      id: 'p1',
      name: 'California Almonds',
      category: 'Dry Fruits',
      description: 'Raw Almonds',
      quantity: 2,
      unit: 'kg',
      purchasePrice: 650,
      sellingPrice: 900,
      lowStockThreshold: 10,
      criticalStockThreshold: 3,
      supplierId: 'sup-1',
      supplierName: 'Royal Spices',
      status: 'CRITICAL',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'p2',
      name: 'Whole Cashews',
      category: 'Dry Fruits',
      description: 'Kaju W240',
      quantity: 8,
      unit: 'kg',
      purchasePrice: 700,
      sellingPrice: 950,
      lowStockThreshold: 12,
      criticalStockThreshold: 4,
      supplierId: 'sup-1',
      supplierName: 'Royal Spices',
      status: 'LOW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'p3',
      name: 'Organic Turmeric',
      category: 'Groceries',
      description: 'Haldi Powder',
      quantity: 30,
      unit: 'kg',
      purchasePrice: 140,
      sellingPrice: 220,
      lowStockThreshold: 15,
      criticalStockThreshold: 5,
      supplierId: 'sup-2',
      supplierName: 'Green Harvest',
      status: 'NORMAL',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const todayStr = new Date().toISOString();

  const sampleSales: Sale[] = [
    {
      id: 's1',
      productId: 'p2',
      productName: 'Whole Cashews',
      quantity: 2,
      unit: 'kg',
      unitPrice: 950,
      totalAmount: 1900,
      timestamp: todayStr
    }
  ];

  const samplePurchases: Purchase[] = [
    {
      id: 'purch-1',
      productId: 'p3',
      productName: 'Organic Turmeric',
      supplierId: 'sup-2',
      supplierName: 'Green Harvest',
      quantity: 20,
      unit: 'kg',
      unitPrice: 140,
      totalAmount: 2800,
      timestamp: todayStr
    }
  ];

  it('should identify CHECK_CRITICAL_STOCK intent when query contains "critical"', () => {
    const res = AIService.processQuery('Which products are critical?', sampleProducts, sampleSales, samplePurchases);
    expect(res.intent).toBe('CHECK_CRITICAL_STOCK');
    expect(res.text).toContain('California Almonds');
  });

  it('should identify RESTOCK_REQUIRED intent when query contains "restock" or "low"', () => {
    const res = AIService.processQuery('What should I restock?', sampleProducts, sampleSales, samplePurchases);
    expect(res.intent).toBe('RESTOCK_REQUIRED');
    expect(res.text).toContain('CRITICAL');
  });

  it('should calculate today\'s revenue correctly for sales intent', () => {
    const res = AIService.processQuery('Show today sales revenue', sampleProducts, sampleSales, samplePurchases);
    expect(res.intent).toBe('CHECK_TODAY_SALES');
    expect(res.text).toContain('₹1,900');
  });

  it('should calculate today\'s purchase costs correctly for purchase intent', () => {
    const res = AIService.processQuery('Show today purchases', sampleProducts, sampleSales, samplePurchases);
    expect(res.intent).toBe('CHECK_TODAY_PURCHASES');
    expect(res.text).toContain('₹2,800');
  });

  it('should return specific product quantity when product name is mentioned', () => {
    const res = AIService.processQuery('How many almonds are available?', sampleProducts, sampleSales, samplePurchases);
    expect(res.intent).toBe('CHECK_PRODUCT_QUANTITY');
    expect(res.text).toContain('California Almonds: 2 kg');
  });
});
