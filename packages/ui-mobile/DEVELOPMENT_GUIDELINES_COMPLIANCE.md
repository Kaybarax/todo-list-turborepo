# @todo/ui-mobile Development Guidelines Compliance Report

Date: 2025-09-08

Scope: Review of all components under `lib/components` against `DEVELOPMENT_GUIDELINES.md`.

## Legend

- ✅ Compliant / acceptable
- ⚠️ Partial / minor deviations
- ❌ Not compliant (action recommended)

## Summary

| Component                | Status | Key Issues Identified                                                                                                                                                                                                      |
| ------------------------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Avatar                   | ⚠️     | Does not memoize; inline object style composition for runtime variant; minor fallback color hardcodes                                                                                                                      |
| Badge                    | ⚠️     | Not memoized; no accessibility props; could use `React.memo`; dynamic styles lack `useMemo`                                                                                                                                |
| Button                   | ❌     | Props do not extend UI Kitten `ButtonProps`; missing theme token usage; duplicated loading indicator logic; no fallback a11y label; limited status mapping                                                                 |
| Card (and subcomponents) | ❌     | `CardProps` not extending `UIKittenCardProps`; no `StyleSheet.create`; elevation + shadow not platform-conditional; padding relies on custom theme not documented in guidelines                                            |
| Checkbox                 | ✅     | Proper `Omit<>` usage, theming tokens, accessibility via label rendering (minor: label not explicitly tied via `accessibilityLabel`)                                                                                       |
| FormField                | ⚠️     | Good theming; could expose accessibility linking (e.g. `aria-describedby` analogue via `accessibilityHint`); lacks memoization though mostly static                                                                        |
| Header                   | ❌     | Reimplements functionality overlapping UI Kitten `TopNavigation`; not built atop it; elevation/shadow not platform specific; lacks `accessibilityRole="header"`; no memoization                                            |
| Icon                     | ⚠️     | Does not extend UI Kitten Icon props; no memoization; manual cloning may override consumer styles                                                                                                                          |
| Input                    | ❌     | Does not extend `UIKittenInputProps`; variant styling partially hardcoded (colors); missing Eva tokens for variant backgrounds; no accessibility fallback label                                                            |
| ListItem                 | ❌     | Reimplements existing UI Kitten `ListItem`; no `StyleSheet.create`; color + spacing inline; missing press feedback (e.g. ripple/opacity); no `accessibilityRole` when non-pressable; no theming for borders via StyleSheet |
| Modal                    | ⚠️     | Reimplements behavior instead of composing UI Kitten `Modal`; complex animation acceptable but should document rationale; inline styles instead of `StyleSheet`; some duplicated logic; focus mgmt timeout magic number    |
| NetworkSelector          | ⚠️     | `style?: any`; should use proper `StyleProp<ViewStyle>`; dynamic styling heavy inline; lacks accessibility labels for interactive tiles beyond defaults; could use `Pressable` with state feedback                         |
| Switch                   | ✅     | Proper extension + theming + accessibility considerations (label)                                                                                                                                                          |
| TabBar                   | ❌     | Reimplements UI Kitten `BottomNavigation`; duplicate `useEffect` block; does not extend base props; no `StyleSheet.create`; inconsistent badge logic; lacks `Pressable` feedback state                                     |
| Text                     | ❌     | Does not extend UI Kitten `TextProps`; style prop typed as `any`; color mapping OK but weight mapping relies on external theme; no memoization                                                                             |

## Detailed Findings

### 1. Avatar (⚠️)

- Guideline: Performance & Styling – encourage memoization and `StyleSheet.create`.
- Issue: Uses `StyleSheet` for static segments but runtime style object (`avatarStyles`) rebuilt each render without memoization.
- Improvement: Wrap component in `React.memo`; compute size/shape styles via mapping object; use `useMemo` for combined style.

### 2. Badge (⚠️)

