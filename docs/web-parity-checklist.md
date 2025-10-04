# Web App Parity Checklist

## Feature Parity Tasks

- [x] Audit `apps/web/src/store/todoStore.ts` to ensure todos expose blockchain metadata (`transactionHash`, `blockchainAddress`, `blockchainNetwork`) consistent with mobile store.
- [x] Implement search + priority/status filters in `apps/web/src/app/todos/page.tsx` mirroring `apps/mobile/src/components/TodoFilters.tsx`.
- [x] Add bulk actions (mark all done, clear completed, undo) to the web UI similar to `apps/mobile/src/components/TodoBulkActions.tsx`.
- [x] Ensure empty state messaging and refresh controls match mobile behavior in `TodoList` and surrounding layout.
- [ ] Provide modal/dialog flow for creating and editing todos with parity to mobile `TodoForm` UX.
- [ ] Integrate snackbar/toast feedback for blockchain sync, errors, and undo actions as in mobile `Snackbar.tsx` usage.
- [ ] Add wallet warning card UI to `apps/web/src/app/todos/page.tsx` with theme-aware styling similar to mobile.
- [ ] Implement floating action button equivalent for quick todo creation in desktop/tablet view.
- [ ] Ensure blockchain sync quick actions offer network selection parity with mobile `BlockchainStats` + `TodoList` integration.

## UI Component Gaps (`packages/ui-web/`)

- [ ] Create reusable filter group component analogous to `@todo/ui-mobile` `ButtonGroup` for segmented controls.
- [ ] Implement snackbar/toast component in `@todo/ui-web` mirroring mobile snackbar API.
- [ ] Ensure card, button, and typography variants in `@todo/ui-web` provide styling hooks used by mobile components (accent colors, destructive variants, etc.).
- [ ] Add `NetworkSelector` component to `packages/ui-web/lib` to support multi-network selection like mobile.
- [ ] Verify `BlockchainStats` component exists in `@todo/ui-web`; port mobile analytics layout if missing.

## Wallet Experience

- [ ] Align wallet connection status UI and actions (`connect`, `disconnect`, `switchNetwork`) between `apps/web/src/app/wallet/page.tsx` and mobile.
- [ ] Replace alert-based feedback with styled components/snackbar in wallet page.
- [ ] Ensure wallet page lists supported networks dynamically using shared data instead of hardcoded list.

## Theme & Accessibility

- [ ] Confirm dark mode/theme tokens apply to all new components and pages (use `@todo/ui-web` theme utilities).
- [ ] Add appropriate aria-labels and focus states for new controls (filters, bulk actions, FAB).
- [ ] Sync typography and spacing scales to match design tokens (`useDesignTokens` equivalent for web).

## Testing & Quality

- [ ] Add unit tests for new web filters, bulk actions, and snackbar components.
- [ ] Extend integration/E2E tests to cover web parity flows (create, edit, filter, bulk actions, blockchain sync).
- [ ] Update documentation/Storybook in `packages/ui-web/` for any new shared components created.
