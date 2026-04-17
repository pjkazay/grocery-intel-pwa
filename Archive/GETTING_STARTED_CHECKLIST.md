# Getting Started Checklist

Use this to track your progress through the rebuild.

---

## Week 0: Preparation

### Phase 0: Environment Setup
- [ ] Install Node.js (v18+)
  - Download: https://nodejs.org
  - Verify: `node --version`
  
- [ ] Install Git
  - Download: https://git-scm.com
  - Verify: `git --version`
  
- [ ] Install VS Code
  - Download: https://code.visualstudio.com
  - Install extensions:
    - [ ] Prettier
    - [ ] ES7+ React snippets
    - [ ] Tailwind CSS IntelliSense
    
- [ ] Create GitHub account
  - Sign up: https://github.com
  - Create repo: "receipt-intelligence"
  
- [ ] Sign up for Neon (database)
  - Create account: https://neon.tech
  - Create project
  - Copy connection string
  
- [ ] Get Anthropic API key
  - Create account: https://console.anthropic.com
  - Create API key
  - Note: $5 free credit
  
- [ ] Read all documentation
  - [ ] PROJECT_SUMMARY.md
  - [ ] ARCHITECTURE_INVENTORY.md (skim)
  - [ ] FUNCTIONAL_REQUIREMENTS.md
  - [ ] REBUILD_PLAN.md (Phase 1 only)

**Time estimate:** 2-4 hours

---

## Week 1-2: Core Processing

### Phase 1.1: Minimal Claude Integration (Day 1-2)
- [ ] Create project folder: `receipt-intelligence/`
- [ ] Initialize npm: `npm init -y`
- [ ] Install dependencies:
  ```bash
  npm install @anthropic-ai/sdk typescript @types/node tsx
  ```
- [ ] Create `.env` file with API key
- [ ] Create `.gitignore` (include `.env`)
- [ ] Create `src/test-receipt.ts`
- [ ] Add sample receipt image
- [ ] Run: `npx tsx src/test-receipt.ts`
- [ ] Verify: Claude returns JSON data

**Success:** Can process one receipt from command line

---

### Phase 1.2: Structured Processing (Day 3-4)
- [ ] Create `src/processor.ts`
- [ ] Define TypeScript interfaces
- [ ] Add proper error handling
- [ ] Test with multiple receipts
- [ ] Verify: Type-safe processing works

**Success:** Clean, typed receipt processor

---

### Phase 1.3: Improved Prompts (Day 5-6)
- [ ] Enhance system prompt
- [ ] Add quantity detection ("2@", "3X")
- [ ] Improve category assignment
- [ ] Extract brand names
- [ ] Test with sample receipts
- [ ] Verify: Better accuracy

**Success:** 8/10 receipts process correctly

---

### Phase 1.4: Testing (Day 7)
- [ ] Create `src/test-suite.ts`
- [ ] Add 10 test receipts
- [ ] Run full test suite
- [ ] Document failure cases
- [ ] Tweak prompts

**Success:** Confident in receipt processing

**Deliverable:** Working CLI receipt processor

---

## Week 3: Database Layer

### Phase 2.1: Database Setup (Day 1-2)
- [ ] Install Drizzle: `npm install drizzle-orm @neondatabase/serverless`
- [ ] Create `src/db/schema.ts`
- [ ] Create `src/db/connection.ts`
- [ ] Create initial migration
- [ ] Run migration
- [ ] Verify: Tables created in Neon

**Success:** Database connected and ready

---

### Phase 2.2: Save Receipts (Day 3-4)
- [ ] Create `src/db/operations.ts`
- [ ] Implement `saveReceipt()`
- [ ] Implement `getReceipt()`
- [ ] Implement `listReceipts()`
- [ ] Test each function
- [ ] Verify: Data persists

**Success:** Can save and retrieve receipts

---

### Phase 2.3: CLI Tool (Day 5)
- [ ] Create `src/cli.ts`
- [ ] Add command-line arguments
- [ ] Process and save in one command
- [ ] Add `npm run process` script
- [ ] Test full workflow
- [ ] Verify: End-to-end works

**Success:** `npm run process receipt.jpg` saves to DB

**Deliverable:** Complete CLI tool

---

## Week 4: Web Interface

### Phase 3.1: Backend API (Day 1-3)
- [ ] Install Express: `npm install express multer cors`
- [ ] Create `src/api/server.ts`
- [ ] Create `src/api/routes.ts`
- [ ] Add CORS middleware
- [ ] Implement POST /api/receipts
- [ ] Implement GET /api/receipts
- [ ] Implement GET /api/receipts/:id
- [ ] Test with Postman
- [ ] Verify: API works

**Success:** API accessible at localhost:3000

---

### Phase 3.2: React Frontend (Day 4-7)
- [ ] Create React app: `npm create vite@latest client -- --template react-ts`
- [ ] Install dependencies: `npm install`
- [ ] Create `UploadZone.tsx`
- [ ] Create `ReceiptList.tsx`
- [ ] Create `App.tsx` layout
- [ ] Start dev server: `npm run dev`
- [ ] Test upload flow
- [ ] Verify: Can upload and see receipts

