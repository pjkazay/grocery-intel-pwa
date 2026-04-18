# Grocery Receipt Intelligence (PWA)

A Progressive Web App for tracking grocery receipts using AI.

## Status
✅ **Phase 1.2 Complete!** - Receipt processing with multi-store support and automated compression

## What This Does

A mobile-first web app that:
- Takes photos of grocery receipts
- Uses AI to extract detailed data (store, items, prices, discounts)
- Tracks price history over time
- Compares prices across stores
- Works offline
- Users provide their own API keys (privacy-first)

## Latest Achievement

**Successfully processing receipts from multiple stores:**
- ✅ Costco (with instant savings detection)
- ✅ PCC (with member discounts)
- ✅ QFC (with loyalty savings)
- ✅ Target (with multi-buy deals)
- ✅ Safeway (with club card discounts)

**Key features working:**
- Automatic image compression (handles large files)
- Store-specific discount linking
- Weight-based pricing ($/lb, $/oz)
- Product name expansion (abbreviations → full names)
- Confidence flagging (high/medium/low)
- Receipt-level analytics (trip metrics)

## Tech Stack

- **Current:** Node.js + TypeScript (receipt processing engine)
- **Frontend (Phase 3):** React + TypeScript + Vite
- **AI:** Anthropic Claude Sonnet 4 API
- **Storage (Phase 2):** IndexedDB (local) or User's PostgreSQL
- **PWA (Phase 4):** Service Worker, Offline Support

## Current Progress

- [x] Phase 0: Environment setup
- [x] Phase 1.1: Claude API connection working
- [x] Phase 1.2: Receipt image processing working
  - [x] Multi-store format support (Costco, PCC, QFC, Target, Safeway)
  - [x] Automatic image compression
  - [x] Store-specific discount rules
  - [x] Weight-based pricing
  - [x] Product name expansion
  - [x] Receipt metadata (receiptId, uploadedAt, tripMetrics)
- [ ] Phase 1.3: Batch processing & prompt refinement
- [ ] Phase 2: Data storage & aggregation
- [ ] Phase 3: Web interface with review UI
- [ ] Phase 4: PWA features
- [ ] Phase 5: Deployment

## Data Extracted Per Receipt

### Receipt-Level:
- `receiptId` - Unique identifier (e.g., "costco_20250828_100800")
- `uploadedAt` - ISO timestamp of when you processed it
- `merchant` - Store name
- `location` - Store branch/location
- `date` - Purchase date
- `total`, `subtotal`, `tax` - Financial totals
- `membershipNumber` - Loyalty/membership number (if visible)
- `tripMetrics` - Calculated analytics:
  - Total items purchased
  - Total spent
  - Average price per item
  - Discount savings
  - Percent saved
  - Categories represented

### Item-Level:
- `rawLineItem` - Exact text from receipt
- `interpretedName` - Full expanded product name
- `brand` - Brand name
- `productKey` - Normalized identifier for matching
- `productCategory` - Generic category for cross-brand comparison
- `dietary` - Tags (organic, gluten-free, vegan, etc.)
- `attributes` - Properties (frozen, ground, air-fried, etc.)
- `category` - Main category (Produce, Meat, Dairy, etc.)
- `quantity`, `unit`, `unitPrice` - Pricing details
- `price`, `discount`, `paid` - Full pricing breakdown
- `deal` - Deal type (2 for $9, Instant Savings, etc.)
- `storeProductId` - Store's SKU/product number
- `taxCode` - Tax eligibility code
- `confidenceLevel` - AI confidence (high/medium/low)
- `needsReview` - Flag for human review

## For Developers

Currently building the core receipt processing engine in Node.js/TypeScript.

### Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Add your Anthropic API key to .env

# Process a receipt
npx tsx src/process-receipt.ts ./sample-receipts/your-receipt.jpeg
```

### Requirements

- Node.js 18+
- ImageMagick (for auto-compression): `brew install imagemagick`
- Anthropic API key

## Architecture

This is a PWA (Progressive Web App), meaning:
- No backend server required
- Users provide their own Anthropic API keys
- Data stored locally or in user's own database
- Can be forked and self-hosted

See `ARCHITECTURE.md` for details.

## Roadmap

See `REBUILD_PLAN_PWA.md` for the full development plan.

## Version History

**v2.2 (Current)** - Multi-store support + auto-compression + receipt metadata
**v1.0** - Basic receipt processing (Safeway/PCC only)

---

**Status:** Active Development  
**Last Updated:** April 17, 2026
