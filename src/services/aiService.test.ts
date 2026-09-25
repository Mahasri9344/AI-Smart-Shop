import { describe, it, expect } from 'vitest';
import { AIService } from './aiService';
import type { Product, Sale, Purchase, Supplier } from '../types';

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

  const sampleSuppliers: Supplier[] = [
    {
      id: 'sup-1',
      name: 'Royal Spices',
      contactNumber: '+91 98765 43210',
      email: 'contact@royalspices.com',
      address: 'Spice Market, Delhi',
      productsSupplied: ['Almonds', 'Cashews'],
      totalPurchases: 15000,
      lastPurchaseDate: '2026-09-20',
      status: 'ACTIVE'
    },
    {
      id: 'sup-2',
      name: 'Green Harvest',
      contactNumber: '+91 98765 43211',
      email: 'info@greenharvest.com',
      address: 'Organic Plaza, Bangalore',
      productsSupplied: ['Turmeric'],
      totalPurchases: 8000,
      lastPurchaseDate: '2026-09-22',
      status: 'ACTIVE'
    }
  ];

  it('1. should identify CHECK_LOW_STOCK intent when asking for low stock items', () => {
    const res = AIService.processQuery('Which products are low in stock?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
    expect(res.intent).toBe('CHECK_LOW_STOCK');
    expect(res.text).toContain('Whole Cashews');
  });

  it('2. should identify CHECK_CRITICAL_STOCK intent when query contains "critical"', () => {
    const res = AIService.processQuery('Which products are critical?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
    expect(res.intent).toBe('CHECK_CRITICAL_STOCK');
    expect(res.text).toContain('California Almonds');
  });

  it('3. should identify RESTOCK_REQUIRED intent when query contains "reorder"', () => {
    const res = AIService.processQuery('What should I reorder?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
    expect(res.intent).toBe('RESTOCK_REQUIRED');
    expect(res.text).toContain('CRITICAL');
  });

  it('4. should calculate today\'s revenue correctly for sales intent', () => {
    const res = AIService.processQuery('What are today\'s sales?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
    expect(res.intent).toBe('CHECK_TODAY_SALES');
    expect(res.text).toContain('₹1,900');
  });

  it('5. should identify CHECK_TOP_SELLING intent and rank products', () => {
    const res = AIService.processQuery('Which products are top selling?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
    expect(res.intent).toBe('CHECK_TOP_SELLING');
    expect(res.text).toContain('Whole Cashews');
  });

  it('6. should calculate inventory retail and cost valuation correctly', () => {
    const res = AIService.processQuery('How much inventory value do I have?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
    expect(res.intent).toBe('CHECK_INVENTORY_VALUE');
    // 2*900 + 8*950 + 30*220 = 1800 + 7600 + 6600 = 16000
    expect(res.text).toContain('₹16,000');
  });

  it('7. should calculate profit and gross margin percentage', () => {
    const res = AIService.processQuery('How much profit have I made?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
    expect(res.intent).toBe('CHECK_PROFIT');
    expect(res.text).toContain('Total sales revenue');
  });

  it('8. should return recent purchase orders', () => {
    const res = AIService.processQuery('Show my recent purchases.', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
    expect(res.intent).toBe('CHECK_PURCHASES');
    expect(res.text).toContain('Organic Turmeric');
  });

  it('9. should return active suppliers from directory', () => {
    const res = AIService.processQuery('Show my suppliers.', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
    expect(res.intent).toBe('CHECK_SUPPLIERS');
    expect(res.text).toContain('Royal Spices');
    expect(res.text).toContain('Green Harvest');
  });

  it('10. should generate holistic executive summary of shop', () => {
    const res = AIService.processQuery('Give me a summary of my shop.', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
    expect(res.intent).toBe('CHECK_SHOP_SUMMARY');
    expect(res.text).toContain('Shop Summary');
    expect(res.text).toContain('3 products');
  });

  it('11. should return specific product quantity when product name is mentioned', () => {
    const res = AIService.processQuery('How many almonds are available?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
    expect(res.intent).toBe('CHECK_PRODUCT_QUANTITY');
    expect(res.text).toContain('California Almonds: 2 kg');
  });

  it('12. should handle unknown questions gracefully with help guidance', () => {
    const res = AIService.processQuery('What is the weather today?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
    expect(res.intent).toBe('DEFAULT_HELP');
    expect(res.text).toContain('I didn\'t quite catch that');
  });
});
