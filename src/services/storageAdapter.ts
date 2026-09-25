import type { Product, Sale, Purchase, Supplier, NotificationItem, UserProfile } from '../types';

/**
 * Interface contract for Data Storage Adapters.
 * 
 * Future-Ready Architecture:
 * Decouples application state management (ShopContext) from the underlying storage technology.
 * Current active implementation: LocalStorageAdapter.
 * Future implementations (e.g., FirebaseStorageAdapter, RESTApiAdapter) can implement this interface
 * without requiring any refactoring of ShopContext or UI components.
 */
export interface IShopStorageAdapter {
  getProducts(): Product[];
  saveProducts(products: Product[]): void;

  getSales(): Sale[];
  saveSales(sales: Sale[]): void;

  getPurchases(): Purchase[];
  savePurchases(purchases: Purchase[]): void;

  getSuppliers(): Supplier[];
  saveSuppliers(suppliers: Supplier[]): void;

  getNotifications(): NotificationItem[];
  saveNotifications(notifs: NotificationItem[]): void;

  getUserProfile(): UserProfile;
  saveUserProfile(profile: UserProfile): void;

  resetToSampleData(): void;
}
