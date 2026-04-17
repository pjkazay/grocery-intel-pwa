# Receipt Intelligence App - Architecture Inventory

## High-Level Overview

**What This App Does:**
You take photos of grocery receipts → AI reads them → You get a database of what you bought, where, and for how much → You can track prices over time and see patterns

**The Big Picture (Non-Technical):**
Think of this like having a smart filing cabinet that:
1. Takes pictures of your receipts
2. Reads them like a human would
3. Organizes everything in a searchable database
4. Tells you useful things like "This brand is cheaper at Store X"

---

## Top-Level Folder Structure

```
/
├── client/          ← What you see (the website/app interface)
├── server/          ← What processes things (the behind-the-scenes logic)
├── shared/          ← Rules both sides agree on (data structure definitions)
├── migrations/      ← Database setup instructions
├── attached_assets/ ← Sample receipts for testing
└── config files     ← Instructions for how things should run
```

---

## 1. CLIENT FOLDER (Frontend - The User Interface)

**What it is:** The visual part you interact with in your browser

**Technology:** React + TypeScript
- **React**: Think of it like LEGO blocks for websites - you build pages from reusable pieces
- **TypeScript**: JavaScript with safety rails - catches errors before they happen

**Key Subfolders:**

### `/client/src/pages/`
- **Purpose:** The main "screens" of your app
- **Files:**
  - `upload.tsx` - Where you upload receipt photos
  - `receipts.tsx` - List of all your receipts
  - `dashboard.tsx` - Overview/summary page with stats
  - `analysis.tsx` - Charts and insights about spending
  - `export.tsx` - Download your data
  
### `/client/src/components/`
- **Purpose:** Reusable UI building blocks
- **Structure:**
  - `/ui/` - Basic pieces (buttons, cards, inputs) from shadcn/ui library
  - `/layout/` - Page structure (header, sidebar)
  - `/receipt/` - Receipt-specific components
    - `upload-zone.tsx` - Drag-and-drop file uploader
    - `review-modal.tsx` - Edit receipt data if AI makes mistakes
    - `image-modal.tsx` - View receipt images full-size
  - `/dashboard/` - Dashboard widgets
    - `stats-cards.tsx` - Those number boxes showing totals
    - `recent-receipts.tsx` - List of latest uploads
    - `price-insights.tsx` - Price comparison displays

### `/client/src/lib/`
- **Purpose:** Helper utilities
- `queryClient.ts` - Manages server data fetching/caching
- `utils.ts` - Common utility functions

### `/client/src/hooks/`
- **Purpose:** Reusable React logic chunks
- Custom hooks for mobile detection, toast notifications, etc.

**Think of it like:** The client is the restaurant dining room - it's what customers see and interact with. The components are the tables, chairs, and décor.

---

## 2. SERVER FOLDER (Backend - The Engine Room)

**What it is:** The logic that processes receipts and manages data

**Technology:** Express.js + TypeScript (Node.js)
- **Express**: A web server framework - handles requests like "upload this receipt" or "show me all receipts"
- **Node.js**: Runs JavaScript on the server (not in browser)

**Key Files:**

### `anthropic.ts` (THE BRAIN - 300 lines)
**What it does:** Talks to Claude AI to read receipts
**Key Functions:**
1. `processReceiptWithAI()` 
   - Takes a base64-encoded image
   - Sends it to Claude with detailed instructions
   - Gets back structured data (merchant, date, items, prices)
   - Handles quantity detection (like "2@" means buy 2)
   - Cleans up abbreviations ("GOOD CRISP SOUR CRM" → "Sour Cream & Onion Chips")

2. `interpretReceiptText()`
   - For text-only receipts
   - AI interprets abbreviated product names

3. `analyzeSpendingPatterns()`
   - Looks at multiple receipts
   - Generates insights like "You spend more at Store X on Fridays"

**Think of it like:** This is the expert who reads receipts for you - it knows how to interpret "2@ CELSIUS" as "2 Celsius drinks"