- Guideline: Performance (memoization) & Accessibility.
- Issues: Not memoized; dynamic style decisions done every render; no `accessibilityRole="text"` or label when used as status indicator.
- Improvement: `React.memo`, add optional `accessibilityLabel` prop.

### 3. Button (❌)

- Guideline: "Extend UI Kitten props" – current `ButtonProps` is standalone; cast of rest props via `as Partial<UIKittenButtonProps>` is unsafe.
- Theming: Does not use Eva tokens for link style (hardcoded transparent, no semantic color usage).
- Accessibility: Does not default `accessibilityLabel` to string children.
- Performance: Spinner rendered twice when `loading && !icon`; separate accessory & inline fallback duplication.
- API: Variant mapping omits explicit support for `destructive` appearance styling tokens (no custom styling beyond status danger).

### 4. Card & Subcomponents (❌)

- Guideline: Extend base props; not done.
- Styling: Inline style arrays instead of `StyleSheet.create`; elevation/shadow unconditional (should use `Platform.select`).
- Theming: Border colors use tokens – good. Padding uses custom `theme.spacing` (acceptable) but not documented in guidelines; fine if standard across lib.
- Accessibility: When `onPress` present, adds `accessibilityRole="button"` (good) but lacks `accessibilityHint` and press feedback styling.

### 5. Checkbox (✅)

- Compliant with extension rule via `Omit`; theming tokens applied; accessible label via nested `Text` (UI Kitten handles linking). Minor optional improvement for explicit `accessibilityLabel` pass-through.

### 6. FormField (⚠️)

- Accessibility: Could programmatically associate label and hint to input via setting IDs / `accessibilityLabel` on child when missing.
- Performance: Simple component – memoization optional.

### 7. Header (❌)

- Guideline violation: UI Kitten offers `TopNavigation`; custom implementation duplicates behavior.
- Styling: Platform-specific shadow not handled (elevation on Android vs shadow props on iOS separately); currently sets both.
- Accessibility: Should apply `accessibilityRole="header"` or wrap title accordingly.

### 8. Icon (⚠️)

- Does not extend `IconProps` from UI Kitten – limits consumer features (e.g., animation props or pack resolution).
- Potential style override risk cloning children.
- Recommend adding `React.memo`.

### 9. Input (❌)

- Does not extend `UIKittenInputProps`; loses built-in prop intellisense.
- Variant styling uses hardcoded rgba value rather than Eva tokens.
- Accessibility: No defaulting of `accessibilityLabel` from placeholder/value when missing.

### 10. ListItem (❌)

- Reimplements UI Kitten `ListItem` (foundation guideline).
- No `StyleSheet.create`; many inline objects built each render.
- Border styling inline per-item (could centralize); lacks pressed state feedback (e.g., `TouchableOpacity` default opacity adequate but style change could improve).
- Accessibility: When not pressable lacks any role; trailing/leading not described for screen readers.

### 11. Modal (⚠️)

- Custom implementation instead of composing UI Kitten `Modal`; acceptable if extended features (focus trapping, custom animations) justified—should be documented.
- Inline style definitions; could extract stable styles to `StyleSheet.create`.
- Focus management uses `setTimeout(300)` magic number; should parameterize or use animation callbacks.
- Accessibility: Adds dialog roles; good. Consider providing `aria-describedby` equivalent (RN pattern: additional text with `accessibilityElementsHidden` false) for content summary.

### 12. NetworkSelector (⚠️)

- Typing: `style?: any` violates TypeScript guideline; should be `StyleProp<ViewStyle>`.
- Accessibility: Each touchable lacks explicit `accessibilityLabel` (could be network name plus description) and `accessibilityRole="button"`.
- Styling: Many inline styles; could move base shapes to `StyleSheet.create`.

### 13. Switch (✅)

- Proper extension and theming. Optional: default `accessibilityLabel` from `label`.

### 14. TabBar (❌)

