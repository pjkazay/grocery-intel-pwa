import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const MAX_IMAGE_SIZE_MB = 4.5; // Conservative limit (API allows 5 MB)
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

function generateReceiptId(merchant: string, date: string, time?: string): string {
  // Clean merchant name (remove spaces, lowercase)
  const cleanMerchant = merchant.toLowerCase().replace(/\s+/g, '_');
  // Use date in YYYYMMDD format
  const cleanDate = date.replace(/-/g, '');
  // Use time if available, otherwise use timestamp
  const timeComponent = time || Date.now().toString().slice(-6);
  
  return `${cleanMerchant}_${cleanDate}_${timeComponent}`;
}

function calculateTripMetrics(items: any[], total: number): any {
  const totalItems = items.length;
  const totalSpent = total; // Use receipt total for accuracy
  const discountSavings = items.reduce((sum, item) => sum + (item.discount || 0), 0);
  const percentSaved = totalSpent > 0 ? (discountSavings / (totalSpent + discountSavings)) * 100 : 0;
  
  // Get unique categories
  const categories = [...new Set(items.map(item => item.category).filter(Boolean))];
  
  // Calculate average price per item
  const averagePricePerItem = totalItems > 0 ? totalSpent / totalItems : 0;
  
  return {
    totalItems,
    totalSpent: parseFloat(totalSpent.toFixed(2)),
    averagePricePerItem: parseFloat(averagePricePerItem.toFixed(2)),
    discountSavings: parseFloat(discountSavings.toFixed(2)),
    percentSaved: parseFloat(percentSaved.toFixed(2)),
    categoriesRepresented: categories
  };
}

async function compressImage(imagePath: string): Promise<string> {
  const stats = fs.statSync(imagePath);
  const sizeInMB = stats.size / (1024 * 1024);
  
  console.log(`📏 Original image size: ${sizeInMB.toFixed(2)} MB`);
  
  if (stats.size <= MAX_IMAGE_SIZE_BYTES) {
    console.log('✅ Image is within size limit, no compression needed\n');
    return imagePath;
  }
  
  console.log(`⚠️  Image exceeds ${MAX_IMAGE_SIZE_MB} MB limit, compressing...\n`);
  
  // Create compressed version in temp directory
  const ext = path.extname(imagePath);
  const basename = path.basename(imagePath, ext);
  const dirname = path.dirname(imagePath);
  const compressedPath = path.join(dirname, `${basename}-compressed${ext}`);
  
  try {
    // Use ImageMagick to compress
    execSync(
      `convert "${imagePath}" -quality 85 -resize 2000x2000\\> "${compressedPath}"`,
      { stdio: 'ignore' }
    );
    
    const compressedStats = fs.statSync(compressedPath);
    const compressedSizeInMB = compressedStats.size / (1024 * 1024);
    
    console.log(`✅ Compressed to: ${compressedSizeInMB.toFixed(2)} MB`);
    console.log(`📁 Saved as: ${path.basename(compressedPath)}\n`);
    
    return compressedPath;
  } catch (error: any) {
    console.error('❌ Image compression failed:', error.message);
    console.error('💡 Make sure ImageMagick is installed: brew install imagemagick');
    process.exit(1);
  }
}

