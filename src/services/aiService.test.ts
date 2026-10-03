import { describe, it, expect } from 'vitest';
import { AIService } from './aiService';
import type { Product, Sale, Purchase, Supplier } from '../types';

describe('AI Assistant Intent Processor with Automatic Language Matching (aiService.ts)', () => {
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

  // --- English Intent Tests ---
  describe('English Queries (English question -> English response)', () => {
    it('1. should identify CHECK_LOW_STOCK intent in English', () => {
      const res = AIService.processQuery('Which products are low in stock?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers, 'en');
      expect(res.intent).toBe('CHECK_LOW_STOCK');
      expect(res.text).toContain('Whole Cashews');
      expect(res.lang).toBe('en');
    });

    it('2. should identify CHECK_CRITICAL_STOCK intent in English', () => {
      const res = AIService.processQuery('Which products are critical?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers, 'en');
      expect(res.intent).toBe('CHECK_CRITICAL_STOCK');
      expect(res.text).toContain('California Almonds');
      expect(res.lang).toBe('en');
    });

    it('3. should identify RESTOCK_REQUIRED intent in English', () => {
      const res = AIService.processQuery('What should I reorder?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers, 'en');
      expect(res.intent).toBe('RESTOCK_REQUIRED');
      expect(res.text).toContain('CRITICAL');
      expect(res.lang).toBe('en');
    });

    it('4. should calculate today\'s revenue correctly in English', () => {
      const res = AIService.processQuery('What are today\'s sales?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers, 'en');
      expect(res.intent).toBe('CHECK_TODAY_SALES');
      expect(res.text).toContain('₹1,900');
      expect(res.lang).toBe('en');
    });

    it('5. should identify CHECK_TOP_SELLING intent in English', () => {
      const res = AIService.processQuery('Which products are top selling?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers, 'en');
      expect(res.intent).toBe('CHECK_TOP_SELLING');
      expect(res.text).toContain('Whole Cashews');
      expect(res.lang).toBe('en');
    });

    it('6. should calculate inventory retail and cost valuation in English', () => {
      const res = AIService.processQuery('How much inventory value do I have?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers, 'en');
      expect(res.intent).toBe('CHECK_INVENTORY_VALUE');
      expect(res.text).toContain('₹16,000');
      expect(res.lang).toBe('en');
    });

    it('7. should calculate profit and gross margin in English', () => {
      const res = AIService.processQuery('How much profit have I made?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers, 'en');
      expect(res.intent).toBe('CHECK_PROFIT');
      expect(res.text).toContain('Total sales revenue');
      expect(res.lang).toBe('en');
    });

    it('8. should return recent purchase orders in English', () => {
      const res = AIService.processQuery('Show my recent purchases.', sampleProducts, sampleSales, samplePurchases, sampleSuppliers, 'en');
      expect(res.intent).toBe('CHECK_PURCHASES');
      expect(res.text).toContain('Organic Turmeric');
      expect(res.lang).toBe('en');
    });

    it('9. should return active suppliers in English', () => {
      const res = AIService.processQuery('Show my suppliers.', sampleProducts, sampleSales, samplePurchases, sampleSuppliers, 'en');
      expect(res.intent).toBe('CHECK_SUPPLIERS');
      expect(res.text).toContain('Royal Spices');
      expect(res.text).toContain('Green Harvest');
      expect(res.lang).toBe('en');
    });

    it('10. should generate executive summary in English', () => {
      const res = AIService.processQuery('Give me a summary of my shop.', sampleProducts, sampleSales, samplePurchases, sampleSuppliers, 'en');
      expect(res.intent).toBe('CHECK_SHOP_SUMMARY');
      expect(res.text).toContain('Shop Summary');
      expect(res.text).toContain('3 products');
      expect(res.lang).toBe('en');
    });

    it('11. should return product quantity in English', () => {
      const res = AIService.processQuery('How many almonds are available?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers, 'en');
      expect(res.intent).toBe('CHECK_PRODUCT_QUANTITY');
      expect(res.text).toContain('California Almonds: 2 kg');
      expect(res.lang).toBe('en');
    });

    it('12. should handle unknown questions gracefully in English', () => {
      const res = AIService.processQuery('What is the weather today?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers, 'en');
      expect(res.intent).toBe('DEFAULT_HELP');
      expect(res.text).toContain('I didn\'t quite catch that');
      expect(res.lang).toBe('en');
    });
  });

  // --- Tamil & Tanglish Automatic Language Matching Tests ---
  describe('Tamil & Tanglish Queries (Tamil/Tanglish question -> Tamil response)', () => {
    it('1. Tamil Unicode question -> Tamil response: "எந்த பொருட்கள் குறைவாக இருக்கு?"', () => {
      const res = AIService.processQuery('எந்த பொருட்கள் குறைவாக இருக்கு?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('CHECK_LOW_STOCK');
      expect(res.text).toContain('Whole Cashews');
      expect(res.lang).toBe('ta');
    });

    it('2. Tamil Unicode question -> Tamil response: "எந்த பொருட்கள் குறைவாக இருக்கிறது?"', () => {
      const res = AIService.processQuery('எந்த பொருட்கள் குறைவாக இருக்கிறது?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('CHECK_LOW_STOCK');
      expect(res.text).toContain('Whole Cashews');
      expect(res.lang).toBe('ta');
    });

    it('3. Tanglish question -> Tamil response: "in the Porul kuraiya irukku"', () => {
      const res = AIService.processQuery('in the Porul kuraiya irukku', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('CHECK_LOW_STOCK');
      expect(res.text).toContain('Whole Cashews');
      expect(res.lang).toBe('ta');
    });

    it('4. Tanglish question -> Tamil response: "in the Porur kurawar irukkathu"', () => {
      const res = AIService.processQuery('in the Porur kurawar irukkathu', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('CHECK_LOW_STOCK');
      expect(res.text).toContain('Whole Cashews');
      expect(res.lang).toBe('ta');
    });

    it('5. Tanglish question -> Tamil response: "entha porul kammiya irukku"', () => {
      const res = AIService.processQuery('entha porul kammiya irukku', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('CHECK_LOW_STOCK');
      expect(res.text).toContain('Whole Cashews');
      expect(res.lang).toBe('ta');
    });

    it('6. Tanglish question -> Tamil response: "entha products kammiya irukku"', () => {
      const res = AIService.processQuery('entha products kammiya irukku', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('CHECK_LOW_STOCK');
      expect(res.text).toContain('Whole Cashews');
      expect(res.lang).toBe('ta');
    });

    it('7. Tanglish question -> Tamil response: "indha porul stock kammiya irukku"', () => {
      const res = AIService.processQuery('indha porul stock kammiya irukku', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('CHECK_LOW_STOCK');
      expect(res.text).toContain('Whole Cashews');
      expect(res.lang).toBe('ta');
    });

    it('8. Tanglish question -> Tamil response: "Entha products kuraivaga irukku?"', () => {
      const res = AIService.processQuery('Entha products kuraivaga irukku?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('CHECK_LOW_STOCK');
      expect(res.text).toContain('Whole Cashews');
      expect(res.lang).toBe('ta');
    });

    it('9. Tanglish question -> Tamil response: "entha product kuraiyaga irukku"', () => {
      const res = AIService.processQuery('entha product kuraiyaga irukku', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('CHECK_LOW_STOCK');
      expect(res.text).toContain('Whole Cashews');
      expect(res.lang).toBe('ta');
    });

    it('10. Tanglish question -> Tamil response: "kuraiyaga irukkuthu"', () => {
      const res = AIService.processQuery('kuraiyaga irukkuthu', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('CHECK_LOW_STOCK');
      expect(res.text).toContain('Whole Cashews');
      expect(res.lang).toBe('ta');
    });

    it('11. Tanglish question -> Tamil response: "enna products low stock la irukku?"', () => {
      const res = AIService.processQuery('enna products low stock la irukku?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('CHECK_LOW_STOCK');
      expect(res.text).toContain('Whole Cashews');
      expect(res.lang).toBe('ta');
    });

    it('12. Tanglish question -> Tamil response: "innaiku evlo sales aachu?"', () => {
      const res = AIService.processQuery('innaiku evlo sales aachu?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('CHECK_TODAY_SALES');
      expect(res.text).toContain('இன்றைய விற்பனை: ₹1,900');
      expect(res.lang).toBe('ta');
    });

    it('13. Tamil Unicode: "குறைந்த stock"', () => {
      const res = AIService.processQuery('குறைந்த stock', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('CHECK_LOW_STOCK');
      expect(res.text).toContain('Whole Cashews');
      expect(res.lang).toBe('ta');
    });

    it('14. Tamil Unicode: "குறைவாக உள்ள பொருட்கள்"', () => {
      const res = AIService.processQuery('குறைவாக உள்ள பொருட்கள்', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('CHECK_LOW_STOCK');
      expect(res.text).toContain('Whole Cashews');
      expect(res.lang).toBe('ta');
    });

    it('15. Tamil Unicode: "இன்று எவ்வளவு sales?"', () => {
      const res = AIService.processQuery('இன்று எவ்வளவு sales?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('CHECK_TODAY_SALES');
      expect(res.text).toContain('இன்றைய விற்பனை: ₹1,900');
      expect(res.lang).toBe('ta');
    });

    it('16. Tamil Unicode: "லாபம் எவ்வளவு?"', () => {
      const res = AIService.processQuery('லாபம் எவ்வளவு?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('CHECK_PROFIT');
      expect(res.text).toContain('நிகர லாபம்');
      expect(res.lang).toBe('ta');
    });

    it('17. Tamil Unicode: "எந்த பொருட்கள் அதிகமாக விற்கிறது?"', () => {
      const res = AIService.processQuery('எந்த பொருட்கள் அதிகமாக விற்கிறது?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('CHECK_TOP_SELLING');
      expect(res.text).toContain('அதிகமாக விற்ற பொருட்கள்');
      expect(res.lang).toBe('ta');
    });

    it('18. Tamil Unicode: "என்ன பொருட்களை reorder செய்ய வேண்டும்?"', () => {
      const res = AIService.processQuery('என்ன பொருட்களை reorder செய்ய வேண்டும்?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('RESTOCK_REQUIRED');
      expect(res.text).toContain('Reorder');
      expect(res.lang).toBe('ta');
    });

    it('19. Tanglish Reorder: "edhai reorder pannanum"', () => {
      const res = AIService.processQuery('edhai reorder pannanum', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('RESTOCK_REQUIRED');
      expect(res.text).toContain('Reorder');
      expect(res.lang).toBe('ta');
    });

    it('20. Tanglish Reorder variation: "enna reorder pannanum"', () => {
      const res = AIService.processQuery('enna reorder pannanum', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('RESTOCK_REQUIRED');
      expect(res.text).toContain('Reorder');
      expect(res.lang).toBe('ta');
    });

    it('21. Tamil Critical Stock: "எந்த பொருட்கள் critical-ஆ இருக்கு?"', () => {
      const res = AIService.processQuery('எந்த பொருட்கள் critical-ஆ இருக்கு?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('CHECK_CRITICAL_STOCK');
      expect(res.text).toContain('California Almonds');
      expect(res.lang).toBe('ta');
    });

    it('22. Tamil Graceful Fallback for unknown questions', () => {
      const res = AIService.processQuery('என்ன வானிலை இன்று?', sampleProducts, sampleSales, samplePurchases, sampleSuppliers);
      expect(res.intent).toBe('DEFAULT_HELP');
      expect(res.text).toContain('மன்னிக்கவும், கேட்கப்பட்ட கேள்வி புரியவில்லை');
      expect(res.lang).toBe('ta');
    });
  });
});