- Reimplements UI Kitten `BottomNavigation` / `TabBar` (foundation guideline violation).
- Duplicate `useEffect` block (exact same dependency list) – redundant re-renders.
- Inline styles with no `StyleSheet.create`.
- Animation logic ok but lacks reduced-motion consideration.
- Accessibility: Provides roles & state; good. Could group each tab's icon & label under same accessible element (currently done) – fine.

### 15. Text (❌)

- Does not extend `TextProps` from UI Kitten; lacks pass-through for all supported props.
- `style?: any` violates typing guideline.
- Could memoize to avoid re-computation of color mapping (minor; usually cheap but consistent with performance guidelines).

## Cross-Cutting Observations

- Missing consistent extension of base UI Kitten props in several components (Button, Card, Input, Text, Icon, ListItem, TabBar).
- Inconsistent use of `StyleSheet.create`; many components rely on inline objects (Card, ListItem, Modal, TabBar, NetworkSelector).
- Accessibility improvements needed for fallback labels and descriptive associations (Button, Input, NetworkSelector, Header, ListItem, Badge).
- Performance enhancements: Add memoization (`React.memo`) to frequently re-rendered, pure presentational components (Badge, Icon, Avatar, Text, TabBar items).
- Platform-specific shadow handling missing or unconditional (Card, Header).

## Recommended Remediation Order (Impact vs Effort)

1. Prop Extension & Types (Button, Input, Text, Card, ListItem, TabBar, Icon) – high developer usability impact.
2. Accessibility Defaults (Button, Input, NetworkSelector, Header) – user experience & compliance.
3. Remove Duplicate Logic (TabBar duplicate `useEffect`).
4. Extract Static Styles to `StyleSheet.create` (Card, ListItem, Modal, TabBar, NetworkSelector).
5. Introduce Memoization where low risk (Badge, Icon, Avatar, Text, TabBar).
6. Platform-Specific Shadows via `Platform.select` and tokens (Card, Header).
7. Document Rationale for Custom Re-implementations (Modal, TabBar, ListItem, Header) or refactor to compose UI Kitten equivalents.

## Example Fix Patterns

- Extending Props:

```ts
export interface ButtonProps extends Omit<UIKittenButtonProps, 'appearance' | 'status'> {
  /* custom additions */
}
```

- Typing `style` correctly:

```ts
import { StyleProp, ViewStyle } from 'react-native';
style?: StyleProp<ViewStyle>;
```

- Memoization:

```ts
export const Badge = React.memo<BadgeProps>(function BadgeImpl(props) {
  /* ... */
});
```

- Platform shadows:

```ts
const elevationStyles = Platform.select({
  ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  android: { elevation: 4 },
});
```

## Quick Win Checklist

| Action                           | Components                                        | Est. Effort |
| -------------------------------- | ------------------------------------------------- | ----------- |
| Extend UI Kitten base props      | Button, Input, Text, Card, Icon, ListItem, TabBar | Medium      |
| Replace `any` style types        | NetworkSelector, Text                             | Low         |
| Remove duplicate effect          | TabBar                                            | Trivial     |
| Add default `accessibilityLabel` | Button, Input, Switch, NetworkSelector            | Low         |
| Add `React.memo`                 | Badge, Icon, Avatar, Text                         | Low         |
| Extract static styles            | Card, ListItem, Modal, TabBar                     | Medium      |

## Conclusion

Most core components adhere to thematic token usage, but several foundational guidelines (extending UI Kitten base props, consistent typing, accessibility defaults, style extraction) require remediation. Prioritizing prop extension and accessibility will yield the highest immediate quality improvements.

---

Generated automatically based on current repository state.

## Coverage

Current Jest global thresholds are set to 80% (statements / branches / lines / functions). A fresh run (2025-09-08) produced:

| Metric     | Current | Threshold | Delta  |
| ---------- | ------- | --------- | ------ |
| Statements | 59.72%  | 80%       | -20.28 |
| Branches   | 52.09%  | 80%       | -27.91 |
| Lines      | 62.02%  | 80%       | -17.98 |
| Functions  | 34.78%  | 80%       | -45.22 |

