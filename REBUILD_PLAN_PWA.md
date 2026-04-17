# Receipt Intelligence - Rebuild Plan (PWA Edition)

## Goal

Build a Progressive Web App that processes grocery receipts using AI, works offline, and puts users in control of their own data.

---

## PWA Architecture Overview

**What's Different:**
- No backend server (everything runs in browser)
- Users provide their own API keys
- Data stored locally (IndexedDB) or user's own database
- Can be installed on phone like a native app
- Works offline after first load

**Why Better:**
- More secure (no central server)
- More private (user owns their data)
- Cheaper (no hosting costs)
- Easier to deploy (static files)
- Anyone can fork and customize

---

## Development Phases

### Phase 1: Core Receipt Processing (Weeks 1-2)

**Build the AI extraction engine using Node.js**

**Why Node.js first?** Easier to test and debug. We'll move it to the browser in Phase 3.

#### 1.1: Test Claude API (Days 1-2)
```bash
# Install dependencies
npm install @anthropic-ai/sdk typescript tsx

# Create simple test
src/test-api.ts → "Hello Claude"

# Verify connection works
npx tsx src/test-api.ts
```

**Success:** Claude responds to test message

---

#### 1.2: Process One Receipt (Days 3-5)
```typescript
// src/processor.ts
function processReceipt(imagePath: string) {
  // Read image → base64
  // Send to Claude with detailed prompt
  // Parse JSON response
  // Return structured data
}
```

**Test:** Process a sample receipt, print JSON

**Success:** Extracts merchant, date, total, items

---

#### 1.3: Refine Prompts (Days 6-8)
- Handle quantity detection ("2@", "3X")
- Better category assignment
- Extract brands and volumes
- Test with 10 different receipts

**Success:** 90%+ accuracy on clear receipts

---

#### 1.4: Error Handling (Days 9-10)
- Handle blurry images
- Handle partial/damaged receipts
- Validate extracted data
- Provide confidence scores

**Phase 1 Deliverable:** CLI tool that processes receipts
```bash
node process-receipt.js receipt.jpg
# → outputs structured JSON
```

---

### Phase 2: Storage Layer (Week 3)

**Add data persistence (browser-compatible)**

#### 2.1: IndexedDB Setup (Days 1-2)
```typescript
// src/storage/indexeddb.ts
class ReceiptStorage {
  async save(receipt: Receipt)
  async get(id: string)
  async list()
  async delete(id: string)
  async export() // to CSV/JSON
}
```

**Success:** Can save and retrieve receipts

---

#### 2.2: Optional PostgreSQL Support (Days 3-4)
```typescript
// src/storage/postgres.ts
class PostgresStorage {
  constructor(connectionString: string) // user-provided
  // Same interface as IndexedDB
}
```

**Success:** Can connect to user's database

---

#### 2.3: Encryption Layer (Day 5)
```typescript
// src/crypto.ts
function encryptAPIKey(key: string)
function decryptAPIKey(encrypted: string)
```

**Success:** API keys stored securely

---

**Phase 2 Deliverable:** Data persists between runs

---

### Phase 3: React PWA Interface (Week 4)

**Convert to browser-based web app**

#### 3.1: Vite + React Setup (Day 1)
```bash
npm create vite@latest
# Choose React + TypeScript
npm install
```

Move processing logic into `/src/lib`

---

#### 3.2: Core Components (Days 2-4)

**Settings Page:**
```tsx
// src/components/Settings.tsx
- API key input (encrypted storage)
- Storage mode: Local vs Database
- Database connection (optional)
- Export all data button
```

**Upload Interface:**
```tsx
// src/components/UploadZone.tsx
- Camera button (mobile)
- File upload (desktop)
- Drag and drop
- Show processing status
```

**Receipt List:**
```tsx
// src/components/ReceiptList.tsx
- Show all receipts
- Search and filter
- Sort by date/store/amount
- Click to view details
```

**Receipt Detail:**
```tsx
// src/components/ReceiptDetail.tsx
- Show receipt image
- Show extracted data
- Edit items
- Delete receipt
```

---

#### 3.3: State Management (Day 5)
```typescript
// src/stores/receipts.ts
- Load receipts from storage
- Add new receipt
- Update receipt
- Delete receipt
- Search/filter logic
```

---

#### 3.4: Mobile Optimization (Days 6-7)
- Touch-optimized UI
- Camera integration
- Responsive design (phone-first)
- Large tap targets

**Phase 3 Deliverable:** Working web app
```bash
npm run dev
# Open localhost:5173 in browser
```

---

### Phase 4: PWA Features (Week 5)

**Make it installable and offline-capable**

#### 4.1: Service Worker (Days 1-2)
```typescript
// public/sw.js
- Cache app shell (HTML, CSS, JS)
- Cache receipt images
- Handle offline requests
- Background sync (when online)
```

---

#### 4.2: App Manifest (Day 3)
```json
// public/manifest.json
{
  "name": "Receipt Intelligence",
  "short_name": "Receipts",
  "icons": [...],
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4f46e5"
}
```

---

