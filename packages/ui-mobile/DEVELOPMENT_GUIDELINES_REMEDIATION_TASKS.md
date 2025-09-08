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

- [x] P2-1 (DOC) Add decorator: `src/stories/decorators/UIKittenProvider.tsx`; refactor all stories to remove inline providers.
- [x] P2-2 (DOC) Add shared story meta helper `src/stories/helpers/storyMeta.ts` exporting common `argTypes`, `decorators`.
- [x] P2-3 (DOC) Story audit: verify or create stories for: Avatar, Badge, Button, Card, Checkbox, FormField, Header, Icon, Input, ListItem (or Deprecation), Modal, NetworkSelector, Switch, TabBar, Text.
  - For deprecated ListItem, create `ListItem.deprecated.stories.tsx` with banner.
- [x] P2-4 (DOC/A11Y) Enable `@storybook/addon-a11y` (edit `.storybook/main.ts`) & add CI workflow (e.g. `.github/workflows/storybook.yml`).
- [x] P2-5 (DOC/Visual) Add Chromatic (or equivalent) visual regression: add `chromatic` script in package.json, configure project token in CI.

## Phase 3 – Component Foundational Refactors (Typing + A11y + Required Styling) (All P1 per component)

These may be executed in parallel per component once Phases 0–2 are complete; each bullet is self-contained.

### Button

- [x] BTN-1 (T) Compose props from UI Kitten; centralize variant/size mapping (completed).
- [x] BTN-2 (A) Consolidated loading path (single accessoryLeft logic).
- [x] BTN-3 (A11Y) Added fallback accessibilityLabel (children text or `${variant} button`).
- [x] BTN-4 (S) Link variant styling consolidated & theme-aware fallback applied.
- [x] BTN-5 (TEST) Tests compatible (loading indicator path unified, accessibility label fallback added).

### Input

- [x] INP-1 (T) Extend `Input` from UI Kitten props: modify `lib/components/Input/Input.tsx`.
- [x] INP-2 (A11Y) Fallback label: placeholder -> value -> 'input field'.
- [x] INP-3 (S) Replace RGBA background with theme token (`evaTheme*`).
- [x] INP-4 (TEST) Update `__tests__/Input.test.tsx` for fallback label logic.

### Text

- [x] TXT-1 (T) Extend `UIKittenTextProps` & retain variant mapping.
- [x] TXT-2 (T) Replace `style?: any` with `StyleProp<TextStyle>`.
- [x] TXT-3 (TEST) Add/Update `__tests__/Text.test.tsx` verifying mapping.

### Card

- [x] CRD-1 (T) Extend `UIKittenCardProps` in `Card/Card.tsx`.
- [x] CRD-2 (S) Extract static styles to `StyleSheet.create`.
- [x] CRD-3 (S) Apply shared shadows util.

### Header

- [x] HDR-1 (A11Y) Add `accessibilityRole="header"`.
- [x] HDR-2 (S) Replace inline shadows with util.
- [x] HDR-3 (DOC) Add rationale entry (why custom vs `TopNavigation`).

### ListItem (Decision: Extend UI Kitten)

- [x] LIT-1 (A/DOC) Decision recorded: extend component rather than deprecate.
- [x] LIT-2 (T) Extend underlying UI Kitten `ListItemProps` + typing cleanup.
- [x] LIT-3 (A11Y) Fallback accessibilityLabel (title -> subtitle -> description -> "list item"); ensure role differences.

### Modal

- [x] MOD-1 (DOC) Add rationale (animation/focus management) in `DEVELOPMENT.md`.
- [x] MOD-2 (TEST) Ensure existing tests adapt to reduced motion hook (phase 1 addition) & remove magic `setTimeout(300)` by using callback or config constant.
- [x] MOD-3 (A) Replace timeout with animation completion.

### TabBar

- [x] TBR-1 (A) Remove duplicate effect.
- [x] TBR-2 (A11Y/P) Integrate reduced motion branch.
- [x] TBR-3 (S) Apply shadows util & extract static styles.

### NetworkSelector

- [x] NET-1 (T) Replace `style?: any` with `StyleProp<ViewStyle>`.
- [x] NET-2 (A11Y) Composite label `${name}. ${description}`.

### Badge

- [x] BDG-1 (A11Y) Add role + fallback label.
- [x] BDG-2 (A/T) Move variant->color logic to mapping util if applicable; or new file `lib/utils/badgeMapping.ts`.

### Avatar

- [x] AVT-1 (P) Wrap in `React.memo`.
- [x] AVT-2 (P) Memoize derived style objects.
- [x] AVT-3 (A11Y) Add fallback `accessibilityLabel` (initials or “avatar”).

### Icon

