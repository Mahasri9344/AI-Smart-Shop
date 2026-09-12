import type { Product, Sale, Purchase, Supplier, NotificationItem, UserProfile } from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_SALES, 
  INITIAL_PURCHASES, 
  INITIAL_SUPPLIERS, 
  INITIAL_NOTIFICATIONS, 
  DEFAULT_USER_PROFILE 
} from '../data/sampleData';
import { updateProductStockStatus } from './stockIntelligence';

const STORAGE_KEYS = {
  PRODUCTS: 'ai_smart_shop_products_v1',
  SALES: 'ai_smart_shop_sales_v1',
  PURCHASES: 'ai_smart_shop_purchases_v1',
  SUPPLIERS: 'ai_smart_shop_suppliers_v1',
  NOTIFICATIONS: 'ai_smart_shop_notifications_v1',
  USER_PROFILE: 'ai_smart_shop_profile_v1'
};

export class DataService {
  public static getProducts(): Product[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (stored) {
        const raw: Product[] = JSON.parse(stored);
        return raw.map(updateProductStockStatus);
      }
    } catch (e) {
      console.warn('Failed to load products from localStorage, returning initial dataset', e);
    }
    this.saveProducts(INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  }

  public static saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
  }

  public static getSales(): Sale[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SALES);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load sales from localStorage', e);
    }
    this.saveSales(INITIAL_SALES);
    return INITIAL_SALES;
  }

  public static saveSales(sales: Sale[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
    } catch (e) {
      console.error('Failed to save sales to localStorage', e);
    }
  }

  public static getPurchases(): Purchase[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PURCHASES);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load purchases from localStorage', e);
    }
    this.savePurchases(INITIAL_PURCHASES);
    return INITIAL_PURCHASES;
  }

  public static savePurchases(purchases: Purchase[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(purchases));
    } catch (e) {
      console.error('Failed to save purchases to localStorage', e);
    }
  }

  public static getSuppliers(): Supplier[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load suppliers from localStorage', e);
    }
    this.saveSuppliers(INITIAL_SUPPLIERS);
    return INITIAL_SUPPLIERS;
  }

  public static saveSuppliers(suppliers: Supplier[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(suppliers));
    } catch (e) {
      console.error('Failed to save suppliers to localStorage', e);
    }
  }

  public static getNotifications(): NotificationItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load notifications from localStorage', e);
    }
    this.saveNotifications(INITIAL_NOTIFICATIONS);
    return INITIAL_NOTIFICATIONS;
  }

  public static saveNotifications(notifs: NotificationItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    } catch (e) {
      console.error('Failed to save notifications to localStorage', e);
    }
  }

  public static getUserProfile(): UserProfile {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load user profile from localStorage', e);
    }
    this.saveUserProfile(DEFAULT_USER_PROFILE);
    return DEFAULT_USER_PROFILE;
  }

  public static saveUserProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile to localStorage', e);
    }
  }

  public static resetToSampleData(): void {
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.SALES);
    localStorage.removeItem(STORAGE_KEYS.PURCHASES);
    localStorage.removeItem(STORAGE_KEYS.SUPPLIERS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  }
}
