import { describe, it, expect, beforeEach } from 'vitest';
import { DataService } from './dataService';
import { LocalStorageAdapter } from './localStorageAdapter';

// In-memory localStorage mock for Node test environment
const memoryStore: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => memoryStore[key] || null,
  setItem: (key: string, value: string) => { memoryStore[key] = value; },
  removeItem: (key: string) => { delete memoryStore[key]; },
  clear: () => { Object.keys(memoryStore).forEach(k => delete memoryStore[k]); }
};

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true
});

describe('Data Storage Adapter (dataService.ts)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return seed sample products when localStorage is empty', () => {
    const products = DataService.getProducts();
    expect(products.length).toBeGreaterThan(0);
    expect(products[0].id).toBe('prod-1');
  });

  it('should save and retrieve products from localStorage correctly', () => {
    const customProduct = {
      id: 'prod-custom-1',
      name: 'Custom Dried Figs',
      category: 'Dry Fruits' as const,
      description: 'Test Figs',
      quantity: 5,
      unit: 'kg' as const,
      purchasePrice: 1000,
      sellingPrice: 1500,
      lowStockThreshold: 10,
      criticalStockThreshold: 3,
      supplierId: 'sup-1',
      supplierName: 'Test Vendor',
      status: 'LOW' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    DataService.saveProducts([customProduct]);
    const retrieved = DataService.getProducts();

    expect(retrieved.length).toBe(1);
    expect(retrieved[0].name).toBe('Custom Dried Figs');
  });

  it('should reset localStorage and restore sample data on resetToSampleData', () => {
    DataService.saveProducts([]);
    expect(DataService.getProducts().length).toBe(0);

    DataService.resetToSampleData();
    const restored = DataService.getProducts();
    expect(restored.length).toBeGreaterThan(0);
  });

  it('should allow plugging in a custom storage adapter for future database integration', () => {
    const mockAdapter = {
      getProducts: () => [{ id: 'mock-1', name: 'Mock Product', category: 'Dry Fruits' as const, description: 'Mock', quantity: 100, unit: 'kg' as const, purchasePrice: 10, sellingPrice: 20, lowStockThreshold: 10, criticalStockThreshold: 2, supplierId: 's1', supplierName: 'S1', status: 'NORMAL' as const, createdAt: '', updatedAt: '' }],
      saveProducts: () => {},
      getSales: () => [],
      saveSales: () => {},
      getPurchases: () => [],
      savePurchases: () => {},
      getSuppliers: () => [],
      saveSuppliers: () => {},
      getNotifications: () => [],
      saveNotifications: () => {},
      getUserProfile: () => ({ id: 'u1', name: 'Test', email: '', shopName: '', phone: '', address: '', role: '' }),
      saveUserProfile: () => {},
      resetToSampleData: () => {}
    };

    DataService.setStorageAdapter(mockAdapter);
    expect(DataService.getProducts()[0].name).toBe('Mock Product');

    // Restore default LocalStorageAdapter for subsequent tests
    DataService.setStorageAdapter(new LocalStorageAdapter());
  });
});
