import type { Product, Sale, Purchase, Supplier } from '../types';

export interface AIResponse {
  intent: string;
  text: string;
  shortText: string;
  lang?: 'en' | 'ta';
}

export class AIService {
  /**
   * Normalizes raw user queries by performing NFC Unicode normalization, lowercase conversion,
   * punctuation removal, collapsing extra whitespace, and mapping spoken Tamil script, Tanglish,
   * and mixed Tamil-English spelling variations to canonical query terms for semantic intent scoring.
   * Note: The original raw user query is preserved for chat display.
   */
  private static normalizeQuery(rawQuery: string): string {
    if (!rawQuery) return '';

    // 1. NFC normalization & basic lowercasing
    let q = rawQuery.normalize('NFC').toLowerCase().trim();

    // 2. Remove punctuation and extra whitespace
    q = q.replace(/[?,!.:;\(\)\"\']/g, ' ');
    q = q.replace(/\s+/g, ' ').trim();

    // 3. Spoken / Written Tamil & Tanglish variations mapping

    // Romba / Critical / Urgent indicators
    q = q.replace(/ரொம்ப/g, 'romba');
    q = q.replace(/மிகவும்/g, 'romba');

    // Adhigam / Top selling indicators (process before kammi to avoid partial string conflicts)
    q = q.replace(/அதிகமாக/g, 'adhigam');
    q = q.replace(/அதிகம்/g, 'adhigam');
    q = q.replace(/\badhigamaga\b/gi, 'adhigam');
    q = q.replace(/\badhigama\b/gi, 'adhigam');

    q = q.replace(/\benthenna\b/gi, 'enna');
    q = q.replace(/\bennaenna\b/gi, 'enna');
    q = q.replace(/\bentha\b/gi, 'entha');
    q = q.replace(/\bena\b/gi, 'enna');
    q = q.replace(/\bethu\b/gi, 'enna');
    q = q.replace(/\bedhai\b/gi, 'enna');
    q = q.replace(/\bethai\b/gi, 'enna');

    // Spoken variations for in shop / kadaiyila
    q = q.replace(/\bkadaiyila\b/gi, 'kadai');
    q = q.replace(/\bkadaiyil\b/gi, 'kadai');
    q = q.replace(/கடையில்/g, 'kadai');

    // Spoken verbs / existentials
    q = q.replace(/\birukirukku\b/gi, 'irukku');
    q = q.replace(/\birukkura\b/gi, 'irukku');
    q = q.replace(/\birukura\b/gi, 'irukku');
    q = q.replace(/\birukkuthu\b/gi, 'irukku');
    q = q.replace(/\birukuthu\b/gi, 'irukku');
    q = q.replace(/\birukkirathu\b/gi, 'irukku');
    q = q.replace(/\birukirathu\b/gi, 'irukku');
    q = q.replace(/\biruku\b/gi, 'irukku');
    q = q.replace(/\birukkathu\b/gi, 'irukku');
    q = q.replace(/\birukkum\b/gi, 'irukku');
    q = q.replace(/\bullana\b/gi, 'irukku');
    q = q.replace(/\bullathu\b/gi, 'irukku');
    q = q.replace(/இருக்கின்றன/g, 'irukku');
    q = q.replace(/இருக்கிறது/g, 'irukku');
    q = q.replace(/இருக்கின்றது/g, 'irukku');
    q = q.replace(/இருக்கு/g, 'irukku');
    q = q.replace(/உள்ளன/g, 'irukku');
    q = q.replace(/உள்ளது/g, 'irukku');

    // Spoken variations for low stock / decreasing / kammi / korai
    q = q.replace(/\bkoraiya\b/gi, 'kurai');
    q = q.replace(/\bkorai\b/gi, 'kurai');
    q = q.replace(/\bkuraiya\b/gi, 'kurai');
    q = q.replace(/\bkuraiyaga\b/gi, 'kurai');
    q = q.replace(/\bkuraivaga\b/gi, 'kurai');
    q = q.replace(/\bkuraiva\b/gi, 'kurai');
    q = q.replace(/\bkurawar\b/gi, 'kurai');
    q = q.replace(/\bkammiyaga\b/gi, 'kurai');
    q = q.replace(/\bkammiya\b/gi, 'kurai');
    q = q.replace(/\bkamiya\b/gi, 'kurai');
    q = q.replace(/\bkammi\b/gi, 'kurai');
    q = q.replace(/குறையுது/g, 'kurai');
    q = q.replace(/குறைவாக/g, 'kurai');
    q = q.replace(/குறைவா/g, 'kurai');
    q = q.replace(/குறைவான/g, 'kurai');
    q = q.replace(/குறைவு/g, 'kurai');
    q = q.replace(/குறைந்து/g, 'kurai');
    q = q.replace(/குறைந்த/g, 'kurai');
    q = q.replace(/கம்மியா/g, 'kurai');
    q = q.replace(/கம்மி/g, 'kurai');

    // Spoken variations for products / items
    q = q.replace(/\bporutkal\b/gi, 'porul');
    q = q.replace(/\bporulgal\b/gi, 'porul');
    q = q.replace(/\bporulkal\b/gi, 'porul');
    q = q.replace(/\bporulgan\b/gi, 'porul');
    q = q.replace(/\bporur\b/gi, 'porul');
    q = q.replace(/\bitems\b/gi, 'porul');
    q = q.replace(/\bitem\b/gi, 'porul');
    q = q.replace(/\bproducts\b/gi, 'porul');
    q = q.replace(/\bproduct\b/gi, 'porul');
    q = q.replace(/பொருள்கள்/g, 'porul');
    q = q.replace(/பொருட்கள்/g, 'porul');
    q = q.replace(/பொருள்/g, 'porul');
    q = q.replace(/பொருட்களின்/g, 'porul');
    q = q.replace(/பொருட்களை/g, 'porul');

    // Spoken variations for quantity / how much
    q = q.replace(/\bevalo\b/gi, 'evlo');
    q = q.replace(/\bevvalavu\b/gi, 'evlo');
    q = q.replace(/\bevalavu\b/gi, 'evlo');

    // Spoken variations for buying / restocking / vaanganum
    q = q.replace(/\bvaanganum\b/gi, 'vaanganum');
    q = q.replace(/\bvaanganam\b/gi, 'vaanganum');
    q = q.replace(/\bvaanganung\b/gi, 'vaanganum');
    q = q.replace(/\bvaanga\b/gi, 'vaanganum');
    q = q.replace(/வாங்கணும்/g, 'vaanganum');
    q = q.replace(/வாங்க\s+வேண்டும்/g, 'vaanganum');
    q = q.replace(/வாங்கவேண்டும்/g, 'vaanganum');
    q = q.replace(/வாங்க/g, 'vaanganum');

    // Spoken variations for verbs / reorder
    q = q.replace(/\bre\s+order\b/gi, 'reorder');
    q = q.replace(/\bre-order\b/gi, 'reorder');
    q = q.replace(/\bpannanam\b/gi, 'pannanum');
    q = q.replace(/\bpannanu\b/gi, 'pannanum');
    q = q.replace(/\bpanna\s+vendum\b/gi, 'pannanum');
    q = q.replace(/\bpanna\s+vendiya\b/gi, 'pannanum');
    q = q.replace(/\bvenum\b/gi, 'vendum');
    q = q.replace(/\bvenumaa\b/gi, 'vendum');

    // Spoken variations for time / today
    q = q.replace(/\binniku\b/gi, 'today');
    q = q.replace(/\binnaiku\b/gi, 'today');
    q = q.replace(/\bindrai\b/gi, 'today');
    q = q.replace(/\bindraiya\b/gi, 'today');
    q = q.replace(/\bindraya\b/gi, 'today');
    q = q.replace(/\bindru\b/gi, 'today');
    q = q.replace(/இன்றைய/g, 'today');
    q = q.replace(/இன்று/g, 'today');

    // Spoken variations for sales / virpana
    q = q.replace(/\bvirpanai\b/gi, 'virpana');
    q = q.replace(/\bvirkappattadhu\b/gi, 'virpana');
    q = q.replace(/\bvirkkirathu\b/gi, 'virpana');
    q = q.replace(/\bvirkkum\b/gi, 'virpana');
    q = q.replace(/\bvikkuthu\b/gi, 'virpana');
    q = q.replace(/\baaguthu\b/gi, 'virpana');
    q = q.replace(/\bnadanthadhu\b/gi, 'virpana');
    q = q.replace(/விற்பனை/g, 'virpana');
    q = q.replace(/விற்பனையாகும்/g, 'virpana');
    q = q.replace(/விற்கிறது/g, 'virpana');
    q = q.replace(/விற்ற/g, 'virpana');
    q = q.replace(/நடந்தது/g, 'virpana');

    // Spoken variations for critical
    q = q.replace(/\bromba\s+kammi\b/gi, 'romba kurai');
    q = q.replace(/\bromba\s+kammiya\b/gi, 'romba kurai');
    q = q.replace(/\bmigavum\s+kurai\b/gi, 'romba kurai');
    q = q.replace(/ரொம்ப\s+குறைவாக/g, 'romba kurai');
    q = q.replace(/மிகவும்\s+குறைவு/g, 'romba kurai');

    // Spoken variations for profit / labam
    q = q.replace(/லாபம்/g, 'profit');
    q = q.replace(/\blabam\b/gi, 'profit');
    q = q.replace(/\bvandhirukku\b/gi, 'profit');

    // Spoken variations for shop summary
    q = q.replace(/\ben\s+kadai\s+eppadi\b/gi, 'kadai summary');
    q = q.replace(/\bkadai\s+eppadi\b/gi, 'kadai summary');
    q = q.replace(/\bshop\s+summary\b/gi, 'kadai summary');
    q = q.replace(/\bkadai\s+summary\b/gi, 'kadai summary');
    q = q.replace(/\bshop\s+oda\s+summary\b/gi, 'kadai summary');
    q = q.replace(/கடை\s+summary/g, 'kadai summary');
    q = q.replace(/கடை\s+நிலை/g, 'kadai summary');
    q = q.replace(/கடை\s+விவரம்/g, 'kadai summary');

    return q.replace(/\s+/g, ' ').trim();
  }

  /**
   * Processes natural language retail queries (English, Tamil Unicode, Tanglish, and Mixed Tamil-English)
   * using semantic-style intent scoring with language-consistent responses.
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

    // 1. Check for Tamil script
    const hasTamilScript = /[\u0B80-\u0BFF]/.test(rawQuery);

    // 2. Check for Tanglish indicator tokens/phrases directly on raw user query
    const isTanglish = /\b(porul|porutkal|porulgal|porur|kammi|kammiya|kammiyaga|kurai|kuraiya|kuraiyava|kuraiyaga|kuraivaga|kuraiva|korai|koraiya|irukku|irukura|irukkura|irukuthu|irukkuthu|irukirathu|irukkirathu|irukkathu|ullana|ullathu|pannanum|pannanam|pannanu|vendum|venum|venumaa|virpana|virpanai|labam|kadai|evvalavu|evalavu|evlo|edhai|ethai|ethu|enna|ena|kaattu|kaamikka|kamika|kaatu|indha|entha|madhippu|vaangiyavai|vaanginadhu|kolmudhal|innaiku|inniku|aachu|adhigam|adhigama|adhigamaga|viniyogisthar|eppadi|virkkirathu|vikkuthu|sollu|poguthu|vaanganum|kadaiyila)\b/i.test(rawLower) ||
      /\b(reorder panna|low stock la|stock la|kammiya irukku|kuraiyava irukku|kuraiva irukku|nalla sell|romba kammi)\b/i.test(rawLower);

    // 3. Check if query is purely English
    const isPureEnglish = !hasTamilScript && !isTanglish && /^[a-z0-9\s\?\.\,\!\-\:\;\(\)\'\"]+$/i.test(rawQuery.trim());

    // 4. Dynamic response language determination:
    // Rule: Tamil script, Tanglish, or mixed Tamil-English -> 'ta'
    // Rule: Pure English -> 'en'
    const effectiveLang: 'en' | 'ta' = (hasTamilScript || isTanglish) ? 'ta' : (isPureEnglish ? 'en' : (lang === 'ta' ? 'ta' : 'en'));

    // Semantic Intent Scoring System
    interface IntentScore {
      intent: string;
      score: number;
    }

    const scores: IntentScore[] = [];

    // --- Intent 1: SHOP_SUMMARY ---
    let summaryScore = 0;
    if (query.includes('kadai summary') || query.includes('summary') || query.includes('overview') || query.includes('health') || query.includes('shop status') || rawLower.includes('கடை summary') || rawLower.includes('கடை விவரம்')) {
      summaryScore += 10;
    }
    if (query.includes('eppadi') || query.includes('poguthu')) summaryScore += 5;
    if (summaryScore > 0) scores.push({ intent: 'CHECK_SHOP_SUMMARY', score: summaryScore });

    // --- Intent 2: CHECK_CRITICAL_STOCK ---
    let criticalScore = 0;
    if (query.includes('critical') || query.includes('romba kurai') || query.includes('romba') || query.includes('avasaram') || query.includes('urgent') || rawLower.includes('அவசரம்')) {
      criticalScore += 12;
    }
    if (criticalScore > 0) scores.push({ intent: 'CHECK_CRITICAL_STOCK', score: criticalScore });

    // --- Intent 3: RESTOCK_REQUIRED ---
    let restockScore = 0;
    if (query.includes('reorder') || query.includes('restock') || query.includes('what to buy') || query.includes('meendum vaanga') || query.includes('vaanga venduma') || query.includes('vaanganum')) {
      restockScore += 12;
    }
    if (query.includes('pannanum') && (query.includes('enna') || query.includes('ethai') || query.includes('porul') || query.includes('item'))) {
      restockScore += 10;
    }
    if (restockScore > 0) scores.push({ intent: 'RESTOCK_REQUIRED', score: restockScore });

    // --- Intent 4: CHECK_LOW_STOCK ---
    let lowStockScore = 0;
    if (query.includes('kurai') || query.includes('low stock') || query.includes('low')) {
      lowStockScore += 10;
    }
    if (query.includes('porul') && query.includes('kurai')) {
      lowStockScore += 5;
    }
    // Penalties to prevent false positive matching when user specifically asked for critical or restock
    if (query.includes('reorder') || query.includes('restock') || query.includes('vaanganum')) lowStockScore -= 15;
    if (query.includes('critical') || query.includes('romba kurai') || query.includes('romba')) lowStockScore -= 15;
    if (lowStockScore > 0) scores.push({ intent: 'CHECK_LOW_STOCK', score: lowStockScore });

    // --- Intent 5: CHECK_TOP_SELLING ---
    let topSellingScore = 0;
    if (query.includes('top selling') || query.includes('best selling') || query.includes('most popular') || query.includes('top product') || query.includes('best product') || query.includes('top sales') || query.includes('sell most') || (query.includes('sell') && (query.includes('most') || query.includes('best') || query.includes('top')))) {
      topSellingScore += 12;
    }
    if (query.includes('adhigam') && (query.includes('virpana') || query.includes('sell') || query.includes('porul'))) {
      topSellingScore += 12;
    }
    if (query.includes('nalla sell')) topSellingScore += 10;
    if (topSellingScore > 0) scores.push({ intent: 'CHECK_TOP_SELLING', score: topSellingScore });

    // --- Intent 6: CHECK_INVENTORY_VALUE ---
    let inventoryScore = 0;
    if (query.includes('inventory value') || query.includes('stock value') || query.includes('valuation') || query.includes('sarakku mathippu') || query.includes('mathippu') || rawLower.includes('சரக்கு மதிப்பு')) {
      inventoryScore += 12;
    }
    if (inventoryScore > 0) scores.push({ intent: 'CHECK_INVENTORY_VALUE', score: inventoryScore });

    // --- Intent 7: CHECK_PROFIT ---
    let profitScore = 0;
    if (query.includes('profit') || query.includes('margin') || query.includes('earnings') || rawLower.includes('லாபம்')) {
      profitScore += 12;
    }
    if (profitScore > 0) scores.push({ intent: 'CHECK_PROFIT', score: profitScore });

    // --- Intent 8: CHECK_PURCHASES ---
    let purchaseScore = 0;
    if (query.includes('recent purchase') || query.includes('purchases') || query.includes('bought') || query.includes('stock in') || query.includes('kolmudhal') || query.includes('vaangiyavai') || query.includes('vaanginadhu') || rawLower.includes('கொள்முதல்')) {
      purchaseScore += 12;
    }
    if (purchaseScore > 0) scores.push({ intent: 'CHECK_PURCHASES', score: purchaseScore });

    // --- Intent 9: CHECK_SUPPLIERS ---
    let supplierScore = 0;
    if (query.includes('supplier') || query.includes('suppliers') || query.includes('vendor') || query.includes('vendors') || query.includes('viniyogisthar') || query.includes('sablaiyar') || rawLower.includes('சப்ளையர்')) {
      supplierScore += 12;
    }
    if (supplierScore > 0) scores.push({ intent: 'CHECK_SUPPLIERS', score: supplierScore });

    // --- Intent 10: CHECK_TODAY_SALES ---
    let todaySalesScore = 0;
    if (query.includes('today sales') || query.includes('sales today') || (query.includes('sales') && (query.includes('today') || query.includes('evlo') || query.includes('virpana') || query.includes('aachu')))) {
      todaySalesScore += 12;
    }
    if (query.includes('virpana') && (query.includes('today') || query.includes('evlo') || query.includes('aachu'))) {
      todaySalesScore += 12;
    }
    if (todaySalesScore > 0) scores.push({ intent: 'CHECK_TODAY_SALES', score: todaySalesScore });

    // Rank candidate intents by highest score
    scores.sort((a, b) => b.score - a.score);
    const winningIntent = scores.length > 0 && scores[0].score >= 5 ? scores[0].intent : null;

    // --- Execute Winning Intent ---

    // 1. Executive Summary Intent
    if (winningIntent === 'CHECK_SHOP_SUMMARY') {
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
    if (winningIntent === 'CHECK_CRITICAL_STOCK') {
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

    // 3. Reorder / Restock Intent
    if (winningIntent === 'RESTOCK_REQUIRED') {
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

    // 4. Low Stock Intent
    if (winningIntent === 'CHECK_LOW_STOCK') {
      const lowProducts = products.filter(p => p.status === 'LOW');
      if (lowProducts.length === 0) {
        return {
          intent: 'CHECK_LOW_STOCK',
          text: effectiveLang === 'ta'
            ? 'குறைவாக உள்ள பொருட்கள் ஏதும் இல்லை! அனைத்து பொருட்களும் போதிய அளவில் உள்ளன.'
            : 'No low stock items! All inventory levels are above low stock thresholds.',
          shortText: effectiveLang === 'ta' ? '0 குறைந்த இருப்பு பொருட்கள்.' : '0 low stock products.',
          lang: effectiveLang
        };
      }
      const names = lowProducts.map(p => `${p.name} (${p.quantity} ${p.unit})`).join(', ');
      return {
        intent: 'CHECK_LOW_STOCK',
        text: effectiveLang === 'ta'
          ? `குறைவாக உள்ள பொருட்கள்: ${names}.`
          : `These products are low in stock: ${names}.`,
        shortText: effectiveLang === 'ta'
          ? `${lowProducts.length} குறைந்த இருப்பு பொருட்கள்.`
          : `${lowProducts.length} low stock items.`,
        lang: effectiveLang
      };
    }

    // 5. Top Selling Products Intent
    if (winningIntent === 'CHECK_TOP_SELLING') {
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
    if (winningIntent === 'CHECK_INVENTORY_VALUE') {
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
    if (winningIntent === 'CHECK_PROFIT') {
      if (sales.length === 0) {
        const potentialValuation = products.reduce((sum, p) => sum + (p.quantity * p.sellingPrice), 0);
        return {
          intent: 'CHECK_PROFIT',
          text: effectiveLang === 'ta'
            ? 'விற்பனை ஏதும் பதிவு செய்யப்படவில்லை. தற்போதைய இருப்பின் விற்பனை திறன்: ₹' + potentialValuation.toLocaleString('en-IN') + '.'
            : 'No sales transactions recorded yet. Current inventory has a total retail sales potential of ₹' + potentialValuation.toLocaleString('en-IN') + '.',
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

    // 8. Purchases Intent
    if (winningIntent === 'CHECK_PURCHASES') {
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

    // 9. Suppliers Intent
    if (winningIntent === 'CHECK_SUPPLIERS') {
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
    if (winningIntent === 'CHECK_TODAY_SALES') {
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

    // 11. Specific Product Search Intent
    const stopWords = new Set([
      'in', 'the', 'is', 'are', 'what', 'which', 'how', 'show', 'my', 'many', 'much', 'of', 'for', 'to', 'do', 'i', 'have',
      'entha', 'porul', 'porutkal', 'products', 'product', 'stock', 'ethu', 'edhai', 'enna', 'irukku', 'kammi', 'kurai',
      'pannanum', 'vendum', 'kadai', 'labam', 'virpana', 'irukkirathu', 'irukkathu', 'kurawar', 'kuraiya', 'kuraiyaga',
      'kuraivaga', 'kammiya', 'kammiyaga', 'kaattu', 'item', 'items', 'status', 'level', 'levels', 'innaiku', 'evlo', 'aachu', 'today'
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
