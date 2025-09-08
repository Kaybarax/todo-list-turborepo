# @todo/ui-mobile Remediation Execution Plan (Actionable To‑Do)

Date: 2025-09-08 (Reordered for dependency-first execution)

Purpose: Provide a strictly ordered, dependency-aware checklist to bring every component in `packages/ui-mobile/lib/components` into compliance with `DEVELOPMENT_GUIDELINES.md` and `DEVELOPMENT.md`.

Legend (suffix tags): [T]=Typing [A]=Architecture [S]=Styling [A11Y]=Accessibility [P]=Performance [TEST]=Testing [DOC]=Docs/Storybook.

Status Marking: Convert `- [ ]` to `- [x]` as tasks complete. Keep sections; do not renumber IDs after creation.

---

## Phase 0 – Tooling / Safety Nets (no code refactors should start before these)

Rationale: Establish lint, test, and utility foundation so subsequent PRs are smaller and consistent.

- [x] P0-1 (TEST) Create unified render helper: add `src/test/utils/renderWithProvider.tsx`; update existing tests replacing inline `ThemeProvider` wrappers.
  - Files: create `src/test/utils/renderWithProvider.tsx`; modify all files in `packages/ui-mobile/__tests__/*.test.(ts|tsx)` (search for `renderWithTheme`).
  - Success: All tests import from `src/test/utils/renderWithProvider`.
- [x] P0-2 (T/Lint) Add ESLint rule for banning `style?: any` (edit `packages/ui-mobile/eslint.config.js`).
  - Files: modify eslint config; add override using `@typescript-eslint/no-explicit-any` for component files (lib/components).
  - Success: Running lint flags existing occurrences (expected failures before fixes).
- [x] P0-3 (TEST/Meta) Validate coverage thresholds in `jest.config.cjs` (already 80%) & add short "Coverage" paragraph to `DEVELOPMENT_GUIDELINES_COMPLIANCE.md`.
  - Files: edit `packages/ui-mobile/DEVELOPMENT_GUIDELINES_COMPLIANCE.md` (section Coverage).
- [x] P0-4 (DOC) Insert "Custom Implementations Rationale" section in `DEVELOPMENT.md` (Modal, TabBar, Header, (maybe) ListItem) + note potential deprecation for ListItem.
  - Files: edit root or package `DEVELOPMENT.md` (choose existing central doc).

## Phase 1 – Core Shared Utilities & Hooks

Rationale: Refactors depend on these shared resources (avoid rework).

- [x] P1-1 (A/T) Introduce component mapping util.
  - Files: create `lib/utils/componentMappings.ts` (variant/status/size maps); modify `Button/Button.tsx`, `Input/Input.tsx`, `Text/Text.tsx`, `Card/Card.tsx` (if variant logic), `TabBar/TabBar.tsx` to consume util; add `__tests__/componentMappings.test.ts`.
  - Remove local switch statements.
- [x] P1-2 (A11Y/P) Add reduced motion hook.
  - Files: create `lib/hooks/useReducedMotion.ts`; modify `Modal/Modal.tsx`, `TabBar/TabBar.tsx` to branch on hook; add `__tests__/useReducedMotion.test.ts`.
- [x] P1-3 (S) Create shared shadows util.
  - Files: create `lib/theme/shadows.ts`; modify `Card/Card.tsx`, `Header/Header.tsx`, `TabBar/TabBar.tsx`, `Modal/Modal.tsx` (if inline shadow); add `__tests__/shadows.test.ts`.
- [x] P1-4 (DOC) Performance memoization snippet.
  - Files: edit `DEVELOPMENT_GUIDELINES_COMPLIANCE.md` add "Performance Patterns" referencing memo and reduced motion.

## Phase 2 – Storybook Infrastructure

- [ ] P2-1 (DOC) Add decorator: `src/stories/decorators/UIKittenProvider.tsx`; refactor all stories to remove inline providers.
- [ ] P2-2 (DOC) Add shared story meta helper `src/stories/helpers/storyMeta.ts` exporting common `argTypes`, `decorators`.
- [ ] P2-3 (DOC) Story audit: verify or create stories for: Avatar, Badge, Button, Card, Checkbox, FormField, Header, Icon, Input, ListItem (or Deprecation), Modal, NetworkSelector, Switch, TabBar, Text.
  - For deprecated ListItem, create `ListItem.deprecated.stories.tsx` with banner.
- [ ] P2-4 (DOC/A11Y) Enable `@storybook/addon-a11y` (edit `.storybook/main.ts`) & add CI workflow (e.g. `.github/workflows/storybook.yml`).
- [ ] P2-5 (DOC/Visual) Add Chromatic (or equivalent) visual regression: add `chromatic` script in package.json, configure project token in CI.