### `routes.ts` (THE TRAFFIC CONTROLLER - 300+ lines)
**What it does:** Defines API endpoints - URLs the frontend calls
**Key Routes:**
- `POST /api/receipts/upload` - Upload new receipt
- `GET /api/receipts` - List all receipts
- `GET /api/receipts/:id` - Get one receipt
- `PUT /api/receipts/:id` - Update receipt after review
- `DELETE /api/receipts/:id` - Delete receipt
- `GET /api/analysis/spending` - Get spending insights
- `GET /api/analysis/price-history/:itemName` - Track item prices over time

**Think of it like:** This is the phone system routing calls to the right department

### `storage.ts` (THE FILE CLERK - 300+ lines)
**What it does:** Handles file uploads and image storage
- Uses Multer to receive files
- Converts images to base64
- Manages file paths and URLs

**Think of it like:** The document filing system

### `db.ts` (THE DATABASE CONNECTOR - ~50 lines)
**What it does:** Connects to PostgreSQL database
- Uses Drizzle ORM for type-safe queries
- Handles connection pooling

### `index.ts` (THE STARTUP SCRIPT - ~100 lines)
**What it does:** Starts the server, sets up middleware
- Initializes Express
- Configures CORS, sessions
- Starts listening on port 5000

**Think of it like:** The server is the restaurant kitchen - where all the food prep happens. Routes are the order tickets, Anthropic.ts is the head chef, and storage is the walk-in fridge.

---

## 3. SHARED FOLDER (The Contract)

**What it is:** Data structure definitions both frontend and backend understand

### `schema.ts` (THE RULEBOOK - ~110 lines)
**What it defines:**

1. **Database Tables:**
   - `users` - Who can log in
   - `receipts` - Each receipt's basic info (merchant, date, total, status)
   - `receiptItems` - Individual line items (what you bought)
   - `priceHistory` - Historical price tracking
   - `categories` - Product categories (Produce, Dairy, etc.)

2. **Data Types:**
   - TypeScript types so both sides know what data looks like
   - Validation schemas using Zod

**Key Receipt Fields:**
- `merchant`: Store name
- `date`: Purchase date
- `total`: Receipt total amount
- `status`: "processing" | "needs_review" | "processed"
- `imageUrl`: Path to receipt image
- `rawText`: Full OCR text from receipt

**Key Item Fields:**
- `rawLineItem`: Exact text from receipt ("2@ CELSIUS WATERMELON")
- `interpretedName`: Cleaned name ("Celsius Watermelon Energy Drink")
- `brand`, `volume`, `category`
- `quantity`, `price`, `pricePerUnit`
- `discount`: If item was on sale
- `isUserCorrected`: If you manually fixed AI mistakes

**Think of it like:** This is the menu - both the kitchen and dining room need to agree on what "Caesar Salad" means

---

## 4. CONFIGURATION FILES (Root Level)

### `package.json` (THE DEPENDENCY LIST)
**What it is:** Lists all external libraries the app uses
**Key Dependencies:**
- `@anthropic-ai/sdk` - Talk to Claude AI
- `@neondatabase/serverless` - PostgreSQL database
- `drizzle-orm` - Database toolkit
- `express` - Web server
- `react` - UI framework
- `@tanstack/react-query` - Server data management
- `@radix-ui/*` - 30+ UI component libraries
- `tailwindcss` - CSS styling system

**Scripts:**
- `npm run dev` - Start development server (both frontend + backend)
- `npm run build` - Build for production
- `npm run db:push` - Update database schema

### `tsconfig.json` (TYPESCRIPT RULES)
**What it does:** TypeScript compiler settings

### `vite.config.ts` (BUILD TOOL CONFIG)
**What it does:** Configures Vite (fast build tool for React)

### `tailwind.config.ts` (STYLING CONFIG)
**What it does:** Configures Tailwind CSS utility classes

### `drizzle.config.ts` (DATABASE CONFIG)
**What it does:** Database connection and migration settings

---

## 5. MIGRATIONS FOLDER (Database Recipes)

### `0000_outstanding_captain_marvel.sql`
**What it is:** Initial database setup SQL
**Creates:**
- All tables (users, receipts, receiptItems, etc.)
- Relationships between tables
- Indexes for fast lookups

**Think of it like:** The blueprint for building your filing cabinet system

