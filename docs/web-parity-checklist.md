# Web App Parity Checklist

## Feature Parity Tasks

- [x] Audit `apps/web/src/store/todoStore.ts` to ensure todos expose blockchain metadata (`transactionHash`, `blockchainAddress`, `blockchainNetwork`) consistent with mobile store.
- [x] Implement search + priority/status filters in `apps/web/src/app/todos/page.tsx` mirroring `apps/mobile/src/components/TodoFilters.tsx`.
- [x] Add bulk actions (mark all done, clear completed, undo) to the web UI similar to `apps/mobile/src/components/TodoBulkActions.tsx`.
- [x] Ensure empty state messaging and refresh controls match mobile behavior in `TodoList` and surrounding layout.
- [x] Provide modal/dialog flow for creating and editing todos with parity to mobile `TodoForm` UX.
- [x] Integrate snackbar/toast feedback for blockchain sync, errors, and undo actions as in mobile `Snackbar.tsx` usage.
- [x] Add wallet warning card UI to `apps/web/src/app/todos/page.tsx` with theme-aware styling similar to mobile.
- [x] Implement floating action button equivalent for quick todo creation in desktop/tablet view.
- [x] Ensure blockchain sync quick actions offer network selection parity with mobile `BlockchainStats` + `TodoList` integration.

## UI Component Gaps (`packages/ui-web/`)

- [x] Create reusable filter group component analogous to `@todo/ui-mobile` `ButtonGroup` for segmented controls.
- [x] Implement snackbar/toast component in `@todo/ui-web` mirroring mobile snackbar API.
- [x] Ensure card, button, and typography variants in `@todo/ui-web` provide styling hooks used by mobile components (accent colors, destructive variants, etc.).
- [x] Add `NetworkSelector` component to `packages/ui-web/lib` to support multi-network selection like mobile.
- [x] Verify `BlockchainStats` component exists in `@todo/ui-web`; port mobile analytics layout if missing.

## Wallet Experience

- [x] Align wallet connection status UI and actions (`connect`, `disconnect`, `switchNetwork`) between `apps/web/src/app/wallet/page.tsx` and mobile.
- [x] Replace alert-based feedback with styled components/snackbar in wallet page.
- [x] Ensure wallet page lists supported networks dynamically using shared data instead of hardcoded list.

## Theme & Accessibility

- [x] Confirm dark mode/theme tokens apply to all new components and pages (use `@todo/ui-web` theme utilities).
- [x] Add appropriate aria-labels and focus states for new controls (filters, bulk actions, FAB).
- [x] Sync typography and spacing scales to match design tokens (`useDesignTokens` equivalent for web).

## Testing & Quality

- [x] Add unit tests for new web filters, bulk actions, and snackbar components.
- [x] Extend integration/E2E tests to cover web parity flows (create, edit, filter, bulk actions, blockchain sync).
- [x] Update documentation/Storybook in `packages/ui-web/` for any new shared components created.
