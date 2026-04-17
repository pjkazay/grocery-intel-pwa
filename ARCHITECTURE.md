# Receipt Intelligence - Architecture

## Current Status
Phase 1.1: Testing Claude API connection

## Target: Progressive Web App (PWA)

**Goal:** A mobile-first web app that:
- Runs in Chrome on any device (phone, tablet, desktop)
- Users provide their own API credentials
- Can be forked and self-hosted by anyone
- No centralized backend required

## How It Will Work

### User's First-Time Setup
1. Install/open the PWA on their phone
2. Navigate to Settings
3. Enter their credentials:
   - Anthropic API key
   - Database connection string (optional - local storage fallback)
4. Credentials stored securely in browser (encrypted)

### Receipt Processing Flow
1. User takes photo or uploads receipt image
2. App sends image directly to Anthropic API (from browser)
3. Claude extracts structured data
4. Data saved to:
   - Option A: User's own database (if they provided connection)
   - Option B: Browser's IndexedDB (offline-capable, local only)
5. User can view/edit/export their data anytime

## Technology Stack

### Current (Phase 1)
- **Language:** TypeScript
- **Runtime:** Node.js (for development/testing)
- **AI API:** Anthropic Claude (sonnet-4)

### Planned (PWA Build)
- **Framework:** React + Vite
- **PWA Features:** Service Worker, offline support, installable
- **Storage:** 
  - IndexedDB (local, offline-first)
  - Optional: User's PostgreSQL database (if they provide connection)
- **Styling:** Tailwind CSS
- **API Calls:** Direct from browser to Anthropic (no backend server)
- **Deployment:** Static hosting (GitHub Pages, Vercel, Netlify, or self-hosted)

## Project Structure
```
grocery-intel/
├── src/
│   ├── components/        # React components
│   ├── lib/              # Utilities, API clients
│   ├── stores/           # State management
│   └── workers/          # Service worker for PWA
├── public/
│   ├── manifest.json     # PWA manifest
│   └── icons/            # App icons
├── docs/                 # Documentation
├── sample-receipts/      # Test images
├── .env.example          # Template for users
└── README.md             # Setup instructions
```

## Security Model

**User Controls Their Own Data:**
- API keys never leave their device
- Stored encrypted in browser
- Each user runs their own instance
- No central server = no data breach risk

**For Database Users:**
- They provide their own Neon/Supabase/PostgreSQL URL
- Direct connection from browser to their database
- Full control over their data

**For Local-Only Users:**
- Everything stays in IndexedDB
- Can export to CSV/JSON anytime
- Works completely offline

## Deployment Options

### Option 1: GitHub Pages (Easiest)
- Fork repo
- Enable GitHub Pages
- Visit `username.github.io/grocery-intel`
- Enter your API keys
- Start using

### Option 2: Self-Hosted
- Clone repo
- Run `npm run build`
- Serve `dist/` folder from any web server
- Works on local network or internet

### Option 3: Mobile-Friendly Platforms
- Vercel (auto-deploy from GitHub)
- Netlify (auto-deploy from GitHub)
- Cloudflare Pages

## Current Phase: Command-Line Foundation

**Phase 1:** Build core receipt processing logic
- Test Claude API
- Perfect the extraction prompts
- Handle edge cases
- Get 90%+ accuracy

**Phase 2:** Add database layer (optional)
- Support for user-provided PostgreSQL
- Fallback to IndexedDB

**Phase 3:** Build PWA interface
- Mobile-first design
- Camera integration
- Settings for API keys
- Receipt list and detail views

**Phase 4:** PWA features
- Service worker for offline support
- Installable on home screen
- Push notifications (optional)
- Background sync

**Phase 5:** Polish and deploy
- Instructions for self-hosting
- Template `.env` file
- Easy fork-and-deploy setup