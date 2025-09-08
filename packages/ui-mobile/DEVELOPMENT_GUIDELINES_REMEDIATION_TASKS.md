# @todo/ui-mobile Component Remediation Task Plan

Date: 2025-09-08

Purpose: Actionable tasks to bring all `lib/components` into compliance with `DEVELOPMENT_GUIDELINES.md` and `DEVELOPMENT.md` (architecture, typing, accessibility, performance, testing, stories, styling, rationale).

## Legend

- P1 = High priority (foundational correctness / DX / a11y)
- P2 = Medium (performance, maintainability)
- P3 = Nice-to-have / polish
- (A) = Architecture
- (T) = Typing
- (S) = Styling
- (A11Y) = Accessibility
- (P) = Performance
- (TEST) = Testing
- (DOC) = Documentation / Storybook / Rationale

---

## Global / Cross-Cutting Tasks

| ID   | Priority | Task                                                                                                                 | Acceptance Criteria                                                             |
| ---- | -------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| G-1  | P1       | Introduce shared helper for mapping size/variant/status across Button/Input/etc.                                     | Reused util, unit tests added, removes duplicate switches                       |
| G-2  | P1       | Add `Custom Implementations Rationale` section to `DEVELOPMENT.md`                                                   | Section lists Modal, TabBar, Header, ListItem justification or deprecation note |
| G-3  | P1       | Establish `useReducedMotion()` (stub) and honor in animated components (Modal, TabBar)                               | Hook implemented; animation branches covered by tests                           |
| G-4  | P2       | Create `storybook/decorators/UIKittenProvider.tsx` to DRY provider setup                                             | All new stories import and use decorator                                        |
| G-5  | P2       | Create ESLint rule override to flag `style?: any` in components                                                      | Lint fails on `style?: any` until fixed                                         |
| G-6  | P2       | Centralize platform shadow style in `theme/shadows.ts`                                                               | Components import & remove inline duplication                                   |
| G-7  | P3       | Add performance doc snippet for memoization patterns                                                                 | Doc section present & referenced                                                |
| G-8  | P1       | Add unified test utilities (`test/utils/renderWithProvider.tsx`) for consistent theming/a11y queries                 | All new/updated tests import helper; duplicated provider code removed           |
| G-9  | P1       | Establish coverage thresholds in Jest config (eg: 80/80/80/80)                                                       | CI fails if thresholds not met; documentation updated                           |
| G-10 | P1       | Storybook audit: create stories for components lacking one (Avatar, Badge, Checkbox, FormField, Icon, Modal, Switch) | Stories present & appear in navigation                                          |
| G-11 | P2       | Add Storybook docs/controls standard (args: size, status, disabled, variant) via common meta helper                  | New stories consume helper; argTypes centralized                                |
| G-12 | P2       | Integrate a11y addon & automated accessibility check step in CI for all stories                                      | CI job reports violations; baseline documented                                  |
| G-13 | P2       | Visual regression (Chromatic or equivalent) extended to new stories                                                  | New stories have baseline snapshots                                             |
| G-14 | P2       | Add test cases for reduced motion branches (Modal, TabBar) using mocked hook                                         | Tests assert animation skipped when reduced motion true                         |
| G-15 | P3       | Add playwright (or RN specific e2e) smoke for a representative interactive story (Button, Modal)                     | E2E passes; flakes <5% over 5 runs                                              |

---

## Avatar

| Task                                            | Priority | Category | Details / Steps                                                     | Acceptance Criteria                                    |
| ----------------------------------------------- | -------- | -------- | ------------------------------------------------------------------- | ------------------------------------------------------ |
| Wrap in `React.memo`                            | P2       | P        | `export const Avatar = React.memo(function Avatar(..){})`           | No behavior change; renders unchanged; snapshot stable |
| Memoize computed style                          | P2       | P        | Use `useMemo` for size/shape + custom styles                        | Profiling shows fewer style object identities          |
| Add optional `accessibilityLabel`               | P3       | A11Y     | Pass through & default to initials or "avatar"                      | VoiceOver reads label                                  |
| Add Storybook story (sizes / initials fallback) | P2       | DOC      | `Avatar.stories.tsx` with size control & no-image fallback          | Story renders with controls                            |
| Add test file (`Avatar.test.tsx`)               | P2       | TEST     | Test initials generation, custom image, accessibilityLabel fallback | Tests pass & cover branches                            |