## Phase 3 – Component Foundational Refactors (Typing + A11y + Required Styling) (All P1 per component)

These may be executed in parallel per component once Phases 0–2 are complete; each bullet is self-contained.

### Button

- [ ] BTN-1 (T) Extend from `ButtonProps` of UI Kitten: modify `lib/components/Button/Button.tsx` to `export interface ButtonProps extends Omit<UIKittenButtonProps,'appearance'|'status'|'children'> { ... }`.
- [ ] BTN-2 (A) Consolidate loading path: remove duplicate inline spinner; use a single `accessoryLeft` or `accessoryRight` path.
- [ ] BTN-3 (A11Y) Add fallback `accessibilityLabel` if children is string or set from variant.
- [ ] BTN-4 (S) Replace link variant hardcoded styles with theme tokens; move style constants to `StyleSheet`.
- [ ] BTN-5 (TEST) Update affected tests (`__tests__/Button*.test.tsx`).

### Input

- [ ] INP-1 (T) Extend `Input` from UI Kitten props: modify `lib/components/Input/Input.tsx`.
- [ ] INP-2 (A11Y) Fallback label: placeholder -> value -> 'input field'.
- [ ] INP-3 (S) Replace RGBA background with theme token (`evaTheme*`).
- [ ] INP-4 (TEST) Update `__tests__/Input.test.tsx` for fallback label logic.

### Text

- [ ] TXT-1 (T) Extend `UIKittenTextProps` & retain variant mapping.
- [ ] TXT-2 (T) Replace `style?: any` with `StyleProp<TextStyle>`.
- [ ] TXT-3 (TEST) Add/Update `__tests__/Text.test.tsx` verifying mapping.

### Card

- [ ] CRD-1 (T) Extend `UIKittenCardProps` in `Card/Card.tsx`.
- [ ] CRD-2 (S) Extract static styles to `StyleSheet.create`.
- [ ] CRD-3 (S) Apply shared shadows util.

### Header

- [ ] HDR-1 (A11Y) Add `accessibilityRole="header"`.
- [ ] HDR-2 (S) Replace inline shadows with util.
- [ ] HDR-3 (DOC) Add rationale entry (why custom vs `TopNavigation`).

### ListItem

- [ ] LIT-1 (A/DOC) Decide: deprecate or extend. If deprecating, add deprecation note + story; else extend UI Kitten props.
- [ ] LIT-2 (T) (If kept) Extend underlying props.
- [ ] LIT-3 (A11Y) Add role/labels for pressable vs non-pressable.

### Modal

- [ ] MOD-1 (DOC) Add rationale (animation/focus management) in `DEVELOPMENT.md`.
- [ ] MOD-2 (TEST) Ensure existing tests adapt to reduced motion hook (phase 1 addition) & remove magic `setTimeout(300)` by using callback or config constant.
- [ ] MOD-3 (A) Replace timeout with animation completion.

### TabBar

- [ ] TBR-1 (A) Remove duplicate effect.
- [ ] TBR-2 (A11Y/P) Integrate reduced motion branch.
- [ ] TBR-3 (S) Apply shadows util & extract static styles.

### NetworkSelector

- [ ] NET-1 (T) Replace `style?: any` with `StyleProp<ViewStyle>`.
- [ ] NET-2 (A11Y) Composite label `${name}. ${description}`.

### Badge

- [ ] BDG-1 (A11Y) Add role + fallback label.
- [ ] BDG-2 (A/T) Move variant->color logic to mapping util if applicable; or new file `lib/utils/badgeMapping.ts`.

### Avatar

- [ ] AVT-1 (P) Wrap in `React.memo`.
- [ ] AVT-2 (P) Memoize derived style objects.
- [ ] AVT-3 (A11Y) Add fallback `accessibilityLabel` (initials or “avatar”).

### Icon

- [ ] ICN-1 (T) Extend UI Kitten icon props.
- [ ] ICN-2 (P) Wrap in `React.memo`.
- [ ] ICN-3 (S) Extract base style constants & safe style merging.

### Switch

- [ ] SWT-1 (A11Y) Add label fallback (if `label` prop exists externally).

### FormField

- [ ] FFD-1 (TEST) Add `FormField.test.tsx` covering label / hint / error precedence.
- [ ] FFD-2 (A11Y) Link error/hint via IDs or doc note; add `accessibilityHint` passthrough.

## Phase 4 – Immediate Test & Story Updates (Ensure coverage & docs after refactors)

