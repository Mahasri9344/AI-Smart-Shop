import type { Product, StockStatus } from '../types';

/**
 * Calculates stock status dynamically based on current quantity and threshold values.
 * 
 * Business Rule:
 * Evaluation follows a strict priority hierarchy where CRITICAL evaluation takes priority
 * over LOW status. This ensures urgent stock depletion is flagged immediately to shopkeepers.
 * 
 * Threshold Rules:
 * - CRITICAL: quantity <= criticalStockThreshold (Immediate restock required)
 * - LOW:      criticalStockThreshold < quantity <= lowStockThreshold (Reorder warning)
 * - NORMAL:   quantity > lowStockThreshold (Stock levels stable)
 */
export function calculateStockStatus(
  quantity: number,
  lowStockThreshold: number,
  criticalStockThreshold: number
): StockStatus {
  // Priority 1: Check if inventory reached or dropped below critical safety threshold
  if (quantity <= criticalStockThreshold) {
    return 'CRITICAL';
  }
  // Priority 2: Check if inventory dropped below low-stock warning threshold
  if (quantity <= lowStockThreshold) {
    return 'LOW';
  }
  // Default: Stock is at healthy operational levels
  return 'NORMAL';
}

/**
 * Recalculates and updates product status field dynamically.
 * Updates timestamp to track when stock intelligence last re-evaluated the item.
 */
export function updateProductStockStatus(product: Product): Product {
  const newStatus = calculateStockStatus(
    product.quantity,
    product.lowStockThreshold,
    product.criticalStockThreshold
  );
  return {
    ...product,
    status: newStatus,
    updatedAt: new Date().toISOString()
  };
}