**Success:** Working web interface

**Deliverable:** Basic web app (simple but functional)

---

## Week 5: Features & Polish

### Phase 4.1: Better UI (Day 1-3)
- [ ] Add drag-and-drop (`react-dropzone`)
- [ ] Add loading states
- [ ] Add error messages
- [ ] Create receipt detail view
- [ ] Add basic CSS styling
- [ ] Verify: UI is usable

---

### Phase 4.2: Review & Edit (Day 4-5)
- [ ] Create edit modal
- [ ] Add PUT /api/receipts/:id endpoint
- [ ] Implement save changes
- [ ] Test editing flow
- [ ] Verify: Can fix AI mistakes

---

### Phase 4.3: Price History (Day 6-7)
- [ ] Update schema: add price_history table
- [ ] Run migration
- [ ] Save items to history on receipt save
- [ ] Create price query function
- [ ] Install recharts: `npm install recharts`
- [ ] Create price chart component
- [ ] Verify: Can see price trends

**Deliverable:** Polished, feature-complete app

---

## Week 6: Deployment

### Phase 5.1: Prepare (Day 1-2)
- [ ] Create production .env template
- [ ] Update package.json scripts
- [ ] Test production build
- [ ] Verify: Builds without errors

---

### Phase 5.2: Deploy Backend (Day 3)
- [ ] Choose platform (Railway recommended)
- [ ] Create account
- [ ] Connect GitHub repo
- [ ] Set environment variables
- [ ] Deploy
- [ ] Test API endpoints
- [ ] Verify: Backend accessible online

---

### Phase 5.3: Deploy Frontend (Day 4)
- [ ] Choose platform (Vercel recommended)
- [ ] Create account
- [ ] Connect GitHub repo
- [ ] Update API URL in frontend
- [ ] Deploy
- [ ] Verify: Frontend loads

---

### Phase 5.4: Integration (Day 5)
- [ ] Test full flow end-to-end
- [ ] Fix CORS if needed
- [ ] Test on mobile
- [ ] Share with friend
- [ ] Verify: Everything works

**Deliverable:** Deployed app with public URL 🎉

---

## Bonus: Optional Enhancements

After completing all phases, if you want more:

- [ ] Add user authentication
- [ ] Add data export (CSV)
- [ ] Add spending dashboard
- [ ] Add price alerts
- [ ] Add dark mode
- [ ] Add mobile app (React Native)
- [ ] Add bulk upload
- [ ] Add receipt email forwarding

---

## Learning Checkpoints

### After Phase 1:
- Do I understand async/await?
- Can I explain what base64 is?
- Do I know how to call an API?

### After Phase 2:
- Do I understand SQL JOINs?
- Can I explain what an ORM does?
- Do I know what migrations are?

### After Phase 3:
- Do I understand React components?
- Can I explain how state works?
- Do I know what REST APIs are?

### After Phase 4:
- Am I comfortable adding new features?
- Can I debug issues myself?
- Do I understand the data flow?

### After Phase 5:
- Can I deploy updates myself?
- Do I understand environment variables?
- Am I comfortable with the full stack?

---

## When to Ask for Help

**After 30 minutes stuck:**
- Provide exact error message
- Show what you tried
- Explain what you expected vs what happened

**Before starting a phase:**
- Review the plan
- Ask clarifying questions
- Verify prerequisites

**After completing a phase:**
- Share what you learned
- Ask for code review
- Get feedback on approach

---

## Notes Section

Use this space to track:
- Questions that came up
- "Aha moments"
- Things that were confusing
- Resources you found helpful
- Modifications you made

```
Date: _______
Phase: _______
Notes:




```

---

## Progress Tracking

**Week 1:** ___% complete
**Week 2:** ___% complete
**Week 3:** ___% complete
**Week 4:** ___% complete
**Week 5:** ___% complete
**Week 6:** ___% complete

**Estimated completion date:** _____________

**Actual completion date:** _____________

---

## Celebration Milestones 🎉

- [ ] First successful API call to Claude
- [ ] First receipt saved to database
- [ ] First time seeing my own UI
- [ ] First successful upload through web interface
- [ ] First deployment to production
- [ ] First time a friend uses my app
- [ ] First month of tracking receipts

Each of these deserves recognition - building software is hard!

---

## Resources Quick Reference

**Documentation:**
- PROJECT_SUMMARY.md - Start here
- ARCHITECTURE_INVENTORY.md - Reference
- FUNCTIONAL_REQUIREMENTS.md - Features
- REBUILD_PLAN.md - Detailed guide

**Official Docs:**
- TypeScript: typescriptlang.org
- React: react.dev
- Express: expressjs.com
- Drizzle ORM: orm.drizzle.team
- Claude API: docs.anthropic.com

**Tools:**
- Postman (API testing): postman.com
- TablePlus (DB viewer): tableplus.com
- GitHub Desktop: desktop.github.com

---

Ready to start? Check off "Install Node.js" and let's go! 🚀