Largest gaps come from components (and supporting modules) with 0% or near‑0% coverage due to missing direct tests or indirect usage only:

- Components fully untested or only exercised via higher-level tests: `Input`, `ListItem`, `FormField`, `Checkbox`, `Switch`, `NetworkSelector` (implementation file paths show 0%).
- Barrel / index files (pure re‑exports) counted but never directly executed (`index.ts` files across components, tokens, hooks, utils) depress percentages.
- Theming / validation utilities (`enhanced-validation.ts`, `useEnhancedTheme.ts`, `useEvaTheme.ts`, `ThemeErrorBoundary.ts`) have complex branches under-tested.

Planned remediation to reach ≥80% by Phase 4:

1. Add targeted unit tests per missing component (focus: prop/variant logic, accessibility fallbacks) – Phase 3 tasks will introduce/refactor logic first to avoid churn.
2. Write focused tests for theme validation / error boundary to cover core success & failure paths (add 2–3 small suites).
3. Exclude pure barrel files from coverage via either:
   - Adding a `coveragePathIgnorePatterns` entry for `/index.ts$`, or
   - Narrowing `collectCoverageFrom` to `lib/components/**/*.ts?(x)` & specific util/hook directories.
4. Add reduced motion hook & shadows util (Phase 1) with dedicated tests to lift branch/function coverage.
5. After new tests in Phases 3 & 4, re‑evaluate and only then (if still short) consider interim threshold step-down (not planned presently).

Exit Criteria for Coverage (Phase 4 sign‑off):

- No component implementation file remains at 0% statements.
- Global functions & branches ≥80% AND per-key component (Button, Input, Modal, TabBar, Text) ≥85% statements (stretch target, tracked internally).

Action Item Tracking:

- P4-1 will add missing component tests enumerated above.
- TXT-3 / INP-4 / BTN-5 tasks will contribute additional lines & branches.

Until remediation completes, CI will intentionally fail coverage threshold checks; this is acceptable for Phase 0 while foundation tasks proceed. Threshold values remain unchanged to enforce improvement pressure.

## Addendum: DEVELOPMENT.md Guideline Compliance (Architecture, Testing, Stories)

This addendum evaluates components against the broader requirements in `DEVELOPMENT.md` (architecture, testing, storybook, accessibility, performance, typing, styling).

### Legend Additions

- 🧪 Missing / inadequate tests
- 📘 Missing Storybook story
- 🧱 Architecture deviation (did not extend base UI Kitten or reimplemented existing component)
- 🎯 Accessibility gap beyond initial audit

### Component Matrix (Incremental Findings)

| Component       | New Issues vs DEVELOPMENT.md                                                                                           | Indicators           |
| --------------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------- |
| Avatar          | Lacks `React.memo`; stories exist (seen in Chromatic index); OK otherwise                                              | ⚠️ Perf              |
| Badge           | No memo; story present; no explicit a11y label guidance                                                                | ⚠️ Perf/🎯           |
| Button          | Same as earlier plus: Story likely present; still not extending `UIKittenButtonProps`                                  | 🧱                   |
| Card            | No story file detected (not confirmed); not extending base props; inline styles                                        | 🧱 📘                |
| Checkbox        | Generally compliant; story assumed (Chromatic output implies)                                                          | ✅                   |
| FormField       | No dedicated test file found (`FormField.test.*`); no story; wrapper pattern OK                                        | 🧪 📘                |
| Header          | Reimplements `TopNavigation`; missing story/test beyond `Header.test.tsx` (test exists); needs role="header"           | 🧱 🎯                |
| Icon            | No dedicated test (`Icon.test.*` absent); not extending UI Kitten props                                                | 🧪 🧱                |
| Input           | Mocked in tests (indirect) but lacks direct unmocked test; missing prop extension; no story found in grep results      | 🧪 🧱 📘             |
| ListItem        | No test file; reimplements UI Kitten ListItem; no story located                                                        | 🧪 🧱 📘             |
| Modal           | Tests present; custom implementation justified? (Needs doc note); heavy inline styling                                 | 🧱 (needs rationale) |
| NetworkSelector | Custom domain component (no UI Kitten equivalent); lacks tests for accessibility states beyond base; no story detected | 🧪 📘 🎯             |
| Switch          | Tests present; OK; could add default a11y label fallback                                                               | ✅                   |
| TabBar          | Reimplements bottom navigation; tests present; needs rationale doc & reduced-motion consideration                      | 🧱                   |
| Text            | No test file; no story; not extending UI Kitten Text props                                                             | 🧪 🧱 📘             |

