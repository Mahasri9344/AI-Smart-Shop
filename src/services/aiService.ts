import type { Product, Sale, Purchase, Supplier } from '../types';

export interface AIResponse {
  intent: string;
  text: string;
  shortText: string;
  lang?: 'en' | 'ta';
}

export class AIService {
  /**
   * Normalizes speech-to-text transcript phonetics, spacing variations, and spoken Tamil/Tanglish synonyms.
   */
  private static normalizeQuery(rawQuery: string): string {
    let q = rawQuery.toLowerCase().trim();

    // 1. Speech-to-text (STT) phonetic mis-transcription artifacts (ASCII words - use word boundaries)
    q = q.replace(/\bin the porur\b/gi, 'entha porul');
    q = q.replace(/\bin the porul\b/gi, 'entha porul');
    q = q.replace(/\bporur\b/gi, 'porul');
    q = q.replace(/\bkurawar\b/gi, 'kurai');
    q = q.replace(/\birukkathu\b/gi, 'irukku');
    q = q.replace(/\birukkirathu\b/gi, 'irukku');
    q = q.replace(/\birukkuthu\b/gi, 'irukku');
    q = q.replace(/\bkuraiyaga\b/gi, 'kurai');
    q = q.replace(/\bkuraiya\b/gi, 'kurai');
    q = q.replace(/\bkammiya\b/gi, 'kammi');
    q = q.replace(/\bkammiyaga\b/gi, 'kammi');

    // 2. Tamil Unicode words (no \b because \b only matches ASCII \w)
    q = q.replace(/குறைவாக/gi, 'kurai');
    q = q.replace(/குறைவு/gi, 'kurai');
    q = q.replace(/இருக்கிறது/gi, 'irukku');
    q = q.replace(/இருக்கு/gi, 'irukku');

    return q;
  }