async function processReceipt(imagePath: string) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    console.error('❌ Error: ANTHROPIC_API_KEY not found in .env file');
    process.exit(1);
  }

  console.log('📸 Reading receipt image...');
  
  // Capture upload timestamp
  const uploadedAt = new Date().toISOString();
  
  // Compress if needed
  const processedImagePath = await compressImage(imagePath);
  
  const imageBuffer = fs.readFileSync(processedImagePath);
  const base64Image = imageBuffer.toString('base64');
  
  console.log('🤖 Sending to Claude for processing...\n');
  
  const client = new Anthropic({ apiKey });
  
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'text',
            text: `You are a precise receipt data extraction system. Extract ALL information from this grocery receipt with extreme attention to detail.

CRITICAL INSTRUCTIONS:

1. EXTRACT EVERY PRODUCT LINE ITEM
2. CAPTURE STORE PRODUCT IDs/SKU NUMBERS (usually 6-10 digit numbers before product names)
3. DETECT AND LINK DISCOUNTS TO ITEMS (see store-specific rules below)
4. EXPAND ABBREVIATED PRODUCT NAMES to full interpretable names
5. HANDLE WEIGHT-BASED PRICING (items sold by lb, oz, kg, etc.) - SEE CRITICAL RULE BELOW
6. CAPTURE TAX/ELIGIBILITY CODES (letters like E, F, T, A, NF)
7. DO NOT INCLUDE: bag fees, paper bag charges, non-grocery items (toys, apparel, electronics, greeting cards, flowers)

═══════════════════════════════════════════════════════════════
DISCOUNT LINKING RULES (Store-Specific - CRITICAL):
═══════════════════════════════════════════════════════════════

FOR COSTCO:
- Discount lines appear BELOW the item they apply to
- Look for: negative amounts (10.00-), item numbers starting with "0000", or item names starting with "/"
- Example:
  E  3882772 SBUX HOLIDAY    44.99
  E  0000359678 /KCUP        10.00-
  → SBUX HOLIDAY: price=44.99, discount=10.00, paid=34.99

FOR PCC (PCC Burien):
- Discounts appear in "Savings:" groups below items
- Example:
  BEECHER CHEESE STICK 8PK  $12.99 F
    Savings:
    DELI GROUP              -$5.00
  → Beecher Cheese: price=12.99, discount=5.00, paid=7.99

FOR QFC (Quality Food Centers):
- Items marked with "QA" have QFC Advantage Card discounts applied
- The number after "QA" is the FINAL PAID AMOUNT (after discount)
- CRITICAL: Look for "WT" marker to determine if item is weight-based or fixed-price

WEIGHT-BASED ITEMS (have "WT" marker):
- Example:
  WT    POTATOES SWT WHT     9.30 F
  2.74 lb @ 1.99 /lb
  → isPricedByWeight=true, quantity=2.74, unit="lb", unitPrice=1.99, price=5.45 (2.74×1.99)
  → If followed by "QA 1.98": paid=1.98, discount=3.47 (5.45-1.98)

FIXED-PRICE ITEMS (NO "WT" marker):
- Example with clean pricing:
  SC    1 @ 3/5.00
        PEPPERS BELL RED      1.67 F
  → isPricedByWeight=false, quantity=1, price=1.67, paid=1.67, discount=0

- Example with small discrepancy (FLAG FOR REVIEW):
  2 @ 2/4.00
       FC YAS BELL RED  QA  1.98 F
  SC   QFC SAVINGS         0.02
  → Expected: 2 for $4.00 = $2.00 each
  → QA shows: $1.98 (difference = $0.02)
  → RULE: If price - QA amount < $0.10, treat as rounding/noise
  → Output: price=2.00, paid=2.00, discount=0, needsReview=true
  → reviewReason="Small price discrepancy - QA shows 1.98 vs expected 2.00"

- Example with meaningful discount:
  LACROIX SPRKL 8PK QA    3.99 B
       QFC SAVINGS        1.50
  → Meaningful discount (≥$0.10), calculate normally
  → price=5.49, paid=3.99, discount=1.50

FOR TARGET:
- "Regular Price" shown separately, then deal info
- Example:
  Cafe Bustelo           NF  $13.99
    Regular Price $16.49
    2for$9
  → Cafe Bustelo: price=16.49, discount=2.50, paid=13.99, deal="2 for $9"

FOR SAFEWAY:
- Discounts shown inline or on separate "Club Card Savings" lines
- Follow proximity rule: apply to immediately preceding item

UNIVERSAL RULE: ALWAYS calculate paid = price - discount

═══════════════════════════════════════════════════════════════
WEIGHT-BASED PRICING (CRITICAL RULE):
═══════════════════════════════════════════════════════════════

ONLY mark isPricedByWeight=true if the item has a "WT" marker!

FOR QFC RECEIPTS:
- "WT" marker appears BEFORE items sold by weight
- Example of WEIGHT-BASED (has WT):
  WT    BROCCOLI CROWNS       3.98 F
  1.60 lb @ 2.49 /lb
  → Extract: quantity=1.60, unit="lb", unitPrice=2.49
  → Calculate: price = 1.60 × 2.49 = 3.98
  → isPricedByWeight=true

- Example of FIXED-PRICE (NO WT):
  SC    1 @ 3/5.00
        PEPPERS BELL RED      1.67 F
  → This is a multi-buy deal (3 for $5.00)
  → quantity=1, unit="each", price=1.67
  → isPricedByWeight=false
  → Even if weight info appears nearby, IGNORE IT for pricing

FOR OTHER STORES:
- Look for explicit weight × unit price calculation on the receipt
- Example:
  2.43 lb @ 1.99 /lb    POTATO SWEET RED    4.84 F
  → If 2.43 × 1.99 ≈ 4.84, then isPricedByWeight=true

For fixed-quantity items:
- quantity = whole number (1, 2, etc.)
- unit = "each" or null
- unitPrice = null
- isPricedByWeight = false

═══════════════════════════════════════════════════════════════
PRODUCT NAME EXPANSION:
═══════════════════════════════════════════════════════════════

Expand abbreviated names to full, interpretable product names:

Examples:
- "GG MILK SUBS" → "Good & Gather Milk Substitute"
- "CAFE BUSTELO" → "Café Bustelo Ground Coffee"
- "NAT P HONESTY WAFFLE" → "Nature's Path Honest Waffles"
- "KETTLE POTATO AIR FRIED HIMA" → "Kettle Brand Air Fried Himalayan Salt Potato Chips"
- "KS ORG 2% ILF" → "Kirkland Signature Organic 2% Milk (Half Gallon)"
- "ORG GND TRKY" → "Organic Ground Turkey"
- "SBUX HOLIDAY" → "Starbucks Holiday K-Cup Coffee Pods"

For commodity items (produce, basic staples):
- Drop brand from productKey: "SIGNATURE WHITE RICE" → productKey: "white_rice"
- Keep brand in interpretedName: "Signature White Rice"

For branded products:
- Include brand in productKey: "SIETE TACO SEASONING" → productKey: "siete_taco_seasoning"

═══════════════════════════════════════════════════════════════
CONFIDENCE FLAGGING:
═══════════════════════════════════════════════════════════════

For each item, assess confidence in your interpretation:
- "high": Clear, unambiguous product name
- "medium": Some abbreviation but context makes it clear
- "low": Highly abbreviated or ambiguous - needs human review

═══════════════════════════════════════════════════════════════
OUTPUT SCHEMA:
═══════════════════════════════════════════════════════════════

Return JSON with this exact structure:

{
  "merchant": "Store Name",
  "location": "Store location/branch if visible (e.g., 'Seattle #01', 'Burien, WA')",
  "date": "YYYY-MM-DD",
  "total": 123.45,
  "subtotal": 100.00,
  "tax": 23.45,
  "membershipNumber": "visible membership/loyalty number or null",
  "items": [
    {
      "rawLineItem": "Exact text from receipt",
      "interpretedName": "Full expanded product name",
      "brand": "Brand name or null",
      "productKey": "normalized_identifier (brand_product or just product for commodities)",
      "productCategory": "Generic category for cross-brand comparison (e.g., 'coffee_ground', 'milk_alternative', 'potato_chips')",
      "dietary": ["organic", "gluten_free", "vegan"] or [],
      "attributes": ["frozen", "refrigerated", "air_fried", "ground"] or [],
      "category": "Produce | Meat | Dairy | Bakery | Frozen | Pantry | Snacks | Beverages | Health & Beauty | Household",
      
      "isPricedByWeight": true or false,
      "quantity": 1 or 2.43 (number),
      "unit": "lb" | "oz" | "kg" | "each" | null,
      "unitPrice": 1.99 or null,
      
      "price": 12.99,
      "discount": 5.00,
      "paid": 7.99,
      "deal": "2 for $9" | "Instant Savings" | null,
      
      "storeProductId": "Store SKU/product number or null",
      "taxCode": "E" | "F" | "T" | "A" | "NF" | null,
      "taxCodeMeaning": "Tax Exempt" | "Food Taxable" | "Taxable" | "Alcohol" | "Non-Food" | null,
      
      "confidenceLevel": "high" | "medium" | "low",
      "needsReview": true or false,
      "reviewReason": "Highly abbreviated name" | "Uncertain discount link" | null
    }
  ]
}

═══════════════════════════════════════════════════════════════
CRITICAL REMINDERS:
═══════════════════════════════════════════════════════════════

1. LINK DISCOUNTS CORRECTLY using store-specific rules
2. ALWAYS calculate: paid = price - discount
3. FOR QFC: Only set isPricedByWeight=true if item has "WT" marker
4. FOR QFC: If calculated discount < $0.10, treat as rounding/noise:
   - Set discount=0, paid=price (use clean deal price)
   - Flag needsReview=true with reason explaining small discrepancy
5. EXPAND PRODUCT NAMES fully and intelligently
6. FLAG LOW CONFIDENCE items for human review
7. CAPTURE STORE PRODUCT IDs when visible
8. DO NOT include non-grocery items (toys, apparel, flowers, cards)

Return ONLY valid JSON, no other text.`
          },
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: base64Image
            }
          }
        ]
      }]
    });

    const responseText = response.content[0]?.text || '';
    
    // Try to parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      
      // Generate receiptId
      const receiptId = generateReceiptId(
        data.merchant || 'unknown',
        data.date || new Date().toISOString().split('T')[0]
      );
      
      // Calculate trip metrics
      const tripMetrics = calculateTripMetrics(data.items || [], data.total || 0);
      
      // Add metadata to receipt
      const enrichedData = {
        receiptId,
        uploadedAt,
        ...data,
        tripMetrics
      };
      
      console.log('✅ Receipt processed successfully!\n');
      console.log('📊 Results:');
      console.log(JSON.stringify(enrichedData, null, 2));
      
      return enrichedData;
    } else {
      console.error('❌ Could not find JSON in response');
      console.log('Response:', responseText);
    }
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

// Get image path from command line argument
const imagePath = process.argv[2];

if (!imagePath) {
  console.error('❌ Usage: npx tsx src/process-receipt.ts <path-to-receipt-image>');
  console.error('   Example: npx tsx src/process-receipt.ts ./sample-receipts/receipt-02-pcc.jpeg');
  process.exit(1);
}

if (!fs.existsSync(imagePath)) {
  console.error(`❌ File not found: ${imagePath}`);
  process.exit(1);
}

console.log(`🔍 Processing: ${imagePath}\n`);
processReceipt(imagePath);
