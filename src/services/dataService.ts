import type { Product, Sale, Purchase, Supplier, NotificationItem, UserProfile } from '../types';
import type { IShopStorageAdapter } from './storageAdapter';
import { LocalStorageAdapter } from './localStorageAdapter';

/**
 * DataService Façade & Data Access Layer.
 * 
 * Provides unified static access to data entities across the application.
 * Delegates actual storage operations to an underlying IShopStorageAdapter (default: LocalStorageAdapter).
 * 
 * Future-Ready Architecture:
 * To switch to Firebase, Firestore, or REST API storage in the future, pass or set a different
 * storage adapter implementation via `DataService.setStorageAdapter(...)`.
 */
export class DataService {
  private static storageAdapter: IShopStorageAdapter = new LocalStorageAdapter();

  /**
   * Configures a custom storage adapter (e.g. LocalStorageAdapter, or future FirebaseStorageAdapter).
   */
  public static setStorageAdapter(adapter: IShopStorageAdapter): void {
    this.storageAdapter = adapter;
  }

  /**
   * Retrieves current active storage adapter instance.
   */
  public static getStorageAdapter(): IShopStorageAdapter {
    return this.storageAdapter;
  }

  public static getProducts(): Product[] {
    return this.storageAdapter.getProducts();
  }

  public static saveProducts(products: Product[]): void {
    this.storageAdapter.saveProducts(products);
  }

  public static getSales(): Sale[] {
    return this.storageAdapter.getSales();
  }

  public static saveSales(sales: Sale[]): void {
    this.storageAdapter.saveSales(sales);
  }

  public static getPurchases(): Purchase[] {
    return this.storageAdapter.getPurchases();
  }

  public static savePurchases(purchases: Purchase[]): void {
    this.storageAdapter.savePurchases(purchases);
  }

  public static getSuppliers(): Supplier[] {
    return this.storageAdapter.getSuppliers();
  }

  public static saveSuppliers(suppliers: Supplier[]): void {
    this.storageAdapter.saveSuppliers(suppliers);
  }

  public static getNotifications(): NotificationItem[] {
    return this.storageAdapter.getNotifications();
  }

  public static saveNotifications(notifs: NotificationItem[]): void {
    this.storageAdapter.saveNotifications(notifs);
  }

  public static getUserProfile(): UserProfile {
    return this.storageAdapter.getUserProfile();
  }

  public static saveUserProfile(profile: UserProfile): void {
    this.storageAdapter.saveUserProfile(profile);
  }

  public static resetToSampleData(): void {
    this.storageAdapter.resetToSampleData();
  }
}