## Badge

| Task                                                           | Priority | Category | Details / Steps                                    | Acceptance Criteria                                                                |
| -------------------------------------------------------------- | -------- | -------- | -------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Add `accessibilityRole="text"` & optional `accessibilityLabel` | P1       | A11Y     | Label defaults to badge text                       | Screen reader announces badge text once                                            |
| Wrap in `React.memo`                                           | P2       | P        | Pure component                                     | Memoization test confirms no extra renders on parent re-render without prop change |
| Provide `variant -> color` mapping util                        | P2       | A/T      | Move switch into shared map object                 | Unit test asserts mapping integrity                                                |
| Add Storybook story (variants / statuses)                      | P2       | DOC      | Show color variants & count badge                  | Story visible & snapshot added                                                     |
| Add test file (`Badge.test.tsx`)                               | P2       | TEST     | Verify variant color mapping + a11y label fallback | Tests pass                                                                         |

## Button

| Task                                                         | Priority | Category | Details / Steps                                                            | Acceptance Criteria                                 |
| ------------------------------------------------------------ | -------- | -------- | -------------------------------------------------------------------------- | --------------------------------------------------- |
| Extend UIKitten props properly                               | P1       | A/T      | Extend base props (omit appearance/status/children) then add custom fields | Type inference provides UI Kitten props in editors  |
| Consolidate loading logic (single spinner path)              | P1       | A        | Use one accessory + maintain children fallback                             | Only one spinner found in DOM; tests updated        |
| Add default `accessibilityLabel` fallback to string children | P1       | A11Y     | If no label -> derive from text                                            | A11y test passes                                    |
| Replace hardcoded link styles with theme tokens              | P1       | S        | Use Eva `text-basic-color` + transparent background                        | Visual regression passes                            |
| Extract variant mapping to util                              | P2       | A        | Reusable map; add unit tests                                               | Mapping fully covered                               |
| Memoize icon renderers with `useCallback`                    | P3       | P        | Avoid recreating closures                                                  | Render count reduced in test profiler               |
| Add/ensure Storybook story (variants/sizes/loading)          | P2       | DOC      | `Button.stories.tsx` with controls                                         | Storybook shows controls; Chromatic snapshots added |
| Update existing tests for consolidated spinner logic         | P1       | TEST     | Adjust tests to check single spinner path & label fallback                 | Updated tests pass                                  |

## Card (+Subcomponents)

| Task                                                                        | Priority | Category  | Details / Steps                                        | Acceptance Criteria                                       |
| --------------------------------------------------------------------------- | -------- | --------- | ------------------------------------------------------ | --------------------------------------------------------- |
| Extend `UIKittenCardProps`                                                  | P1       | T         | `CardProps extends Omit<UIKittenCardProps,'children'>` | Type support present                                      |
| Extract static styles to `StyleSheet`                                       | P1       | S         | header/footer/body styles constant                     | Snapshot unchanged                                        |
| Platform shadow via shared `shadows.ts`                                     | P1       | S         | Use imported style object                              | Android elevation only on Android; iOS shadow only on iOS |
| Add Storybook stories (compound usage)                                      | P2       | DOC       | Show Card with Header/Content/Footer variants          | Stories render & pass Chromatic                           |
| Add test for pressable mode + accessibility                                 | P2       | TEST/A11Y | Simulate onPress; ensure role button + hint            | Test passes                                               |
| Add Storybook story focusing subcomponents (Header/Body/Footer composition) | P2       | DOC       | Additional composition examples                        | Story snapshot passes                                     |