---

## 6. ATTACHED_ASSETS (Sample Data)

**Sample Receipts:**
- `6.10.Safeway_1749663540590.jpeg` - Safeway receipt photo
- `PCC 5.31_1749667859136.jpeg` - PCC (co-op) receipt
- `safeway_receipt.b64` - Base64-encoded receipt
- `image_*.png` - Screenshot samples

**Requirements Docs:**
- Two text files with original product requirements you gave to Replit

**Purpose:** Test data to verify AI processing works

---

## Technology Stack Summary

### Frontend Stack
- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool (fast dev server)
- **TanStack Query** - Server state management
- **Wouter** - Routing
- **Tailwind CSS** - Styling
- **Radix UI + shadcn/ui** - Component library
- **Recharts** - Data visualization

### Backend Stack
- **Node.js** - JavaScript runtime
- **Express** - Web server framework
- **TypeScript** - Type safety
- **Multer** - File upload handling
- **Express Sessions** - User sessions

### Database Stack
- **PostgreSQL** - Database (via Neon)
- **Drizzle ORM** - Database toolkit
- **Drizzle Kit** - Migration tool

### AI Stack
- **Anthropic Claude API** - Receipt processing
- **Model:** claude-sonnet-4-20250514 (newest)

### Deployment
- **Originally:** Replit autoscale
- **We'll rebuild for:** Vercel/Netlify or similar

---

## Data Flow Summary

**Upload Flow:**
```
1. User drops image in upload-zone.tsx
2. Frontend sends to POST /api/receipts/upload
3. storage.ts converts to base64
4. anthropic.ts sends to Claude API
5. Claude returns structured JSON:
   {
     merchant: "Safeway",
     date: "2025-06-10",
     total: 47.83,
     items: [
       {
         rawLineItem: "2@ CELSIUS WATERMELON",
         interpretedName: "Celsius Watermelon Energy Drink",
         quantity: 2,
         price: 5.98,
         category: "Beverages"
       },
       ...
     ]
   }
6. routes.ts saves to database via Drizzle ORM
7. Frontend receives confirmation
8. Dashboard updates with new data
```

**Price Tracking Flow:**
```
1. Each receipt item is saved
2. Price history table records: item + price + merchant + date
3. When viewing item, query price_history for that item name
4. Display price trends over time
5. Show best/worst prices by merchant
```

---

## What Makes This Complex

1. **AI Integration:** Talking to Claude API with proper prompts
2. **Image Handling:** Base64 encoding, file storage
3. **Data Modeling:** Receipts have items, items have prices, need history tracking
4. **Type Safety:** TypeScript everywhere means types must match
5. **UI Component Library:** 30+ Radix UI components with shadcn wrapper
6. **Database Schema:** 5 related tables with foreign keys
7. **State Management:** React Query for server data sync

---

## What Makes This Manageable

1. **Well-structured:** Clear separation of concerns
2. **Modern stack:** Established best practices
3. **Type safety:** Catch errors early
4. **Good docs:** Technologies are well-documented
5. **Reusable patterns:** Once you learn one component, you understand others
6. **AI does heavy lifting:** Claude handles the hard part (OCR)

---

## Environment Variables Required

```
DATABASE_URL=postgresql://...        # Neon PostgreSQL connection
ANTHROPIC_API_KEY=sk-ant-...        # Claude API key
NODE_ENV=development                # or 'production'
```

---

## Development vs Production

**Development (Replit):**
- `npm run dev` runs both frontend + backend
- Hot reload for instant changes
- Single port (5000)
- SQLite or hosted Postgres

**Production (What we'll build):**
- Frontend built to static files
- Backend runs separately
- Environment variables for secrets
- PostgreSQL (Neon, Supabase, or similar)
- Deployed to Vercel/Railway/Render

---

## Next Steps Preview

We'll rebuild this by:
1. Setting up local dev environment
2. Building minimal receipt processor (just Claude API + one endpoint)
3. Adding database layer
4. Building simple upload UI
5. Adding review/edit capability
6. Adding price tracking
7. Deploying

Each step will be thoroughly explained so you understand WHY, not just WHAT.