#### 4.3: Icons & Splash Screens (Day 4)
- Generate icons (192x192, 512x512)
- iOS splash screens
- Favicon

---

#### 4.4: Install Prompt (Day 5)
```typescript
// Prompt user to "Add to Home Screen"
// Works on iOS and Android
```

---

#### 4.5: Testing (Days 6-7)
- Test on iPhone (Safari)
- Test on Android (Chrome)
- Test offline mode
- Test installation
- Fix bugs

**Phase 4 Deliverable:** Installable PWA that works offline

---

### Phase 5: Documentation & Deploy (Week 6)

**Make it easy for others to use**

#### 5.1: User Documentation (Days 1-2)
```markdown
# README.md
- What it is
- How to get started
- How to get API key
- How to use the app
- FAQ
- Troubleshooting
```

---

#### 5.2: Developer Documentation (Days 3-4)
```markdown
# CONTRIBUTING.md
- How to fork
- How to run locally
- How to build
- How to customize

# .env.example
ANTHROPIC_API_KEY=your_key_here
DATABASE_URL=postgres://... (optional)
```

---

#### 5.3: Deploy Demo (Day 5)
```bash
# Build for production
npm run build

# Deploy to GitHub Pages
# Enable in repo settings
# Visit username.github.io/grocery-intel
```

---

#### 5.4: Polish (Days 6-7)
- Test user onboarding flow
- Add helpful tooltips
- Create demo video (optional)
- Write blog post (optional)

**Phase 5 Deliverable:** Production app anyone can use

---

## Technical Architecture

### Browser-Based Flow
```
User's Phone
  ↓
[Your PWA in Browser]
  ↓
API Key (stored encrypted) → Anthropic API
  ↓
Receipt Data → IndexedDB (local)
           OR → User's PostgreSQL (optional)
```

### No Backend Required
```
Traditional:  User → Your Server → Database
                         ↓
                   (You manage everything)

PWA Version:  User → Their Browser
                         ↓
              (They manage their own data)
```

---

## File Structure

```
grocery-intel/
├── public/
│   ├── manifest.json         # PWA config
│   ├── sw.js                 # Service worker
│   └── icons/                # App icons
├── src/
│   ├── components/
│   │   ├── Settings.tsx
│   │   ├── UploadZone.tsx
│   │   ├── ReceiptList.tsx
│   │   └── ReceiptDetail.tsx
│   ├── lib/
│   │   ├── anthropic.ts      # Claude API
│   │   ├── processor.ts      # Receipt processing
│   │   └── crypto.ts         # Encryption
│   ├── storage/
│   │   ├── indexeddb.ts      # Local storage
│   │   └── postgres.ts       # Optional DB
│   └── App.tsx
├── docs/                     # Your planning docs
├── .env.example              # Template
└── README.md                 # User guide
```

---

## Key Decisions

### Storage Strategy
**Default: IndexedDB (local)**
- Works offline
- No setup required
- Privacy-first

**Optional: User's Database**
- They provide connection string
- Multi-device sync
- They control backups

### API Key Management
**User provides their own**
- Encrypted in browser
- Never sent to any server (except Anthropic)
- Can be changed anytime

### Deployment
**GitHub Pages (recommended)**
- Free
- Auto-deploy from repo
- Custom domain support

---

## Development Workflow

### Phase 1-2: Node.js Development
```bash
# Work in src/
npx tsx src/test-receipt.ts
```

### Phase 3-5: Browser Development
```bash
# Start dev server
npm run dev

# Open browser
http://localhost:5173

# Make changes, see live updates
```

### Build for Production
```bash
npm run build
# Creates dist/ folder with optimized files
```

---

## Testing Strategy

### Phase 1: Unit Tests
```typescript
// Test receipt processing
expect(processReceipt(sampleImage)).toEqual({
  merchant: "Safeway",
  total: 47.83,
  items: [...]
})
```

### Phase 3: Browser Testing
- Manual testing on localhost
- Test on real phone (use ngrok or LAN)
- Test camera functionality
- Test offline mode

### Phase 5: User Testing
- Give to 2-3 friends
- Watch them use it
- Fix confusing parts
- Improve onboarding

---

## Success Metrics

### Phase 1 Success:
- Processes 9/10 receipts correctly
- Handles edge cases (blurry, folded)
- Returns structured JSON

### Phase 3 Success:
- Can upload receipt on phone
- Data saves and persists
- Can view past receipts
- UI is intuitive

### Phase 5 Success:
- Friend can install and use it
- Works on iOS and Android
- Offline mode functions
- Others fork and customize

---

## Timeline Summary

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| 1 | 2 weeks | CLI receipt processor |
| 2 | 1 week | Data persistence |
| 3 | 1 week | React web app |
| 4 | 1 week | PWA features |
| 5 | 1 week | Documentation + deploy |

**Total: 6-8 weeks at 1-2 hours/day**

---

## What's Next

**Right now (Phase 1.1):**
1. Initialize npm project
2. Install dependencies
3. Create test file
4. Test Claude API connection
5. See "Hello from Claude!"

**Then we'll build from there, one step at a time.**

Ready to start? Let's get that API working!