- [ ] P4-1 (TEST) Update / create missing component tests: Avatar, Badge, Icon, ListItem (if kept), Text, FormField, NetworkSelector (selection states), Modal reduced motion branch, TabBar reduced motion branch.
- [ ] P4-2 (DOC) Add/verify Storybook stories created/updated: ensure each story uses decorator + meta helper; add deprecation banner for ListItem if deprecated.
- [ ] P4-3 (TEST) Add reduced motion specific cases in `Modal.test.tsx` & `TabBar.test.tsx` (mock hook to true).

## Phase 5 – Performance & Styling Enhancements (P2)

- [ ] P5-1 (P) Memoize heavy or repeated mapping logic across Button, Badge, Avatar if profiling indicates re-renders (optional measurements).
- [ ] P5-2 (S) Replace any remaining inline style objects (scan `lib/components/**/` for `style={{`).
- [ ] P5-3 (DOC) Update performance doc snippet with concrete examples (before/after diff of memoization) in compliance doc.

## Phase 6 – Nice-to-Have / Polish (P3)

- [ ] P6-1 (DOC) Add Playwright e2e harness: `e2e/playwright.config.ts`, `e2e/button.spec.ts`, `e2e/modal.spec.ts` + npm script `test:e2e`.
- [ ] P6-2 (A11Y) Modal described-by hidden summary (optional, platform support caveat).
- [ ] P6-3 (A) Explore refactor of Header to wrap `TopNavigation` (spike doc / issue link).
- [ ] P6-4 (P) Final pass: ensure memoization applied only where net benefit (remove unnecessary React.memo wrappers if prop churn high).

## File Creation / Modification Summary (Quick Reference)

| Action          | Path Examples                                                                                                                                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Create          | `lib/utils/componentMappings.ts`, `lib/hooks/useReducedMotion.ts`, `lib/theme/shadows.ts`, `src/test/utils/renderWithProvider.tsx`, `src/stories/decorators/UIKittenProvider.tsx`, `src/stories/helpers/storyMeta.ts`, `e2e/*` |
| Modify          | Component files under `lib/components/**`, `eslint.config.js`, `jest.config.cjs`, all story files `src/stories/*.stories.tsx`, tests in `__tests__/*.test.tsx`, `DEVELOPMENT.md`, compliance doc                               |
| Optional Create | `lib/utils/badgeMapping.ts` (if Badge mapping not folded into main util)                                                                                                                                                       |
| Possible Delete | Deprecate (don’t delete yet) `ListItem` if replaced by UI Kitten base; schedule removal after one minor version with CHANGELOG note                                                                                            |

## Acceptance / Done Definition

- All Phase 0 & 1 tasks completed before merging majority of Phase 3 PRs (enforced via PR checklist).
- No remaining `any` styles (`git grep "style?: any"` returns empty) before closing Phase 3.
- Coverage thresholds hold ≥80% post Phase 4; no net drop in branches for touched files.
- Every component has an up-to-date Storybook story (or explicit deprecation).
- Reduced motion branch validated (tests pass with mocked `useReducedMotion` true/false).
- Visual regression snapshots updated & stable (Chromatic / chosen tool).

## Suggested PR Batching Strategy

1. PR 1: Phase 0 (lint rule, test util, rationale doc, coverage doc update).
2. PR 2: Phase 1 utilities (mappings, hook, shadows) + tests.
3. PR 3: Storybook infra (decorator + meta helper + story audit baseline snapshots).
4. PR 4+: Component refactors grouped (Button/Input/Text) then Card/Header/ListItem, then Modal/TabBar, then remaining (Avatar/Badge/Icon/NetworkSelector/FormField/Switch).
5. PR N: Performance + polish (remove unused code, optional deprecation follow-up).

## Tracking Table (Optional – Fill During Execution)

| ID    | Task           | Owner | PR  | Status |
| ----- | -------------- | ----- | --- | ------ |
| P0-1  | Render helper  |       |     |        |
| P0-2  | ESLint rule    |       |     |        |
| P1-1  | Mapping util   |       |     |        |
| P1-2  | Reduced motion |       |     |        |
| P1-3  | Shadows util   |       |     |        |
| BTN-1 | Button typing  |       |     |        |
| INP-1 | Input typing   |       |     |        |
| TXT-1 | Text typing    |       |     |        |
| ...   | ...            |       |     |        |

---

## Appendix A – Original Detailed Tables

The original per-component and global task tables have been removed for brevity; all content has been incorporated into the phased actionable checklist above.

If you need the legacy table view, retrieve it from version control history (previous commit of `DEVELOPMENT_GUIDELINES_REMEDIATION_TASKS.md`).

---

Generated automatically (actionable edition). Update checkboxes as work progresses.
