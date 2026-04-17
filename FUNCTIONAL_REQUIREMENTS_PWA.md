# Receipt Intelligence - Functional Requirements (PWA Edition)

## Core Principle

**Users control their own data and credentials.** This is a tool, not a service.

---

## FR-1: First-Time Setup (Critical)

**User Need:** "I want to start using this without creating an account"

**Flow:**
1. User visits PWA URL (or installs from home screen)
2. Sees welcome screen with quick explanation
3. Clicks "Get Started"
4. Prompted for Anthropic API key
   - Link to console.anthropic.com
   - Tooltip: "Your key stays on your device, never sent to our servers"
   - Optional: "How to get an API key" guide
5. Choose storage mode:
   - **Local (Recommended):** Everything stays on this device
   - **Database:** Enter PostgreSQL connection string
6. Key encrypted and stored in browser
7. Taken to main upload screen

**Success Criteria:**
- Non-technical user can complete in < 5 minutes
- Clear explanation of what API key is
- Obvious link to get API key
- Can skip database setup

**Edge Cases:**
- Invalid API key → Show friendly error
- Lost API key → Instructions to reset
- Switching devices → Can export/import data

---

## FR-2: Receipt Upload & Processing

**User Need:** "Take a photo of my receipt and extract the data automatically"

### Mobile Flow:
1. Tap camera button
2. Camera opens (native browser camera)
3. Take photo or select from gallery
4. Optional: Crop/rotate receipt
5. Confirm photo looks good
6. Tap "Process Receipt"
7. Shows progress:
   - "Compressing image..."
   - "Sending to AI..."
   - "Extracting data..."
8. Shows extracted data for review

### Desktop Flow:
1. Drag receipt image to upload zone
2. Or click to browse files
3. Preview image
4. Click "Process Receipt"
5. Same progress indicators
6. Shows extracted data

**What Gets Extracted:**
- Merchant/store name
- Date of purchase
- Total amount
- Individual items:
  - Name (interpreted from abbreviations)
  - Quantity
  - Price
  - Category (Produce, Dairy, etc.)
  - Brand (if detectable)
  - Volume/size (if present)

**Success Criteria:**
- 90%+ accuracy on clear receipts
- Handles common abbreviations
- Detects quantities (2@, 3X, etc.)
- Processes in < 10 seconds
- Works on blurry receipts (with warning)

**Edge Cases:**
- No internet → Queue for later
- Very long receipt → Paginate items
- Foreign language → Detect and warn
- Thermal receipt (faded) → Best effort + warning

---

## FR-3: Review & Edit Data

**User Need:** "The AI got some items wrong, I want to fix them"

**Flow:**
1. After processing, shows extracted data
2. Each item editable inline
3. Can:
   - Change item name
   - Adjust quantity
   - Fix price
   - Change category
   - Add notes
4. Tap "Save" to keep changes
5. Or "Discard" to delete receipt

**Features:**
- Tap any field to edit
- Category dropdown
- Numeric keyboard for prices
- Mark items as "verified" (green checkmark)

**Success Criteria:**
- Easy to spot errors
- Quick to fix (< 30 seconds per receipt)
- Changes save immediately
- Can edit anytime (not just after upload)

---

## FR-4: Receipt History & Search

**User Need:** "Find that Safeway receipt from last month where I bought pasta"

**List View:**
- Sorted by date (newest first)
- Shows: Store, Date, Total, Item count
- Receipt image thumbnail
- Tap to view details

**Search:**
- Search bar at top
- Searches: store name, item names, dates
- Real-time results
- Highlights matching text

**Filters:**
- By store
- By date range
- By amount (< $50, $50-$100, etc.)
- By category
- Combine filters

**Success Criteria:**
- Search results in < 1 second
- Can find any receipt quickly
- Filters are intuitive
- Works offline

---

## FR-5: Price Tracking

**User Need:** "Show me if I'm paying too much for milk"

**Per-Item View:**
- Tap any item name
- Shows: "You bought this X times"
- Price history chart (line graph)
- By store comparison:
  - Safeway: $4.99 (current)
  - Fred Meyer: $4.79 (best price, 2 weeks ago)
  - QFC: $5.29
- Average price over time

**Insights:**
- "Milk is 20¢ cheaper at Fred Meyer"
- "This is your lowest price for eggs in 3 months"
- "Strawberries are in season (30% cheaper than winter)"

**Success Criteria:**
- Chart is readable on phone
- Easy to compare stores
- Shows trends over time
- Highlights best deals

---

## FR-6: Data Export

**User Need:** "I want my data in Excel to analyze it myself"

**Export Options:**
- **CSV** - All receipts with items
- **JSON** - Structured data for developers
- **PDF** - Printable report (optional)

**What's Included:**
- All receipts
- All items
- Price history
- Date range option

**Success Criteria:**
- One-tap export
- Opens in spreadsheet app
- Includes all data
- Properly formatted

---

## FR-7: Offline Support (PWA Feature)

**User Need:** "I want to view my receipts even without internet"

**What Works Offline:**
- View all past receipts
- Search and filter
- Edit receipts
- View price history
- Export data

**What Needs Internet:**
- Processing new receipts (requires Claude API)
- Syncing to database (if using)

