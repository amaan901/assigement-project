# DataCore Explorer — High-Throughput Ticket Intelligence

> Built for the Frontend Developer Assignment: **Problem Statement 1 (High-Performance Data Explorer)**.  
> A race-condition resilient, filterable, sortable explorer over a dataset of **12,500+ records**, featuring realistic server-side network simulation (random 200ms–3s latency, 10% failure rate), AbortController cancellation, URL state synchronization, and screen-reader accessibility.

---

## 🌟 Live Demo & Quick Start

- **Local URL**: `http://localhost:5173/`
- **Build Status**: Passing (10/10 targeted tests passing, 0 build warnings)
- **Deployment Ready**: Standard static bundle output to `/dist`, deployable to Vercel, Netlify, or Cloudflare Pages with zero environment variable configuration.

### How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Run the automated test suite (Vitest + Testing Library)
npm test

# 4. Build for production
npm run build
```

---

## 🚀 Key Features & Assignment Requirements Met

| Requirement | Implementation & Architectural Decision |
| :--- | :--- |
| **Large Dataset (10,000+ records)** | Generated deterministically in memory (12,500 customer support tickets) using seeded pseudo-random generator (`Mulberry32`) across realistic enterprise domains, SLA countdowns, priority weights, and tags. |
| **Mock API with Latency & Failures** | Server-side simulated API (`mockApi.ts`) with configurable latency (default: random 200ms–3000ms) and simulated HTTP 500 error on roughly 1 in 10 requests (`Math.random() < 0.1`). |
| **Never Show Stale Results** | Dual race-condition defense: (1) `AbortController` aborts previous in-flight requests on each filter/query change; (2) Monotonically increasing request sequence IDs discard any superseded responses that resolve late. |
| **Search Debouncing** | 300ms debounce window on text search with instant local input response (60 FPS) and spinner indicator while debouncing. |
| **Keep State in the URL** | Full two-way synchronization via `useUrlState`: query (`q`), `status`, `priority`, `category`, `sortBy`, `sortOrder`, `page`, `pageSize`, and `selected` detail drawer ID. Supports deep-linking and browser Back/Forward (`popstate`) navigation. |
| **Stay Fast with Large Lists** | Efficient table pagination (10, 25, 50, 100 rows per page), stable memoized row components, and fast DOM rendering without unnecessary re-renders. |
| **Honest State Handling** | Distinct loading states (animated skeleton shimmer), background fetch indicators, friendly empty states, and prominent error states that **clear old data** so stale results are never shown as current. Provides a 1-click "Retry Request" button. |
| **Deep-Linked Detail View** | Sliding detail drawer (`TicketDrawer`) with comprehensive ticket breakdown, customer info, SLA countdown, and "Copy Link" button. Can be closed via `Esc`, backdrop click, or close button without resetting scroll position or filters. |
| **Screen Reader & Keyboard Accessibility** | Semantic HTML5 structure (`<table>`, `<th>`, `<button>`), `aria-sort`, visible high-contrast focus rings, keyboard row navigation (`↑`/`↓`/`Enter`), shortcut `/` to search, and `LiveRegion` (`aria-live="polite"`) announcing result counts and errors to assistive technology. |
| **Interactive Network Simulator Toolbar** | Live dev toolbar providing immediate control over latency modes (Realistic 200ms–3s, Fast, Slow, Zero), failure rates (10%, 25%, 0%), and a **"Force 500 Error"** button to easily demonstrate error handling and retry mechanics during demos. |

---

## 🏛️ Architecture & State-Management Decisions

### 1. Avoiding Over-Engineering
Instead of pulling in heavyweight global state managers (such as Redux Toolkit or MobX) or heavy external mock servers requiring setup, the application relies on:
- **Clean React Hooks (`useUrlState`, `useTickets`, `useDebounce`)**: State lives directly where it belongs — in the URL as the single source of truth for query parameters, and in lightweight local hooks for UI state.
- **Native Web Standards**: Built-in `AbortController`, `DOMException('AbortError')`, `URLSearchParams`, and `window.history.pushState` / `popstate`.

### 2. Race-Condition Resolution Strategy
When users type rapidly or flip between filters on high-latency networks:
1. **Network Cancellation (`AbortController`)**: Each fetch invocation instantiates an `AbortController`. The previous controller is aborted immediately when new parameters are passed.
2. **Request Generation ID (`requestIdRef`)**: Network aborts can occasionally resolve right before cancellation registers in certain browser engines. To ensure total safety, each request gets an incrementing ID. If `currentRequestId !== latestRequestIdRef.current`, the response is silently dropped.

### 3. Honest Error Handling
Many modern dashboards retain stale data on failure and display an obscure toast, leading users to believe the displayed table reflects their latest query. 
In accordance with the assignment specifications:
- When a simulated 500 failure occurs, data is cleared to prevent misleading displays.
- The UI renders an honest `ErrorState` card with the exact error message and an action button to `Retry Request`.

---

## 🧪 Automated Test Suite

Targeted Vitest + React Testing Library tests in `src/__tests__/`:

1. **`raceCondition.test.ts`**:
   - Asserts that when Request 1 is slow (e.g. 2500ms) and Request 2 is fast (100ms), Request 1 is aborted and never overwrites Request 2's data.
   - Asserts that `AbortSignal.aborted` transitions to `true` on the prior request.
2. **`debounce.test.ts`**:
   - Verifies that rapid typing updates local text immediately but debounces API parameter updates until the 300ms timer elapses.
3. **`errorState.test.ts`**:
   - Verifies that a server 500 error displays an honest error message, clears stale data, and successfully recovers data upon clicking `Retry`.
4. **`urlSync.test.ts`**:
   - Verifies URL query hydration (e.g. `?q=auth&status=Open&page=3&selected=TCK-10492`), parameter serialization, and `popstate` browser back/forward restoration.
5. **`accessibility.test.tsx`**:
   - Verifies `LiveRegion` announcements (`aria-live="polite"`) for result counts and errors, plus `aria-sort` headers on sortable table columns.

Run all tests via:
```bash
npm test
```

---

## ⚖️ Tradeoffs & Considerations

1. **In-Memory Simulated Mock API vs. External Mock Service Worker (MSW)**:
   - *Decision*: Implemented a zero-dependency in-memory simulated API layer with real `AbortSignal` listeners and random latency/failure injectors.
   - *Tradeoff*: Avoided MSW service worker registration quirks across local iframe previews and static hosting providers, guaranteeing zero-configuration deployment on Vercel/Netlify.
2. **Virtualization vs. Server-Side Pagination**:
   - *Decision*: Implemented fast server-side pagination with rows-per-page options (10, 25, 50, 100) and lightweight memoized row rendering.
   - *Tradeoff*: Server-side pagination is the standard industry pattern for datasets exceeding 10,000 records, reducing DOM footprint while keeping URLs shareable and scroll positions clean.
3. **Vanilla CSS Tokens vs. Utility Frameworks**:
   - *Decision*: Crafted CSS custom properties in `src/index.css` following dark-mode glassmorphic aesthetics.
   - *Tradeoff*: Kept bundle size under 285KB total without Tailwind compilation overhead.

---

## 📚 Sources & References

- [MDN Web Docs: AbortController & AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [MDN Web Docs: Synchronizing state with URLSearchParams and History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)
- [WAI-ARIA Authoring Practices Guide (APG): Table and Live Regions](https://www.w3.org/WAI/ARIA/apg/patterns/table/)
- [Vitest & React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Lucide Icons](https://lucide.dev/)

---

## 🤖 AI Usage Disclosure

In compliance with assignment requirement #6:
- **AI Tool Used**: Antigravity AI Assistant (powered by DeepMind / Gemini).
- **Assistance Scope**: Architectural scaffolding, deterministic dataset generator synthesis, CSS design tokens, and comprehensive Vitest test case structuring for race conditions and accessibility.
- **Human Verification**: Review of code structure, TypeScript typing adherence, Vitest test execution, and production build validation.
