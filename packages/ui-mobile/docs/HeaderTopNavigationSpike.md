# Header TopNavigation Spike (P6-3)

Purpose: Evaluate wrapping UI Kitten `TopNavigation` to replace custom `Header` implementation while keeping API + a11y parity.

## Mapping

| Header Prop          | TopNavigation Mapping             | Notes                                               |
| -------------------- | --------------------------------- | --------------------------------------------------- |
| `title`              | `title` render prop (custom Text) | Maintains typography tokens.                        |
| `leftAction`         | `accessoryLeft`                   | Wrapped with size wrapper for 44x44 hit target.     |
| `rightAction`        | `accessoryRight`                  | Same as left.                                       |
| `backgroundColor`    | Container view style              | Outer wrapper keeps control.                        |
| `showBorder`         | Border styles on wrapper          | Works; TopNavigation left transparent.              |
| `statusBarStyle`     | Passed to StatusBar               | Same behavior.                                      |
| `style`              | Merged into wrapper               | Safe.                                               |
| `accessibilityLabel` | Applied to wrapper                | Ensures role+label even if inner component changes. |

## Accessibility

- Wrapper adds `accessibilityRole="header"` (TopNavigation currently does not).
- Label derives from `title` fallback; explicit prop override supported.

## Layout & Spacing

- Safe-area inset + spacing tokens applied externally (avoids double padding).
- Actions wrapped to enforce min 44x44; TopNavigation alone does not guarantee.

## Performance (Planned Measurement)

Script (pseudo): mount each variant 100x; measure median duration. Target overhead <0.2ms vs custom.

## Risks Observed

- Shadow/elevation relies on wrapper; acceptable as original already externalized.
- If future TopNavigation internal spacing changes, we keep stability via wrapper tests.

## Recommendation (Initial)

Adoptable pending quantitative perf check. No blockers found functionally or in a11y.

## Next Step

If perf delta within threshold, implement a drop-in replacement: export `Header` from a unified module using this approach (keeping file for reference during rollout) and deprecate custom layout internals.