## Checkbox

| Task                                                         | Priority | Category | Details / Steps                       | Acceptance Criteria |
| ------------------------------------------------------------ | -------- | -------- | ------------------------------------- | ------------------- |
| Optional: explicit pass-through `accessibilityLabel`         | P3       | A11Y     | Document that UI Kitten handles label | No regression       |
| Add Storybook story (checked/unchecked/disabled)             | P2       | DOC      | Basic state variants                  | Story present       |
| Audit / update existing tests (if any) to use new test utils | P2       | TEST     | Uses shared render helper             | Tests updated       |

## FormField

| Task                                              | Priority | Category | Details / Steps                                                                                        | Acceptance Criteria                   |
| ------------------------------------------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------- |
| Add tests (`FormField.test.tsx`)                  | P1       | TEST     | Cover label, error, hint precedence                                                                    | 100% branch on message rendering      |
| Associate error/hint via IDs (`nativeID`)         | P1       | A11Y     | Link child input (if single) using `accessibilityDescribedBy` (platform-limited) or documented pattern | Screen reader reads error after field |
| Accept `accessibilityHint` passthrough            | P2       | A11Y     | Prop optional                                                                                          | Tests verify prop present             |
| Memoize trivial component? (Skip)                 | P3       | P        | Decide not needed; document rationale                                                                  | Comment added                         |
| Add Storybook story (label + error + hint states) | P2       | DOC      | Controls to toggle error/hint                                                                          | Story renders                         |

## Header

| Task                                                     | Priority | Category | Details / Steps                                         | Acceptance Criteria                  |
| -------------------------------------------------------- | -------- | -------- | ------------------------------------------------------- | ------------------------------------ |
| Add `accessibilityRole="header"`                         | P1       | A11Y     | Apply to outer container                                | A11y test passes                     |
| Platform shadow handling refactor                        | P1       | S        | Import shared `shadows.ts`                              | Shadow conditional behavior verified |
| Document rationale vs `TopNavigation`                    | P1       | DOC      | Add to rationale section                                | Docs updated                         |
| Provide Storybook examples (basic with actions)          | P2       | DOC      | Story file with left/right actions                      | Chromatic snapshot stable            |
| Consider refactor to wrap `TopNavigation` (stretch goal) | P3       | A        | Spike & open follow-up issue                            | Issue filed                          |
| Add test file (`Header.test.tsx`)                        | P2       | TEST     | Verify title render, actions, shadow variant, a11y role | Tests pass                           |

## Icon

| Task                                             | Priority | Category | Details / Steps                                                   | Acceptance Criteria       |
| ------------------------------------------------ | -------- | -------- | ----------------------------------------------------------------- | ------------------------- |
| Extend `IconProps` from UI Kitten                | P1       | T        | `interface IconProps extends Omit<UIKittenIconProps,'name'>` etc. | Type completion works     |
| Add test file (`Icon.test.tsx`)                  | P1       | TEST     | Render name + custom child; size & color mapping                  | Coverage for branch paths |
| Wrap in `React.memo`                             | P2       | P        | Pure                                                              | Reduced renders in test   |
| Avoid cloning style override risk (merge styles) | P2       | S        | Use `StyleSheet.create` for base style                            | Visual parity             |
| Add Storybook story (sizes / color overrides)    | P2       | DOC      | Controls: name, size, color                                       | Story renders             |

## Input

