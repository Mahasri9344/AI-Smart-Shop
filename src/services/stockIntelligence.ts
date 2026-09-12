import type { Product, StockStatus } from '../types';

/**
 * Calculates stock status dynamically based on current quantity and threshold values.
 * 
 * Rules:
 * - NORMAL: quantity > lowStockThreshold
 * - LOW: quantity <= lowStockThreshold AND quantity > criticalStockThreshold
 * - CRITICAL: quantity <= criticalStockThreshold
 */
export function calculateStockStatus(
  quantity: number,
  lowStockThreshold: number,
  criticalStockThreshold: number
): StockStatus {
  if (quantity <= criticalStockThreshold) {
    return 'CRITICAL';
  }
  if (quantity <= lowStockThreshold) {
    return 'LOW';
  }
  return 'NORMAL';
}

/**
 * Recalculates and updates product status field dynamically.
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
