# Migrations: apps/mobile-old ➜ apps/mobile

Use this as the single source of truth for migrating features/screens/config from the archived legacy app (`apps/mobile-old`) to the new Expo app (`apps/mobile`). Check off items as soon as they are fully migrated and verified on Web (React Native Web) and device/simulator when relevant.

> Conventions
>
> - Verify on Web first (blank screen guard), then on iOS/Android as needed.
> - Keep React/ReactDOM versions aligned exactly with Expo SDK constraints.
> - When a change requires shared UI updates, rebuild `@todo/ui-mobile` and re-run dev.
> - Prefer colocated components under `apps/mobile/src/components` and hooks under `apps/mobile/src/hooks`.
> - Do not reintroduce custom Eva mappings unless explicitly needed.
> - For each item: include acceptance checks before marking done.

---

## 0. Baseline & Infrastructure

- [x] Archive legacy app to `apps/mobile-old`
- [x] Scaffold new Expo app in `apps/mobile` (SDK 54)
- [x] Align React/ReactDOM versions (exact match)
- [x] Configure monorepo-friendly Metro (watchFolders, resolver, RNW dedupe)
- [x] Handle inline-style-prefixer for RN Web under Metro web
- [x] Provider composition stable (SafeAreaProvider → EvaProvider → ThemeProvider → WalletProvider)
- [x] Verify Web bundling and rendering (no blank screen)
- [x] Add typecheck script and use frequently

Acceptance:

- Web loads at http://localhost:8083 with Home screen visible
- Metro console shows no red errors
- Typecheck passes for @todo/mobile

---

## 1. Design System & Theming

- [x] `useDesignTokens` hook wired to `@todo/ui-mobile`
- [x] EvaProvider exposed from `@todo/ui-mobile` with mapping disabled by default
- [x] Safe area + theme provider order stable
- [x] Dark mode support parity (if legacy had it)
- [x] Typography scale parity with legacy (sizes, weights)

Acceptance:

- Components read tokens for spacing/typography consistently
- Toggling dark mode (if present) updates colors without layout break

---

## 2. Navigation & Routes (expo-router v6)

- [x] `_layout.tsx` with providers + <Stack />
- [x] `app/index.tsx` Home screen rebuilt
- [x] Basic navigation to Todos and Wallet
- [x] Deep links (if used in legacy)
- [x] Route params and shared header styles parity

Acceptance:

- Home → Todos/Wallet navigates and back works on Web
- Any deep-link paths resolve to correct screens (if configured)

---

## 3. Wallet Flow

- [x] WalletProvider mock and `WalletConnect` UI
- [x] Wallet screen actions: connect/disconnect/switch network
- [x] ErrorBanner integrated for wallet errors
- [x] Snackbar feedback for sign/send
- [ ] Real wallet integration (if legacy had actual provider)
- [x] Network persistence across reloads

Acceptance:

- Switching networks updates UI state
- Errors show in banner format, transient actions show snackbar

---

## 4. Todos: State, Persistence, Filtering

- [x] Local store with CRUD/toggle and fetch via `@todo/services`
- [x] AsyncStorage hydrate and persist todos
- [x] Metadata support: priority, due date, tags
- [x] Filters toolbar: search/priority/status
- [x] Pull-to-refresh wired to `fetchTodos`
- [x] Bulk actions undo (actionable Undo in snackbar)
- [x] Tag suggestions (from existing tags) when typing
- [x] Due date picker (mobile-friendly) instead of free text
- [x] Validation and error states on form fields

Acceptance:

- Filtering narrows list as expected; #tag searches work
- Refresh repopulates from API without losing local metadata
- Undo restores previous list state for bulk actions

---

## 5. Todos: UI & UX polish

- [x] Todo list shows priority badge, due date, tag chips
- [x] Sync action visible only when wallet connected
- [x] Snackbar with icons for feedback
- [x] Empty states (no todos, no results for filters)
- [x] Loading skeletons instead of spinners (optional)
- [x] Swipe gestures (mobile) for quick actions (optional)
- [x] Accessibility pass: labels, hit targets, dynamic type

Acceptance:

- Empty states communicate next steps
- A11y basics: focus order, readable labels, minimum tappable areas

---

## 6. Integration with API/Blockchain

- [x] `mapWalletNetworkToBlockchainNetwork` used for sync action
- [x] Implement real `syncToBlockchain` in store via `@todo/services`
- [x] Error handling and retries for sync failures
- [x] Background sync or queue (optional)

Acceptance:

- Sync success/failure is reflected and persisted appropriately
- Errors surface via ErrorBanner/Snackbar

---

## 7. Shared Packages & Build

- [x] Use `@todo/ui-mobile` components across screens
- [x] Rebuild shared packages when changed
- [ ] Add Storybook (mobile) for shared components in this app (optional)
- [x] Document how to add new components to `@todo/ui-mobile`

Acceptance:

- Component changes in `@todo/ui-mobile` appear in mobile after rebuild
- Minimal process doc lives in packages/ui-mobile/README

---

## 8. Observability & Stability

- [x] Wire lightweight logging for key flows (wallet connect, sync)
- [x] Error boundaries at screen level (if RNW supports)
- [x] Performance sanity (avoid RNW duplication, large renders)

Acceptance:

- Logs show in dev console with sufficient context
- Errors don’t crash the entire app; banners show meaningful messages

---

## 9. Testing

- [x] Unit tests for store (CRUD, filters, bulk actions)
- [x] Component tests: TodoList
- [x] Component tests: TodoFilters
- [x] Component tests: TodoForm
- [x] Basic E2E smoke on web (Playwright) covering navigation and core actions

Acceptance:

- Tests pass in CI; capture regressions during future migrations
- Playwright E2E added for Expo Web: start Expo web automatically and verify Home → Todos → Wallet navigation via testIDs.
  - Run: pnpm --filter @todo/mobile test:e2e
  - Note: On cold caches, Expo startup may take longer; config timeouts are increased. If flakey, pre-start web with "pnpm --filter @todo/mobile web" before running E2E.

---

## 10. Cleanup / Parity Finalization

- [ ] Compare legacy screens for any missing micro-interactions
- [x] Remove unused legacy-only code paths
- [x] Final doc pass: update README for mobile app with dev/run tips

Acceptance:

- No references to legacy-only APIs
- README explains how to run, typecheck, and known gotchas (including stable E2E runner via `pnpm --filter @todo/mobile test:e2e:local` and pre-building shared packages, e.g. `pnpm --filter @todo/services build`)