| Task                                                          | Priority | Category | Details / Steps                                     | Acceptance Criteria     |
| ------------------------------------------------------------- | -------- | -------- | --------------------------------------------------- | ----------------------- |
| Extend `UIKittenInputProps` properly                          | P1       | T        | Replace standalone props with extension             | Types correct in editor |
| Add default `accessibilityLabel` fallback (placeholder/value) | P1       | A11Y     | If missing label, use placeholder or 'input field'  | A11y test passes        |
| Replace hardcoded rgba with theme token                       | P1       | S        | Use `evaTheme['background-basic-color-2']` fallback | Visual diff acceptable  |
| Extract variant style map                                     | P2       | S        | No ad-hoc style array conditions                    | Unit test for map keys  |
| Add Storybook stories (variants/status/sizes)                 | P2       | DOC      | Stories with controls                               | Chromatic added         |
| Direct (unmocked) component test                              | P2       | TEST     | Remove full mock; test integration with provider    | Test passes             |
| Update existing tests for new prop extension & label fallback | P1       | TEST     | Ensure placeholder/value fallback path tested       | Updated tests pass      |

## ListItem

| Task                                                               | Priority | Category | Details / Steps                            | Acceptance Criteria               |
| ------------------------------------------------------------------ | -------- | -------- | ------------------------------------------ | --------------------------------- |
| Decide compose vs keep custom (rationale)                          | P1       | A/DOC    | If no added value: mark deprecated in docs | Deprecation notice                |
| Extend `UIKittenListItemProps` if kept                             | P1       | T        | Provide base prop extension                | Types available                   |
| Add test file (`ListItem.test.tsx`)                                | P1       | TEST     | Cover press, disabled, description lines   | Coverage includes disabled branch |
| Add Storybook story (leading/trailing variants)                    | P2       | DOC      | Show with icons, switches, badges          | Story present                     |
| Extract static styles to StyleSheet                                | P2       | S        | Container & text spacing constants         | Inline style objects reduced      |
| Add pressed feedback (opacity or scale)                            | P2       | UX       | Use `Pressable` style function             | Visual feedback observed          |
| Accessibility roles & labels for non-pressable                     | P2       | A11Y     | role="text" + descriptive labeling         | A11y test passes                  |
| Update or create Storybook story (deprecation badge if deprecated) | P2       | DOC      | Displays deprecation if applicable         | Story visible                     |

## Modal

| Task                                                                                  | Priority | Category | Details / Steps                                            | Acceptance Criteria                         |
| ------------------------------------------------------------------------------------- | -------- | -------- | ---------------------------------------------------------- | ------------------------------------------- |
| Document rationale (advanced animation, focus mgmt)                                   | P1       | DOC      | Rationale section updated                                  | Docs updated                                |
| Extract StyleSheet for static blocks (header/footer/backdrop)                         | P2       | S        | Style arrays slimmed                                       | Snapshot parity                             |
| Replace `setTimeout(300)` with animation completion callback or configurable constant | P2       | A        | Use prop or reanimated callback                            | Test asserts no arbitrary timeout constant  |
| Add reduced motion branch (no scale/translate)                                        | P2       | A11Y/P   | Condition via `useReducedMotion`                           | Test covers branch                          |
| Accessibility described-by pattern for content summary                                | P3       | A11Y     | Hidden summary text referenced                             | Screen reader test passes (where supported) |
| Add test file (`Modal.test.tsx`)                                                      | P1       | TEST     | Open/close animation, reduced motion branch, focus restore | Tests pass                                  |
| Add Storybook story (basic / with header / scrollable content)                        | P2       | DOC      | Args: visible, withHeader                                  | Story + snapshots added                     |

## NetworkSelector

| Task                                                 | Priority | Category | Details / Steps                             | Acceptance Criteria          |
| ---------------------------------------------------- | -------- | -------- | ------------------------------------------- | ---------------------------- |
| Correct `style?: any` to `StyleProp<ViewStyle>`      | P1       | T        | Update interface                            | Type passes lint             |
| Add a11y labels: `${name}. ${description}`           | P1       | A11Y     | Each tile has role=button + label           | Test validates label content |
| Extract static styles to StyleSheet                  | P2       | S        | Container + tile base styles constant       | Inline style count reduced   |
| Add tests: selection, disabled opacity, list vs grid | P2       | TEST     | Cover grid/list variants & disabled branch  | Coverage for variant toggle  |
| Add Storybook story (grid/list, selected state)      | P2       | DOC      | Controls for variant & selected network     | Story renders                |
| Memoize mapped network list (`useMemo`)              | P3       | P        | Derived from supported networks             | No behavior change           |
| Update tests after style prop typing change          | P1       | TEST     | Adjust render helper; ensure no type errors | Tests green                  |

