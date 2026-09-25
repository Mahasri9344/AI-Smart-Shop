import { describe, it, expect } from 'vitest';
import { calculateStockStatus, updateProductStockStatus } from './stockIntelligence';
import type { Product } from '../types';

describe('Stock Intelligence Engine (stockIntelligence.ts)', () => {
  const LOW_THRESHOLD = 10;
  const CRITICAL_THRESHOLD = 3;

  describe('calculateStockStatus', () => {
    it('should classify zero stock as CRITICAL', () => {
      const status = calculateStockStatus(0, LOW_THRESHOLD, CRITICAL_THRESHOLD);
      expect(status).toBe('CRITICAL');
    });

    it('should classify quantity below or equal to critical threshold as CRITICAL', () => {
      expect(calculateStockStatus(1, LOW_THRESHOLD, CRITICAL_THRESHOLD)).toBe('CRITICAL');
      expect(calculateStockStatus(3, LOW_THRESHOLD, CRITICAL_THRESHOLD)).toBe('CRITICAL'); // Exact threshold boundary
    });

    it('should classify quantity between critical and low thresholds as LOW', () => {
      expect(calculateStockStatus(4, LOW_THRESHOLD, CRITICAL_THRESHOLD)).toBe('LOW');
      expect(calculateStockStatus(7, LOW_THRESHOLD, CRITICAL_THRESHOLD)).toBe('LOW');
      expect(calculateStockStatus(10, LOW_THRESHOLD, CRITICAL_THRESHOLD)).toBe('LOW'); // Exact threshold boundary
    });

    it('should classify quantity strictly above low threshold as NORMAL', () => {
      expect(calculateStockStatus(11, LOW_THRESHOLD, CRITICAL_THRESHOLD)).toBe('NORMAL');
      expect(calculateStockStatus(50, LOW_THRESHOLD, CRITICAL_THRESHOLD)).toBe('NORMAL');
    });
  });

  describe('updateProductStockStatus', () => {
    const mockProduct: Product = {
      id: 'prod-test-1',
      name: 'Test Almonds',
      category: 'Dry Fruits',
      description: 'Test product',
      quantity: 2,
      unit: 'kg',
      purchasePrice: 500,
      sellingPrice: 800,
      lowStockThreshold: 10,
      criticalStockThreshold: 3,
      supplierId: 'sup-1',
      supplierName: 'Test Vendor',
      status: 'NORMAL', // Stale status
      createdAt: '2026-09-01T10:00:00Z',
      updatedAt: '2026-09-01T10:00:00Z'
    };

    it('should recalculate status to CRITICAL when product quantity is 2', () => {
      const updated = updateProductStockStatus(mockProduct);
      expect(updated.status).toBe('CRITICAL');
      expect(updated.id).toBe(mockProduct.id);
      expect(new Date(updated.updatedAt).getTime()).toBeGreaterThan(0);
    });

    it('should recalculate status to NORMAL when product quantity is increased to 15', () => {
      const replenishedProduct = { ...mockProduct, quantity: 15 };
      const updated = updateProductStockStatus(replenishedProduct);
      expect(updated.status).toBe('NORMAL');
    });
  });
});
