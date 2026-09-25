import type { Product, Sale, Purchase } from '../types';

export interface AIResponse {
  intent: string;
  text: string;
  shortText: string;
}

export class AIService {
  /**
   * Processes natural language retail queries and maps them to dynamic inventory intents.
   * 
   * Intent Resolution Priority Hierarchy:
   * 1. CRITICAL STOCK: Matches urgent critical stock inquiries first so depleted inventory is surfaced immediately.
   * 2. RESTOCK / LOW STOCK: Identifies items requiring replenishment (LOW + CRITICAL).
   * 3. TODAY'S SALES: Calculates daily sales revenue aggregate dynamically.
   * 4. TODAY'S PURCHASES: Calculates daily wholesale expense aggregate dynamically.
   * 5. SPECIFIC PRODUCT: Fuzzy string match against catalog product names or categories.
   * 6. GENERAL SUMMARY: Default fallback inventory health summary across all products.
   */
  public static processQuery(
    rawQuery: string,
    products: Product[],
    sales: Sale[],
    purchases: Purchase[]
  ): AIResponse {
    const query = rawQuery.toLowerCase().trim();

    // 1. Critical Stock Intent: High-priority check for items at or below critical safety threshold
    if (query.includes('critical') || query.includes('urgent')) {
      const criticalProducts = products.filter(p => p.status === 'CRITICAL');
      if (criticalProducts.length === 0) {
        return {
          intent: 'CHECK_CRITICAL_STOCK',
          text: 'No critical stock items! All inventory levels are healthy.',
          shortText: '0 critical stock products.'
        };
      }
      const names = criticalProducts.map(p => p.name).join(', ');
      return {
        intent: 'CHECK_CRITICAL_STOCK',
        text: `${criticalProducts.length} product(s) need urgent restocking: ${names}.`,
        shortText: `${criticalProducts.length} critical: ${names}.`
      };
    }

    // 2. Low Stock / Restock Intent: Aggregates both LOW and CRITICAL items needing vendor order
    if (query.includes('low') || query.includes('restock') || query.includes('reorder')) {
      const lowProducts = products.filter(p => p.status === 'LOW');
      const criticalProducts = products.filter(p => p.status === 'CRITICAL');
      const totalAttention = lowProducts.length + criticalProducts.length;

      if (totalAttention === 0) {
        return {
          intent: 'RESTOCK_REQUIRED',
          text: 'All stock levels are normal. No products require restocking currently.',
          shortText: 'No restocking needed.'
        };
      }

      const lowNames = lowProducts.map(p => p.name).join(', ');
      return {
        intent: 'RESTOCK_REQUIRED',
        text: `Restocking recommendation: ${criticalProducts.length} CRITICAL item(s) and ${lowProducts.length} LOW item(s) (${lowNames || 'None'}).`,
        shortText: `${totalAttention} items need restocking.`
      };
    }

    // 3. Sales & Revenue Intent: Filters today's transactions and computes sum of totalAmount
    if (query.includes('sale') || query.includes('revenue') || query.includes('sold')) {
      const today = new Date().toDateString();
      const todaySales = sales.filter(s => new Date(s.timestamp).toDateString() === today);
      const totalRev = todaySales.reduce((sum, s) => sum + s.totalAmount, 0);

      return {
        intent: 'CHECK_TODAY_SALES',
        text: `Today's sales: ₹${totalRev.toLocaleString('en-IN')} from ${todaySales.length} transaction(s).`,
        shortText: `Today's sales: ₹${totalRev.toLocaleString('en-IN')}.`
      };
    }

    // 4. Purchases Intent: Filters today's wholesale replenishment orders
    if (query.includes('purchase') || query.includes('bought') || query.includes('stock in')) {
      const today = new Date().toDateString();
      const todayPurchases = purchases.filter(p => new Date(p.timestamp).toDateString() === today);
      const totalCost = todayPurchases.reduce((sum, p) => sum + p.totalAmount, 0);

      return {
        intent: 'CHECK_TODAY_PURCHASES',
        text: `Today's purchases: ₹${totalCost.toLocaleString('en-IN')} across ${todayPurchases.length} order(s).`,
        shortText: `Purchases: ₹${totalCost.toLocaleString('en-IN')}.`
      };
    }

    // 5. Specific Product Query Intent: Matches keywords against product names and categories (length > 2)
    const matchedProduct = products.find(p => {
      const pName = p.name.toLowerCase();
      const pCat = p.category.toLowerCase();
      return query.split(' ').some(word => word.length > 2 && (pName.includes(word) || pCat.includes(word)));
    });

    if (matchedProduct) {
      return {
        intent: 'CHECK_PRODUCT_QUANTITY',
        text: `${matchedProduct.name}: ${matchedProduct.quantity} ${matchedProduct.unit} remaining (${matchedProduct.status} status).`,
        shortText: `${matchedProduct.name}: ${matchedProduct.quantity} ${matchedProduct.unit}.`
      };
    }

    // 6. General Stock Check: Fallback response providing high-level inventory totals
    const totalUnits = products.reduce((acc, p) => acc + p.quantity, 0);
    const criticalCount = products.filter(p => p.status === 'CRITICAL').length;
    const lowCount = products.filter(p => p.status === 'LOW').length;

    return {
      intent: 'CHECK_STOCK',
      text: `Inventory status: ${products.length} products (${totalUnits.toFixed(1)} units). ${criticalCount} CRITICAL, ${lowCount} LOW.`,
      shortText: `${products.length} products, ${criticalCount} critical.`
    };
  }
}