## Switch

| Task                                                                  | Priority | Category | Details / Steps                 | Acceptance Criteria |
| --------------------------------------------------------------------- | -------- | -------- | ------------------------------- | ------------------- |
| Optional default `accessibilityLabel` from `label`                    | P3       | A11Y     | Fallback if label prop present  | A11y test passes    |
| Add Storybook story (on/off/disabled)                                 | P2       | DOC      | Controls: value, disabled       | Story renders       |
| Add/update test file (`Switch.test.tsx`) ensuring a11y label fallback | P2       | TEST     | Asserts label fallback behavior | Test passes         |

## TabBar

| Task                                                  | Priority | Category | Details / Steps                                         | Acceptance Criteria                   |
| ----------------------------------------------------- | -------- | -------- | ------------------------------------------------------- | ------------------------------------- |
| Remove duplicate `useEffect`                          | P1       | A        | Single effect controlling indicator values              | Only one effect in file               |
| Add reduced-motion branch disabling spring animations | P1       | A11Y/P   | Use `useReducedMotion`                                  | Test verifies style applied instantly |
| Extract static styles (container/tab/indicator)       | P2       | S        | `StyleSheet.create` used                                | Inline style objects minimized        |
| Document rationale vs UI Kitten `BottomNavigation`    | P2       | DOC      | Rationale section updated                               | Docs updated                          |
| Extend (or mimic) base props of UI Kitten component   | P2       | T        | Provide partial compatibility layer                     | Consumers can pass similar props      |
| Add Storybook story (activeIndex, badges)             | P2       | DOC      | Controls for active tab & badges                        | Chromatic snapshots added             |
| Add test file (`TabBar.test.tsx`)                     | P1       | TEST     | Indicator movement, reduced motion branch, badge render | Tests pass                            |

## Text

| Task                                                 | Priority | Category | Details / Steps                                          | Acceptance Criteria               |
| ---------------------------------------------------- | -------- | -------- | -------------------------------------------------------- | --------------------------------- |
| Extend `UIKittenTextProps`                           | P1       | T        | Provide base extension & maintain custom variant mapping | Type inference works              |
| Replace `style?: any` with `StyleProp<TextStyle>`    | P1       | T        | Update interface                                         | Lint passes                       |
| Add test file (`Text.test.tsx`)                      | P1       | TEST     | Validate variant -> category map; color resolution       | Test passes                       |
| Wrap in `React.memo`                                 | P2       | P        | Pure render                                              | Fewer re-renders in profiler test |
| Add Storybook (variants/colors/weights)              | P2       | DOC      | Story with controls                                      | Chromatic snapshot added          |
| Update tests if variant mapping util extracted (G-1) | P1       | TEST     | Replace duplicated mapping; ensure coverage unchanged    | Tests pass                        |

---

## Execution Sequence (Suggested Sprint Breakdown)

1. Sprint 1: Button, Input, Text (shared prop extension & a11y), Global tasks G-1, G-5.
2. Sprint 2: Card, ListItem, Header (styling + platform shadows + rationale), add stories.
3. Sprint 3: TabBar & Modal (animation + reduced motion + rationale), NetworkSelector a11y/tests.
4. Sprint 4: Remaining performance/memo (Avatar, Badge, Icon), leftover docs & deprecation decisions.

## Acceptance / Done Definition

- All P1 tasks merged & passing CI (lint, type-check, tests, Chromatic) before moving P2.
- No component exposes `style?: any`.
- Each component has at least one Storybook story (unless explicitly deprecated).
- Accessibility tests cover label fallbacks & interactive roles.
- Reduced motion honored in animated components.

---

Generated automatically. Update status columns (add ✅) as tasks are completed.