- [x] ICN-1 (T) Extend UI Kitten icon props.
- [x] ICN-2 (P) Wrap in `React.memo`.
- [x] ICN-3 (S) Extract base style constants & safe style merging.

### Switch

- [x] SWT-1 (A11Y) Add label fallback (if `label` prop exists externally).

### FormField

- [x] FFD-1 (TEST) Add `FormField.test.tsx` covering label / hint / error precedence.
- [x] FFD-2 (A11Y) Link error/hint via IDs or doc note; add `accessibilityHint` passthrough.

## Phase 4 – Immediate Test & Story Updates (Ensure coverage & docs after refactors)

- [x] P4-1 (TEST) Update / create missing component tests: Avatar, Badge, Icon, ListItem (if kept), Text, FormField, NetworkSelector (selection states), Modal reduced motion branch, TabBar reduced motion branch.
  - Progress: Added ListItem tests (pressable/disabled/size/a11y), NetworkSelector dynamic selection tests (grid & list), deep reduced motion assertions for TabBar and Modal (via diagnostic `onAnimationValues`).
- [x] P4-2 (DOC) Add/verify Storybook stories created/updated: ensure each story uses decorator + meta helper; add deprecation banner for ListItem if deprecated.
- [x] P4-3 (TEST) Add reduced motion specific cases in `Modal.test.tsx` & `TabBar.test.tsx` (mock hook to true).
  - Completed: Added Modal open/close immediate animation snapshot assertions via `onAnimationValues`; TabBar instant indicator position test under reduced motion.
- [x] P4-4 (DOC/Lint) Decide interim strategy for Storybook inline-style lint noise (override rules in story globs; document rationale in `STORYBOOK_GUIDELINES.md`).

## Phase 5 – Performance & Styling Enhancements (P2)

- [x] P5-1 (P) Memoize heavy or repeated mapping logic across Button, Badge, Avatar if profiling indicates re-renders (optional measurements).
  - Baseline mapping micro-benchmark (800 iterations) recorded sub-microsecond medians (Button 0.000166ms, Badge 0.000250ms, Avatar 0.000166ms, Text 0.000125ms) with P95 << 0.001ms.
  - Conclusion: Existing object lookup + small switch logic is effectively free; additional memoization layers would add overhead and complexity without measurable gain.
  - Action: No further memoization added beyond existing React.memo / useMemo already present (Avatar, Badge). Documentation to reflect rationale in performance section.
- [x] P5-2 (S) Replace any remaining inline style objects (scan `lib/components/**/` for `style={{`).
  - Refactored inline objects in `NetworkSelector` (list & grid variants) and `Modal` (flex containers) to static StyleSheet/const entries.
  - Residual dynamic theme-based objects retained only where values depend on runtime tokens (background, border colors, spacing) and are composed minimally.
- [x] P5-3 (DOC) Update performance doc snippet with concrete examples (before/after diff of memoization) in compliance doc.
  - Added "Phase 5 (P5-3) Concrete Example" subsection to `DEVELOPMENT_GUIDELINES_COMPLIANCE.md` illustrating:
    1. Why additional memoization was skipped (mapping cost << 1 microsecond; memo layer would add comparison + object allocation overhead > work avoided).
    2. Styling extraction example showing before vs after for `NetworkSelector` inline style objects becoming static `StyleSheet` entries (reduces per-render allocations, improves diffing & RN dev tooling symbolication).
  - Example (excerpt) used in doc:
    **Before** (inline allocation each render)

    ```ts
    <View style={{ padding: 12, borderRadius: 8, backgroundColor: selected ? theme.colors.primary : theme.colors.card }} />
    ```

    **After** (static + minimal dynamic merge)

    ```ts
    const styles = StyleSheet.create({
      item: { padding: 12, borderRadius: 8 },
      itemSelected: { backgroundColor: theme.colors.primary },
      itemBase: { backgroundColor: theme.colors.card },
    });
    <View style={[styles.item, selected ? styles.itemSelected : styles.itemBase]} />
    ```

  - Outcome: Documentation now contains concrete guidance + a decision record explaining why "opt out" of premature memoization is compliant.

## Phase 6 – Nice-to-Have / Polish (P3)

- [x] P6-1 (DOC) Add Playwright e2e harness: `e2e/playwright.config.ts`, `e2e/button.spec.ts`, `e2e/modal.spec.ts` + npm script `test:e2e`.
  - Added base config + two smoke specs (button primary story label; modal open action). Specs skip gracefully if Storybook not running.
- [x] P6-2 (A11Y) Modal described-by hidden summary (optional, platform support caveat).
  - Introduced `accessibilityDescription` prop in `Modal` rendering visually hidden caption text for assistive tech only.
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
