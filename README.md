# Grocery Receipt Intelligence (PWA)

A Progressive Web App for tracking grocery receipts using AI.

## Status
✅ **Phase 1.2 Complete!** - Receipt processing working with Claude API

## What This Is

A mobile-first web app that:
- Takes photos of grocery receipts
- Uses AI to extract data (store, items, prices)
- Tracks price history over time
- Works offline
- Users provide their own API keys (privacy-first)

## Tech Stack

- **Frontend:** React + TypeScript + Vite (coming in Phase 3)
- **AI:** Anthropic Claude API
- **Storage:** IndexedDB (local) or User's PostgreSQL
- **PWA:** Service Worker, Offline Support

## Current Progress

- [x] Phase 0: Environment setup
- [x] Phase 1.1: Claude API connection working
- [x] Phase 1.2: Receipt image processing working
- [ ] Phase 1.3: Refine prompts for better accuracy
- [ ] Phase 2: Data storage
- [ ] Phase 3: Web interface
- [ ] Phase 4: PWA features
- [ ] Phase 5: Deployment

## Latest Achievement

Successfully processed a Safeway receipt with 14 items extracted automatically!

## For Developers

Currently building the core receipt processing engine in Node.js/TypeScript.

See `REBUILD_PLAN_PWA.md` for the full roadmap.
