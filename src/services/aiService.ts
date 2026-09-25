import type { Product, Sale, Purchase, Supplier } from '../types';

export interface AIResponse {
  intent: string;
  text: string;
  shortText: string;
}

export class AIService {
  /**
   * Processes natural language retail queries and maps them to dynamic inventory intents.
   * 
   * Intent Resolution Priority:
   * 1. SHOP SUMMARY: Executive summary of store products, valuation, sales, and urgent alerts.
   * 2. CRITICAL STOCK: Products at or below critical stock safety threshold.
   * 3. LOW STOCK: Products at or below low stock threshold.
   * 4. REORDER / RESTOCK: Consolidated replenishment recommendations.
   * 5. TOP SELLING PRODUCTS: Best-performing store items ranked by revenue.
   * 6. INVENTORY VALUATION: Total retail valuation and cost metrics.
   * 7. PROFIT & MARGIN: Sales revenue, cost of goods sold, and gross profit margin.
   * 8. PURCHASES: Recent wholesale purchase orders and cost totals.
   * 9. SUPPLIERS: Vendor directory contacts and supplier list.
   * 10. TODAY'S SALES: Daily sales revenue and transaction count.
   * 11. SPECIFIC PRODUCT SEARCH: Product quantity and status lookup by keyword.
   * 12. DEFAULT FALLBACK: Helpful guidance for unrecognized questions.
   */
  public static processQuery(
    rawQuery: string,
    products: Product[],
    sales: Sale[],
    purchases: Purchase[],
    suppliers: Supplier[] = []
  ): AIResponse {
    const query = rawQuery.toLowerCase().trim();

    // 1. Shop Executive Summary Intent
    if (query.includes('summary') || query.includes('overview') || query.includes('health') || query.includes('shop status')) {
      const totalUnits = products.reduce((sum, p) => sum + p.quantity, 0);
      const retailValuation = products.reduce((sum, p) => sum + (p.quantity * p.sellingPrice), 0);
      const criticalCount = products.filter(p => p.status === 'CRITICAL').length;
      const lowCount = products.filter(p => p.status === 'LOW').length;
      
      const today = new Date().toDateString();
      const todaySales = sales.filter(s => new Date(s.timestamp).toDateString() === today);
      const todayRev = todaySales.reduce((sum, s) => sum + s.totalAmount, 0);

      return {
        intent: 'CHECK_SHOP_SUMMARY',
        text: `Shop Summary: ${products.length} products (${totalUnits.toFixed(1)} units) with ₹${retailValuation.toLocaleString('en-IN')} retail valuation. Today's sales: ₹${todayRev.toLocaleString('en-IN')} (${todaySales.length} orders). Attention needed: ${criticalCount} CRITICAL, ${lowCount} LOW stock items.`,
        shortText: `${products.length} products, ₹${retailValuation.toLocaleString('en-IN')} value, ${criticalCount} critical.`
      };
    }

    // 2. Critical Stock Intent
    if (query.includes('critical') || query.includes('urgent')) {
      const criticalProducts = products.filter(p => p.status === 'CRITICAL');
      if (criticalProducts.length === 0) {
        return {
          intent: 'CHECK_CRITICAL_STOCK',
          text: 'No critical stock items! All inventory levels are healthy.',
          shortText: '0 critical stock products.'
        };
      }
      const names = criticalProducts.map(p => `${p.name} (${p.quantity} ${p.unit})`).join(', ');
      return {
        intent: 'CHECK_CRITICAL_STOCK',
        text: `${criticalProducts.length} product(s) in CRITICAL stock: ${names}. Immediate restock required.`,
        shortText: `${criticalProducts.length} critical: ${names}.`
      };
    }

    // 3. Low Stock Intent (explicit low stock check)
    if (query.includes('low') && !query.includes('reorder') && !query.includes('restock')) {
      const lowProducts = products.filter(p => p.status === 'LOW');
      if (lowProducts.length === 0) {
        return {
          intent: 'CHECK_LOW_STOCK',
          text: 'No low stock items! All inventory levels are above low stock thresholds.',
          shortText: '0 low stock products.'
        };
      }
      const names = lowProducts.map(p => `${p.name} (${p.quantity} ${p.unit})`).join(', ');
      return {
        intent: 'CHECK_LOW_STOCK',
        text: `${lowProducts.length} product(s) are low in stock: ${names}.`,
        shortText: `${lowProducts.length} low stock items.`
      };
    }

    // 4. Reorder / Restock Intent
    if (query.includes('reorder') || query.includes('restock') || query.includes('what to buy')) {
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

      const critNames = criticalProducts.map(p => p.name).join(', ');
      const lowNames = lowProducts.map(p => p.name).join(', ');
      return {
        intent: 'RESTOCK_REQUIRED',
        text: `Reorder recommendation: ${criticalProducts.length} CRITICAL item(s) (${critNames || 'None'}) and ${lowProducts.length} LOW item(s) (${lowNames || 'None'}).`,
        shortText: `${totalAttention} items need reordering.`
      };
    }

    // 5. Top Selling Products Intent
    if (query.includes('top selling') || query.includes('best selling') || query.includes('most popular') || query.includes('top product') || query.includes('best product')) {
      if (sales.length === 0) {
        return {
          intent: 'CHECK_TOP_SELLING',
          text: 'No sales transactions recorded yet to calculate top selling products.',
          shortText: 'No sales recorded yet.'
        };
      }

      const salesByProd: Record<string, { name: string; totalRevenue: number; totalQty: number; unit: string }> = {};
      sales.forEach(s => {
        if (!salesByProd[s.productId]) {
          salesByProd[s.productId] = { name: s.productName, totalRevenue: 0, totalQty: 0, unit: s.unit };
        }
        salesByProd[s.productId].totalRevenue += s.totalAmount;
        salesByProd[s.productId].totalQty += s.quantity;
      });

      const sortedProds = Object.values(salesByProd).sort((a, b) => b.totalRevenue - a.totalRevenue);
      const topList = sortedProds.slice(0, 3).map((p, i) => `${i + 1}. ${p.name} (₹${p.totalRevenue.toLocaleString('en-IN')}, ${p.totalQty} ${p.unit})`).join('; ');

      return {
        intent: 'CHECK_TOP_SELLING',
        text: `Top selling products by revenue: ${topList}.`,
        shortText: `Top product: ${sortedProds[0]?.name || 'N/A'}.`
      };
    }

    // 6. Inventory Valuation Intent
    if (query.includes('inventory value') || query.includes('stock value') || query.includes('valuation') || query.includes('value do i have') || query.includes('how much inventory')) {
      const retailValuation = products.reduce((sum, p) => sum + (p.quantity * p.sellingPrice), 0);
      const costValuation = products.reduce((sum, p) => sum + (p.quantity * p.purchasePrice), 0);
      const totalUnits = products.reduce((sum, p) => sum + p.quantity, 0);

      return {
        intent: 'CHECK_INVENTORY_VALUE',
        text: `Total retail inventory value: ₹${retailValuation.toLocaleString('en-IN')} across ${products.length} products (${totalUnits.toFixed(1)} total units). Wholesale cost valuation: ₹${costValuation.toLocaleString('en-IN')}.`,
        shortText: `Inventory value: ₹${retailValuation.toLocaleString('en-IN')}.`
      };
    }

    // 7. Profit & Margin Intent
    if (query.includes('profit') || query.includes('margin') || query.includes('earnings')) {
      if (sales.length === 0) {
        const potentialValuation = products.reduce((sum, p) => sum + (p.quantity * p.sellingPrice), 0);
        return {
          intent: 'CHECK_PROFIT',
          text: `No sales transactions recorded yet. Current inventory has a total retail sales potential of ₹${potentialValuation.toLocaleString('en-IN')}.`,
          shortText: 'No sales recorded yet.'
        };
      }

      const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
      const totalCost = sales.reduce((sum, s) => {
        const prod = products.find(p => p.id === s.productId);
        const costPerUnit = prod ? prod.purchasePrice : s.unitPrice * 0.7;
        return sum + (s.quantity * costPerUnit);
      }, 0);

      const estimatedProfit = totalRevenue - totalCost;
      const marginPct = totalRevenue > 0 ? ((estimatedProfit / totalRevenue) * 100).toFixed(1) : '0';

      return {
        intent: 'CHECK_PROFIT',
        text: `Total sales revenue: ₹${totalRevenue.toLocaleString('en-IN')}. Estimated gross profit: ₹${estimatedProfit.toLocaleString('en-IN')} (${marginPct}% gross margin).`,
        shortText: `Profit: ₹${estimatedProfit.toLocaleString('en-IN')} (${marginPct}%).`
      };
    }

    // 8. Purchases & Replenishment Log Intent
    if (query.includes('recent purchase') || query.includes('purchases') || query.includes('bought') || query.includes('stock in')) {
      if (purchases.length === 0) {
        return {
          intent: 'CHECK_PURCHASES',
          text: 'No wholesale purchase orders recorded yet.',
          shortText: 'No purchases recorded.'
        };
      }

      const sortedPurchases = [...purchases].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      const recentList = sortedPurchases.slice(0, 3).map(p => `${p.productName} (${p.quantity} ${p.unit} from ${p.supplierName} for ₹${p.totalAmount.toLocaleString('en-IN')})`).join('; ');

      return {
        intent: 'CHECK_PURCHASES',
        text: `Recent wholesale purchases (${sortedPurchases.length} total): ${recentList}.`,
        shortText: `${sortedPurchases.length} purchase orders recorded.`
      };
    }

    // 9. Suppliers & Vendors Intent
    if (query.includes('supplier') || query.includes('vendor')) {
      if (suppliers.length === 0) {
        return {
          intent: 'CHECK_SUPPLIERS',
          text: 'No suppliers registered in your directory currently.',
          shortText: '0 suppliers registered.'
        };
      }

      const supplierNames = suppliers.map(s => `${s.name}${s.contactNumber ? ` (${s.contactNumber})` : ''}`).join(', ');
      return {
        intent: 'CHECK_SUPPLIERS',
        text: `You have ${suppliers.length} supplier(s) registered: ${supplierNames}.`,
        shortText: `${suppliers.length} suppliers registered.`
      };
    }

    // 10. Today's Sales Intent
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

    // 11. Specific Product Search Intent
    const matchedProduct = products.find(p => {
      const pName = p.name.toLowerCase();
      const pCat = p.category.toLowerCase();
      return query.split(' ').some(word => word.length > 2 && (pName.includes(word) || pCat.includes(word)));
    });

    if (matchedProduct) {
      return {
        intent: 'CHECK_PRODUCT_QUANTITY',
        text: `${matchedProduct.name}: ${matchedProduct.quantity} ${matchedProduct.unit} remaining (${matchedProduct.status} status). Selling price: ₹${matchedProduct.sellingPrice}/${matchedProduct.unit}.`,
        shortText: `${matchedProduct.name}: ${matchedProduct.quantity} ${matchedProduct.unit}.`
      };
    }

    // 12. Graceful Fallback / Unknown Query Guidance
    return {
      intent: 'DEFAULT_HELP',
      text: 'I didn\'t quite catch that. Try asking: "Shop summary", "Which products are low in stock?", "Which products are critical?", "What should I reorder?", "What are today\'s sales?", "Top selling products", "Inventory value", "How much profit", "Show purchases", or "Show suppliers".',
      shortText: 'Try asking: Shop summary, low stock, or sales.'
    };
  }
}
