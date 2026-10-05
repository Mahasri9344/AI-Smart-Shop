import { describe, it, expect } from 'vitest';
import { AIService } from './aiService';
import type { Product, Sale, Purchase, Supplier } from '../types';

describe('AI Assistant Natural Language & Dynamic Response Matching (aiService.ts)', () => {
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

  // --- LOW STOCK Natural Language Variations ---
  describe('CHECK_LOW_STOCK Natural Language Variations', () => {
    it('1. Tamil Unicode: "எந்த பொருள் குறைவாக இருக்கிறது?"', () => {
      const res = AIService.processQuery('எந்த பொருள் குறைவாக இருக்கிறது?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('CHECK_LOW_STOCK');
      expect(res.text).toContain('Whole Cashews');
      expect(res.lang).toBe('ta');
    });

    it('2. Tamil Unicode: "எந்த பொருட்கள் குறைவாக இருக்கின்றன?"', () => {
      const res = AIService.processQuery('எந்த பொருட்கள் குறைவாக இருக்கின்றன?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('CHECK_LOW_STOCK');
      expect(res.text).toContain('Whole Cashews');
      expect(res.lang).toBe('ta');
    });

    it('3. Tamil Unicode: "கடையில் எந்த பொருள் குறைவாக உள்ளது?"', () => {
      const res = AIService.processQuery('கடையில் எந்த பொருள் குறைவாக உள்ளது?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('CHECK_LOW_STOCK');
      expect(res.text).toContain('Whole Cashews');
      expect(res.lang).toBe('ta');
    });

    it('4. Tamil Unicode: "குறைவாக உள்ள பொருட்கள் என்ன?"', () => {
      const res = AIService.processQuery('குறைவாக உள்ள பொருட்கள் என்ன?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('CHECK_LOW_STOCK');
      expect(res.text).toContain('Whole Cashews');
      expect(res.lang).toBe('ta');
    });

    it('5. Tamil Unicode: "எந்த பொருட்களின் stock குறைவாக உள்ளது?"', () => {
      const res = AIService.processQuery('எந்த பொருட்களின் stock குறைவாக உள்ளது?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('CHECK_LOW_STOCK');
      expect(res.text).toContain('Whole Cashews');
      expect(res.lang).toBe('ta');
    });

    it('6. Tanglish: "entha porul kuraiva irukku"', () => {
      const res = AIService.processQuery('entha porul kuraiva irukku', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('CHECK_LOW_STOCK');
      expect(res.text).toContain('Whole Cashews');
      expect(res.lang).toBe('ta');
    });

    it('7. Tanglish: "entha porutkal kuraiva irukku"', () => {
      const res = AIService.processQuery('entha porutkal kuraiva irukku', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('CHECK_LOW_STOCK');
      expect(res.text).toContain('Whole Cashews');
      expect(res.lang).toBe('ta');
    });

    it('8. Tanglish: "entha porul kammiya irukku"', () => {
      const res = AIService.processQuery('entha porul kammiya irukku', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('CHECK_LOW_STOCK');
      expect(res.text).toContain('Whole Cashews');
      expect(res.lang).toBe('ta');
    });

    it('9. Tanglish: "entha items kammiya irukku"', () => {
      const res = AIService.processQuery('entha items kammiya irukku', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('CHECK_LOW_STOCK');
      expect(res.text).toContain('Whole Cashews');
      expect(res.lang).toBe('ta');
    });

    it('10. Tanglish: "kuraiva irukkura porutkal enna"', () => {
      const res = AIService.processQuery('kuraiva irukkura porutkal enna', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('CHECK_LOW_STOCK');
      expect(res.text).toContain('Whole Cashews');
      expect(res.lang).toBe('ta');
    });

    it('11. Tanglish: "stock la enna kammiya irukku"', () => {
      const res = AIService.processQuery('stock la enna kammiya irukku', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('CHECK_LOW_STOCK');
      expect(res.text).toContain('Whole Cashews');
      expect(res.lang).toBe('ta');
    });

    it('12. Tanglish: "kadaiyila enna porul kammiya irukku"', () => {
      const res = AIService.processQuery('kadaiyila enna porul kammiya irukku', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('CHECK_LOW_STOCK');
      expect(res.text).toContain('Whole Cashews');
      expect(res.lang).toBe('ta');
    });

    it('13. English: "Which products are low in stock?"', () => {
      const res = AIService.processQuery('Which products are low in stock?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers, 'en');
      expect(res.intent).toBe('CHECK_LOW_STOCK');
      expect(res.text).toContain('Whole Cashews');
      expect(res.lang).toBe('en');
    });
  });

  // --- CRITICAL STOCK Natural Language Variations ---
  describe('CHECK_CRITICAL_STOCK Natural Language Variations', () => {
    it('1. Tamil Unicode: "எந்த பொருட்கள் critical-ஆ இருக்கிறது?"', () => {
      const res = AIService.processQuery('எந்த பொருட்கள் critical-ஆ இருக்கிறது?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('CHECK_CRITICAL_STOCK');
      expect(res.text).toContain('California Almonds');
      expect(res.lang).toBe('ta');
    });

    it('2. Tamil Unicode: "எந்த பொருள் ரொம்ப குறைவாக இருக்கிறது?"', () => {
      const res = AIService.processQuery('எந்த பொருள் ரொம்ப குறைவாக இருக்கிறது?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('CHECK_CRITICAL_STOCK');
      expect(res.text).toContain('California Almonds');
      expect(res.lang).toBe('ta');
    });

    it('3. Tanglish: "entha porul romba kammiya irukku"', () => {
      const res = AIService.processQuery('entha porul romba kammiya irukku', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('CHECK_CRITICAL_STOCK');
      expect(res.text).toContain('California Almonds');
      expect(res.lang).toBe('ta');
    });

    it('4. Tanglish: "entha porutkal critical la irukku"', () => {
      const res = AIService.processQuery('entha porutkal critical la irukku', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('CHECK_CRITICAL_STOCK');
      expect(res.text).toContain('California Almonds');
      expect(res.lang).toBe('ta');
    });
  });

  // --- REORDER Natural Language Variations ---
  describe('RESTOCK_REQUIRED Natural Language Variations', () => {
    it('1. Tamil Unicode: "எந்த பொருட்களை reorder பண்ண வேண்டும்?"', () => {
      const res = AIService.processQuery('எந்த பொருட்களை reorder பண்ண வேண்டும்?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('RESTOCK_REQUIRED');
      expect(res.text).toContain('Reorder');
      expect(res.lang).toBe('ta');
    });

    it('2. Tamil Unicode: "என்ன பொருள் வாங்க வேண்டும்?"', () => {
      const res = AIService.processQuery('என்ன பொருள் வாங்க வேண்டும்?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('RESTOCK_REQUIRED');
      expect(res.text).toContain('Reorder');
      expect(res.lang).toBe('ta');
    });

    it('3. Tamil Unicode: "எந்த பொருள் வாங்கணும்?"', () => {
      const res = AIService.processQuery('எந்த பொருள் வாங்கணும்?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('RESTOCK_REQUIRED');
      expect(res.text).toContain('Reorder');
      expect(res.lang).toBe('ta');
    });

    it('4. Tanglish: "enna porul reorder pannanum"', () => {
      const res = AIService.processQuery('enna porul reorder pannanum', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('RESTOCK_REQUIRED');
      expect(res.text).toContain('Reorder');
      expect(res.lang).toBe('ta');
    });

    it('5. Tanglish: "entha porul vaanganum"', () => {
      const res = AIService.processQuery('entha porul vaanganum', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('RESTOCK_REQUIRED');
      expect(res.text).toContain('Reorder');
      expect(res.lang).toBe('ta');
    });

    it('6. Tanglish: "enna items vaanganum"', () => {
      const res = AIService.processQuery('enna items vaanganum', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('RESTOCK_REQUIRED');
      expect(res.text).toContain('Reorder');
      expect(res.lang).toBe('ta');
    });
  });
});
