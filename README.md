# Grocery Receipt Intelligence (PWA)

A Progressive Web App for tracking grocery receipts using AI.

## Status
✅ **Phase 1.2 Complete!** - Receipt processing v2.2.1 with multi-store support and intelligent pricing detection

## What This Does

A mobile-first web app that:
- Takes photos of grocery receipts
- Uses AI to extract detailed data (store, items, prices, discounts)
- Tracks price history over time
- Compares prices across stores
- Works offline
- Users provide their own API keys (privacy-first)

## Latest Achievement

**Successfully processing receipts from multiple stores with intelligent pricing detection:**
- ✅ Costco (with instant savings detection)
- ✅ PCC (with member discounts)
- ✅ QFC (with weight-based vs fixed-price detection using WT marker)
- ✅ Target (with multi-buy deals)
- ✅ Safeway (with club card discounts)

**Key features working:**
- Automatic image compression (handles large files)
- Store-specific discount linking
- Weight-based pricing detection (WT marker for QFC)
- Fixed-price item handling (multi-buy deals)
- Product name expansion (abbreviations → full names)
- Confidence flagging (high/medium/low)
- Small discount filtering (<$0.10 treated as rounding noise)
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
  - [x] Weight-based pricing (WT marker detection)
  - [x] Fixed-price item handling
  - [x] Product name expansion
  - [x] Receipt metadata (receiptId, uploadedAt, tripMetrics)
  - [x] Small discount filtering
- [ ] Phase 1.3: Validation UI & prompt refinement
- [ ] Phase 2: Data storage & aggregation
- [ ] Phase 3: Web interface with review UI
- [ ] Phase 4: PWA features
- [ ] Phase 5: Deployment

## Data Extracted Per Receipt

### Receipt-Level:
- `receiptId` - Unique identifier (e.g., "qfc_20250129_968266")
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
- `isPricedByWeight` - Boolean (detected via WT marker for QFC)
- `quantity`, `unit`, `unitPrice` - Pricing details
- `price`, `discount`, `paid` - Full pricing breakdown
- `deal` - Deal type (2 for $9, Instant Savings, etc.)
- `storeProductId` - Store's SKU/product number
- `taxCode` - Tax eligibility code
- `confidenceLevel` - AI confidence (high/medium/low)
- `needsReview` - Flag for human review
- `reviewReason` - Why it needs review

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
npx tsx src/process-receipt.ts "./sample-receipts/5.24.25 QFC.jpeg"
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

**v2.2.1 (Current)** - Weight-based pricing detection + small discount filtering
- Added WT marker detection for weight-based vs fixed-price items
- Small discounts (<$0.10) filtered as rounding noise and flagged for review
- Fixed QFC bell pepper pricing bug (was showing negative paid amount)
- Tested successfully across 6 QFC receipts

**v2.2** - Multi-store support + auto-compression + receipt metadata
- Receipt-level metadata (receiptId, uploadedAt, tripMetrics)
- Automatic image compression for files >4.5MB
- Store-specific discount linking

**v1.0** - Basic receipt processing (Safeway/PCC only)

---

**Status:** Active Development  
**Last Updated:** April 28, 2026