  /**
   * Processes natural language retail queries (English, Tamil Unicode, & Tanglish) and maps them to dynamic inventory intents.
   */
  public static processQuery(
    rawQuery: string,
    products: Product[],
    sales: Sale[],
    purchases: Purchase[],
    suppliers: Supplier[] = [],
    lang: 'en' | 'ta' = 'en'
  ): AIResponse {
    const rawLower = rawQuery.toLowerCase().trim();
    const query = this.normalizeQuery(rawQuery);

    const isTamilQuery = lang === 'ta' ||
      /[\u0B80-\u0BFF]/.test(rawQuery) ||
      /\b(porul|porutkal|kammi|kurai|irukku|pannanum|vendum|virpana|labam|kadai|evvalavu|evalavu|edhai|enna|kaattu)\b/i.test(query);

    const effectiveLang: 'en' | 'ta' = isTamilQuery ? 'ta' : 'en';

    // 1. Shop Executive Summary Intent
    if (
      query.includes('summary') ||
      query.includes('overview') ||
      query.includes('health') ||
      query.includes('shop status') ||
      rawLower.includes('கடை summary') ||
      query.includes('kadai summary') ||
      rawLower.includes('கடை விவரம்')
    ) {
      const totalUnits = products.reduce((sum, p) => sum + p.quantity, 0);
      const retailValuation = products.reduce((sum, p) => sum + (p.quantity * p.sellingPrice), 0);
      const criticalCount = products.filter(p => p.status === 'CRITICAL').length;
      const lowCount = products.filter(p => p.status === 'LOW').length;

      const today = new Date().toDateString();
      const todaySales = sales.filter(s => new Date(s.timestamp).toDateString() === today);
      const todayRev = todaySales.reduce((sum, s) => sum + s.totalAmount, 0);

      if (effectiveLang === 'ta') {
        return {
          intent: 'CHECK_SHOP_SUMMARY',
          text: `கடை விவரம்: ${products.length} பொருட்கள் (${totalUnits.toFixed(1)} அலகுகள்), மொத்தம் ₹${retailValuation.toLocaleString('en-IN')} மதிப்புடையது. இன்றைய விற்பனை: ₹${todayRev.toLocaleString('en-IN')} (${todaySales.length} ஆர்டர்கள்). கவனம் தேவை: ${criticalCount} CRITICAL, ${lowCount} LOW இருப்பில் உள்ள பொருட்கள்.`,
          shortText: `${products.length} பொருட்கள், ₹${retailValuation.toLocaleString('en-IN')} மதிப்பு.`,
          lang: 'ta'
        };
      }

      return {
        intent: 'CHECK_SHOP_SUMMARY',
        text: `Shop Summary: ${products.length} products (${totalUnits.toFixed(1)} units) with ₹${retailValuation.toLocaleString('en-IN')} retail valuation. Today's sales: ₹${todayRev.toLocaleString('en-IN')} (${todaySales.length} orders). Attention needed: ${criticalCount} CRITICAL, ${lowCount} LOW stock items.`,
        shortText: `${products.length} products, ₹${retailValuation.toLocaleString('en-IN')} value, ${criticalCount} critical.`,
        lang: 'en'
      };
    }

    // 2. Critical Stock Intent
    if (query.includes('critical') || query.includes('urgent') || rawLower.includes('அவசரம்')) {
      const criticalProducts = products.filter(p => p.status === 'CRITICAL');
      if (criticalProducts.length === 0) {
        return {
          intent: 'CHECK_CRITICAL_STOCK',
          text: effectiveLang === 'ta'
            ? 'CRITICAL இருப்பில் பொருட்கள் ஏதும் இல்லை! அனைத்து பொருட்களின் இருப்பும் நன்றாக உள்ளது.'
            : 'No critical stock items! All inventory levels are healthy.',
          shortText: effectiveLang === 'ta' ? '0 CRITICAL பொருட்கள்.' : '0 critical stock products.',
          lang: effectiveLang
        };
      }
      const names = criticalProducts.map(p => `${p.name} (${p.quantity} ${p.unit})`).join(', ');
      return {
        intent: 'CHECK_CRITICAL_STOCK',
        text: effectiveLang === 'ta'
          ? `${criticalProducts.length} பொருள்(கள்) CRITICAL இருப்பில் உள்ளன: ${names}. உடனடியாக Reorder செய்யவும்.`
          : `${criticalProducts.length} product(s) in CRITICAL stock: ${names}. Immediate restock required.`,
        shortText: effectiveLang === 'ta'
          ? `${criticalProducts.length} CRITICAL: ${names}.`
          : `${criticalProducts.length} critical: ${names}.`,
        lang: effectiveLang
      };
    }

    // 3. Reorder / Restock Intent (Check before Low Stock so "reorder pannanum" resolves to restock recommendation)
    if (
      query.includes('reorder') ||
      query.includes('restock') ||
      query.includes('what to buy') ||
      query.includes('pannanum') ||
      query.includes('vendum') ||
      query.includes('edhai reorder') ||
      query.includes('enna reorder') ||
      rawLower.includes('எதை reorder') ||
      rawLower.includes('என்ன reorder')
    ) {
      const lowProducts = products.filter(p => p.status === 'LOW');
      const criticalProducts = products.filter(p => p.status === 'CRITICAL');
      const totalAttention = lowProducts.length + criticalProducts.length;

      if (totalAttention === 0) {
        return {
          intent: 'RESTOCK_REQUIRED',
          text: effectiveLang === 'ta'
            ? 'அனைத்து இருப்புகளும் இயல்பாக உள்ளன. தற்போது பொருட்கள் எதையும் Reorder செய்யத் தேவையில்லை.'
            : 'All stock levels are normal. No products require restocking currently.',
          shortText: effectiveLang === 'ta' ? 'Reorder தேவை இல்லை.' : 'No restocking needed.',
          lang: effectiveLang
        };
      }

      const critNames = criticalProducts.map(p => p.name).join(', ');
      const lowNames = lowProducts.map(p => p.name).join(', ');
      return {
        intent: 'RESTOCK_REQUIRED',
        text: effectiveLang === 'ta'
          ? `Reorder பரிந்துரை: ${criticalProducts.length} CRITICAL பொருட்கள் (${critNames || 'எதுவுமில்லை'}) மற்றும் ${lowProducts.length} LOW பொருட்கள் (${lowNames || 'எதுவுமில்லை'}).`
          : `Reorder recommendation: ${criticalProducts.length} CRITICAL item(s) (${critNames || 'None'}) and ${lowProducts.length} LOW item(s) (${lowNames || 'None'}).`,
        shortText: effectiveLang === 'ta'
          ? `${totalAttention} பொருட்கள் Reorder செய்ய வேண்டும்.`
          : `${totalAttention} items need reordering.`,
        lang: effectiveLang
      };
    }

    // 4. Low Stock Intent (explicit low stock check)
    if (
      (query.includes('low') || query.includes('kammi') || query.includes('kurai') || rawLower.includes('குறைவாக') || rawLower.includes('குறைவு')) &&
      !query.includes('reorder') &&
      !query.includes('restock')
    ) {
      const lowProducts = products.filter(p => p.status === 'LOW');
      if (lowProducts.length === 0) {
        return {
          intent: 'CHECK_LOW_STOCK',
          text: effectiveLang === 'ta'
            ? 'குறைந்த இருப்பில் உள்ள பொருட்கள் ஏதும் இல்லை! அனைத்து பொருட்களும் போதிய அளவில் உள்ளன.'
            : 'No low stock items! All inventory levels are above low stock thresholds.',
          shortText: effectiveLang === 'ta' ? '0 குறைந்த இருப்பு பொருட்கள்.' : '0 low stock products.',
          lang: effectiveLang
        };
      }
      const names = lowProducts.map(p => `${p.name} (${p.quantity} ${p.unit})`).join(', ');
      return {
        intent: 'CHECK_LOW_STOCK',
        text: effectiveLang === 'ta'
          ? `${lowProducts.length} பொருள்(கள்) குறைந்த இருப்பில் உள்ளன: ${names}.`
          : `${lowProducts.length} product(s) are low in stock: ${names}.`,
        shortText: effectiveLang === 'ta'
          ? `${lowProducts.length} குறைந்த இருப்பு பொருட்கள்.`
          : `${lowProducts.length} low stock items.`,
        lang: effectiveLang
      };
    }

    // 5. Top Selling Products Intent
    if (
      query.includes('top selling') ||
      query.includes('best selling') ||
      query.includes('most popular') ||
      query.includes('top product') ||
      query.includes('best product') ||
      rawLower.includes('அதிகமாக விற்ற') ||
      query.includes('adhigamaga virpana') ||
      query.includes('adhigam virpana')
    ) {
      if (sales.length === 0) {
        return {
          intent: 'CHECK_TOP_SELLING',
          text: effectiveLang === 'ta'
            ? 'அதிகமாக விற்ற பொருட்களை கணக்கிட இதுவரை விற்பனை ஏதும் பதிவு செய்யப்படவில்லை.'
            : 'No sales transactions recorded yet to calculate top selling products.',
          shortText: effectiveLang === 'ta' ? 'விற்பனை ஏதும் பதிவு செய்யப்படவில்லை.' : 'No sales recorded yet.',
          lang: effectiveLang
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
        text: effectiveLang === 'ta'
          ? `அதிகமாக விற்ற பொருட்கள்: ${topList}.`
          : `Top selling products by revenue: ${topList}.`,
        shortText: effectiveLang === 'ta'
          ? `அதிக விற்பனை: ${sortedProds[0]?.name || 'N/A'}.`
          : `Top product: ${sortedProds[0]?.name || 'N/A'}.`,
        lang: effectiveLang
      };
    }

    // 6. Inventory Valuation Intent
    if (
      query.includes('inventory value') ||
      query.includes('stock value') ||
      query.includes('valuation') ||
      query.includes('value do i have') ||
      query.includes('how much inventory') ||
      rawLower.includes('சரக்கு மதிப்பு') ||
      query.includes('madhippu')
    ) {
      const retailValuation = products.reduce((sum, p) => sum + (p.quantity * p.sellingPrice), 0);
      const costValuation = products.reduce((sum, p) => sum + (p.quantity * p.purchasePrice), 0);
      const totalUnits = products.reduce((sum, p) => sum + p.quantity, 0);

      return {
        intent: 'CHECK_INVENTORY_VALUE',
        text: effectiveLang === 'ta'
          ? `மொத்த சில்லறை இருப்பு மதிப்பு: ₹${retailValuation.toLocaleString('en-IN')} (${products.length} பொருட்கள், ${totalUnits.toFixed(1)} அலகுகள்). மொத்த கொள்முதல் அடக்க விலை: ₹${costValuation.toLocaleString('en-IN')}.`
          : `Total retail inventory value: ₹${retailValuation.toLocaleString('en-IN')} across ${products.length} products (${totalUnits.toFixed(1)} total units). Wholesale cost valuation: ₹${costValuation.toLocaleString('en-IN')}.`,
        shortText: effectiveLang === 'ta'
          ? `இருப்பு மதிப்பு: ₹${retailValuation.toLocaleString('en-IN')}.`
          : `Inventory value: ₹${retailValuation.toLocaleString('en-IN')}.`,
        lang: effectiveLang
      };
    }

    // 7. Profit & Margin Intent
    if (
      query.includes('profit') ||
      query.includes('margin') ||
      query.includes('earnings') ||
      query.includes('labam') ||
      rawLower.includes('லாபம்')
    ) {
      if (sales.length === 0) {
        const potentialValuation = products.reduce((sum, p) => sum + (p.quantity * p.sellingPrice), 0);
        return {
          intent: 'CHECK_PROFIT',
          text: effectiveLang === 'ta'
            ? `விற்பனை ஏதும் பதிவு செய்யப்படவில்லை. தற்போதைய இருப்பின் விற்பனை திறன்: ₹${potentialValuation.toLocaleString('en-IN')}.`
            : `No sales transactions recorded yet. Current inventory has a total retail sales potential of ₹${potentialValuation.toLocaleString('en-IN')}.`,
          shortText: effectiveLang === 'ta' ? 'விற்பனை ஏதும் இல்லை.' : 'No sales recorded yet.',
          lang: effectiveLang
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
        text: effectiveLang === 'ta'
          ? `மொத்த விற்பனை வருவாய்: ₹${totalRevenue.toLocaleString('en-IN')}. மதிப்பிடப்பட்ட நிகர லாபம்: ₹${estimatedProfit.toLocaleString('en-IN')} (${marginPct}% லாப விகிதம்).`
          : `Total sales revenue: ₹${totalRevenue.toLocaleString('en-IN')}. Estimated gross profit: ₹${estimatedProfit.toLocaleString('en-IN')} (${marginPct}% gross margin).`,
        shortText: effectiveLang === 'ta'
          ? `லாபம்: ₹${estimatedProfit.toLocaleString('en-IN')} (${marginPct}%).`
          : `Profit: ₹${estimatedProfit.toLocaleString('en-IN')} (${marginPct}%).`,
        lang: effectiveLang
      };
    }

    // 8. Purchases & Replenishment Log Intent
    if (
      query.includes('recent purchase') ||
      query.includes('purchases') ||
      query.includes('bought') ||
      query.includes('stock in') ||
      rawLower.includes('கொள்முதல்') ||
      query.includes('vaangiyavai')
    ) {
      if (purchases.length === 0) {
        return {
          intent: 'CHECK_PURCHASES',
          text: effectiveLang === 'ta'
            ? 'மொத்த கொள்முதல் ஆர்டர்கள் ஏதும் இதுவரை பதிவு செய்யப்படவில்லை.'
            : 'No wholesale purchase orders recorded yet.',
          shortText: effectiveLang === 'ta' ? 'கொள்முதல் இல்லை.' : 'No purchases recorded.',
          lang: effectiveLang
        };
      }

      const sortedPurchases = [...purchases].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      const recentList = sortedPurchases.slice(0, 3).map(p => `${p.productName} (${p.quantity} ${p.unit} from ${p.supplierName} for ₹${p.totalAmount.toLocaleString('en-IN')})`).join('; ');

      return {
        intent: 'CHECK_PURCHASES',
        text: effectiveLang === 'ta'
          ? `சமீபத்திய கொள்முதல்கள் (${sortedPurchases.length} மொத்தம்): ${recentList}.`
          : `Recent wholesale purchases (${sortedPurchases.length} total): ${recentList}.`,
        shortText: effectiveLang === 'ta'
          ? `${sortedPurchases.length} கொள்முதல் ஆர்டர்கள்.`
          : `${sortedPurchases.length} purchase orders recorded.`,
        lang: effectiveLang
      };
    }

    // 9. Suppliers & Vendors Intent
    if (
      query.includes('supplier') ||
      query.includes('vendor') ||
      rawLower.includes('சப்ளையர்')
    ) {
      if (suppliers.length === 0) {
        return {
          intent: 'CHECK_SUPPLIERS',
          text: effectiveLang === 'ta'
            ? 'தங்களது கோப்பகத்தில் சப்ளையர்கள் யாரும் பதிவு செய்யப்படவில்லை.'
            : 'No suppliers registered in your directory currently.',
          shortText: effectiveLang === 'ta' ? '0 சப்ளையர்கள்.' : '0 suppliers registered.',
          lang: effectiveLang
        };
      }

      const supplierNames = suppliers.map(s => `${s.name}${s.contactNumber ? ` (${s.contactNumber})` : ''}`).join(', ');
      return {
        intent: 'CHECK_SUPPLIERS',
        text: effectiveLang === 'ta'
          ? `${suppliers.length} சப்ளையர்(கள்) பதிவு செய்யப்பட்டுள்ளனர்: ${supplierNames}.`
          : `You have ${suppliers.length} supplier(s) registered: ${supplierNames}.`,
        shortText: effectiveLang === 'ta'
          ? `${suppliers.length} சப்ளையர்கள்.`
          : `${suppliers.length} suppliers registered.`,
        lang: effectiveLang
      };
    }

    // 10. Today's Sales Intent
    if (
      query.includes('sale') ||
      query.includes('revenue') ||
      query.includes('sold') ||
      query.includes('virpana') ||
      rawLower.includes('விற்பனை')
    ) {
      const today = new Date().toDateString();
      const todaySales = sales.filter(s => new Date(s.timestamp).toDateString() === today);
      const totalRev = todaySales.reduce((sum, s) => sum + s.totalAmount, 0);

      return {
        intent: 'CHECK_TODAY_SALES',
        text: effectiveLang === 'ta'
          ? `இன்றைய விற்பனை: ₹${totalRev.toLocaleString('en-IN')} (${todaySales.length} பரிவர்த்தனைகள்).`
          : `Today's sales: ₹${totalRev.toLocaleString('en-IN')} from ${todaySales.length} transaction(s).`,
        shortText: effectiveLang === 'ta'
          ? `இன்றைய விற்பனை: ₹${totalRev.toLocaleString('en-IN')}.`
          : `Today's sales: ₹${totalRev.toLocaleString('en-IN')}.`,
        lang: effectiveLang
      };
    }

    // 11. Specific Product Search Intent (Filter out Tanglish/English stop words)
    const stopWords = new Set([
      'in', 'the', 'is', 'are', 'what', 'which', 'how', 'show', 'my', 'many', 'much', 'of', 'for', 'to', 'do', 'i', 'have',
      'porul', 'porutkal', 'products', 'product', 'stock', 'ethu', 'edhai', 'enna', 'irukku', 'kammi', 'kurai',
      'pannanum', 'vendum', 'kadai', 'labam', 'virpana', 'irukkirathu', 'irukkathu', 'kurawar', 'kuraiya', 'kaattu',
      'item', 'items', 'status', 'level', 'levels'
    ]);

    const queryWords = query.split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));

    const matchedProduct = products.find(p => {
      const pName = p.name.toLowerCase();
      const pCat = p.category.toLowerCase();
      return queryWords.some(word => pName.includes(word) || pCat.includes(word));
    });

    if (matchedProduct) {
      return {
        intent: 'CHECK_PRODUCT_QUANTITY',
        text: effectiveLang === 'ta'
          ? `${matchedProduct.name}: ${matchedProduct.quantity} ${matchedProduct.unit} மீதம் உள்ளது (${matchedProduct.status} நிலை). விற்பனை விலை: ₹${matchedProduct.sellingPrice}/${matchedProduct.unit}.`
          : `${matchedProduct.name}: ${matchedProduct.quantity} ${matchedProduct.unit} remaining (${matchedProduct.status} status). Selling price: ₹${matchedProduct.sellingPrice}/${matchedProduct.unit}.`,
        shortText: `${matchedProduct.name}: ${matchedProduct.quantity} ${matchedProduct.unit}.`,
        lang: effectiveLang
      };
    }

    // 12. Graceful Fallback / Unknown Query Guidance
    return {
      intent: 'DEFAULT_HELP',
      text: effectiveLang === 'ta'
        ? 'மன்னிக்கவும், கேட்கப்பட்ட கேள்வி புரியவில்லை. முயற்சித்துப் பார்க்கவும்: "கடை summary", "எந்த பொருட்கள் குறைவாக இருக்கு?", "எந்த பொருட்கள் critical-ஆ இருக்கு?", "எதை reorder பண்ண வேண்டும்?", "இன்றைய sales எவ்வளவு?", அல்லது "எவ்வளவு profit".'
        : 'I didn\'t quite catch that. Try asking: "Shop summary", "Which products are low in stock?", "Which products are critical?", "What should I reorder?", "What are today\'s sales?", "Top selling products", "Inventory value", "How much profit", "Show purchases", or "Show suppliers".',
      shortText: effectiveLang === 'ta' ? 'கேள்வி புரியவில்லை.' : 'Try asking: Shop summary, low stock, or sales.',
      lang: effectiveLang
    };
  }
}