### Specific DEVELOPMENT.md Deviations

1. Prop Extension (Section: TypeScript Best Practices)
   - Missing: Button, Card, Icon, Input, ListItem, TabBar, Text.
2. StyleSheet Usage (Styling Conventions)
   - Inline heavy: Card, ListItem, Modal, NetworkSelector, TabBar.
3. Testing Coverage
   - Missing or incomplete tests: FormField, Icon, ListItem, NetworkSelector (accessibility variants), Text.
4. Storybook Stories
   - No `.stories.tsx` found (grep) for: Card, FormField, Header, Icon, Input, ListItem, NetworkSelector, Text, TabBar (may exist elsewhere; not in `lib/components`).
5. Accessibility Additions
   - Need default/fallback labels or roles: Button (children text fallback), Input (placeholder fallback), Header (`accessibilityRole="header"`), NetworkSelector (tile labels), Badge (semantic label when count/status), ListItem (role, descriptive trailing/leading a11y), Text (pass-through for accessibility props when extended).
6. Performance (React.memo / memoization guidance)
   - Candidates: Avatar, Badge, Icon, Text, ListItem (pure presentational), Card subcomponents, NetworkSelector items.
7. Platform-Specific Styling
   - Shadows unconditional: Card, Header. Should use `Platform.select` per doc examples.
8. Rationale Documentation Needed (Reimplemented Instead of Composing)
   - Modal, TabBar, Header, ListItem: add justification section or refactor.

### Recommended Updates to DEVELOPMENT.md (Documentation Gaps)

Add a short section: "Custom Implementations Rationale" enumerating accepted divergences (e.g., Modal for advanced animation & focus mgmt; TabBar for animation not provided by UI Kitten; Header for integrated safe-area + actions; ListItem—should consider deprecating in favor of UI Kitten if no added value).

### High-Priority Action List (DEVELOPMENT.md Alignment)

| Priority | Action                                        | Components                                                                    |
| -------- | --------------------------------------------- | ----------------------------------------------------------------------------- |
| P1       | Add / refactor to extend UI Kitten base props | Button, Input, Card, Icon, Text, ListItem, TabBar                             |
| P1       | Create missing unit + a11y tests              | FormField, Icon, ListItem, NetworkSelector, Text                              |
| P1       | Add Storybook stories                         | Card, FormField, Icon, Input, ListItem, NetworkSelector, Text, TabBar, Header |
| P2       | Extract static styles to StyleSheet           | Card, ListItem, Modal, TabBar, NetworkSelector                                |
| P2       | Add platform shadow handling                  | Card, Header                                                                  |
| P2       | Introduce memoization                         | Avatar, Badge, Icon, Text, ListItem                                           |
| P3       | Add accessibility fallbacks                   | Button, Input, Header, NetworkSelector, Badge, ListItem                       |
| P3       | Document custom component rationales          | Modal, TabBar, Header, ListItem                                               |

### Suggested Test File Stubs to Add

```text
__tests__/FormField.test.tsx
__tests__/Icon.test.tsx
__tests__/ListItem.test.tsx
__tests__/NetworkSelector.a11y.test.tsx
__tests__/Text.test.tsx
```

### Storybook Story File Examples to Add

```text
lib/components/FormField/FormField.stories.tsx
lib/components/ListItem/ListItem.stories.tsx
lib/components/Text/Text.stories.tsx
```

---

Addendum generated automatically; integrate remediation tasks into backlog.