**When Back Online:**
- Queued receipts process automatically
- Shows notification: "2 receipts processed"

**Success Criteria:**
- App loads offline
- Clear indicators when features unavailable
- Queued items process when reconnected

---

## FR-8: Settings Management

**User Need:** "Change my API key or storage settings"

**Settings Page:**
1. **API Key**
   - Show masked key: `sk-ant-***...***123`
   - "Change API key" button
   - "Test connection" button

2. **Storage**
   - Current mode: Local or Database
   - Used space: 45MB / 500MB (IndexedDB)
   - "Switch to database" / "Switch to local"
   - "Clear all data" (with confirmation)

3. **Privacy**
   - "Export all data"
   - "Delete all data"
   - "Erase API key"

4. **About**
   - App version
   - Links: GitHub, Documentation
   - "Report an issue"

**Success Criteria:**
- Can change settings anytime
- Clear explanations
- Destructive actions require confirmation

---

## FR-9: Installation (PWA)

**User Need:** "Install this on my phone like a real app"

**iOS (Safari):**
- Visit site
- Tap Share button
- "Add to Home Screen"
- App appears as icon

**Android (Chrome):**
- Visit site
- "Add to Home Screen" prompt appears
- Tap "Install"
- App appears as icon

**Features:**
- Launches in full screen (no browser chrome)
- Custom app icon
- Splash screen while loading
- Feels like native app

**Success Criteria:**
- Installable on iOS and Android
- Works offline after install
- Can uninstall like normal app

---

## FR-10: Database Sync (Optional)

**User Need:** "Access my receipts on both my phone and computer"

**Setup:**
1. User provides PostgreSQL connection string
   - From Neon, Supabase, or own server
   - Stored encrypted
2. App creates tables on first sync
3. All receipts upload to database

**Syncing:**
- Auto-sync when online
- Manual "Sync now" button
- Shows: "Last synced 5 minutes ago"
- Conflict resolution (last write wins)

**Success Criteria:**
- Works with any PostgreSQL database
- Syncs in background
- Doesn't block UI
- Handles connection failures gracefully

---

## Non-Functional Requirements

### Performance
- Receipt processing: < 10 seconds
- App load time: < 2 seconds
- Search query: < 1 second
- Smooth 60fps scrolling

### Security
- API keys encrypted at rest
- HTTPS only in production
- No analytics or tracking
- Open source (auditable)

### Usability
- Works on phones 4"+ screens
- Touch targets ≥ 44px
- Readable text (≥ 16px)
- High contrast for accessibility
- Works in bright sunlight

### Reliability
- Offline-first design
- Graceful degradation
- Error messages are helpful
- Auto-save (no data loss)

### Browser Support
- iOS Safari 14+
- Android Chrome 90+
- Desktop Chrome/Firefox/Safari

---

## User Workflows

### First-Time User
1. Hears about app from friend
2. Visits link on phone
3. Reads "Get your own receipt tracker"
4. Clicks "Get Started"
5. Gets Anthropic API key ($5 credit)
6. Enters key in app
7. Takes photo of receipt in wallet
8. Sees extracted data
9. "Wow, that worked!"
10. Installs to home screen

### Regular Use
1. Grocery shopping
2. Keep receipt
3. In car after shopping
4. Open app (from home screen)
5. Tap camera
6. Photo of receipt
7. Review data (looks good)
8. Save
9. Done (30 seconds total)

### Power User
1. Uses app for 3 months
2. Has 50+ receipts
3. Searches "eggs"
4. Sees price history chart
5. "Eggs are 40¢ cheaper at Fred Meyer!"
6. Makes shopping decision
7. Saves $20/month

---

## Future Enhancements (Not MVP)

### Phase 6+ Ideas:
- **Shopping list generation** from past purchases
- **Budget alerts** when over spending
- **Recipe integration** (link items to meals)
- **Family sharing** (multiple users)
- **Barcode scanner** for quick item lookup
- **Receipt templates** for frequent stores
- **Tax category tagging** for deductions
- **Meal planning** integration

---

## Out of Scope

**Will NOT include:**
- ❌ Social features (sharing receipts)
- ❌ Coupon finding/management
- ❌ Price predictions (machine learning)
- ❌ Inventory tracking ("what's in my fridge")
- ❌ Payment processing (no buying through app)
- ❌ Loyalty program integration
- ❌ Multi-user accounts on same device

---

## Success Metrics

**User Adoption:**
- User completes first receipt upload: 80%
- User installs PWA: 50%
- User uploads 5+ receipts: 60%
- User returns after 1 week: 40%

**Technical:**
- Extraction accuracy: 90%+
- App load time: < 2 seconds
- Offline mode works: 100%
- No data loss: 100%

**User Satisfaction:**
- Can set up without help: 80%
- Finds price insights useful: 70%
- Would recommend to friend: 60%

---

## Design Principles

1. **Privacy First** - User's data is their own
2. **Mobile First** - Optimized for phones
3. **Offline First** - Works without internet
4. **Progressively Enhanced** - Core features work everywhere, advanced features where supported
5. **Open Source** - Fully transparent and forkable

---

This PWA puts users in control while being easier to build and deploy than the original client-server architecture!
