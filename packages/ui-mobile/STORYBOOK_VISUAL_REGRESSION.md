# Storybook Visual Regression (ui-mobile)

## Overview

Chromatic is configured for `@todo/ui-mobile` to provide automated visual regression testing of Storybook stories.

Current setup includes:

- Addon: `@chromatic-com/storybook` already listed in `.storybook/main.ts`.
- Scripts in `package.json`:
  - `chromatic` (manual run)
  - `chromatic:ci` (CI-friendly with soft-fail flags)
- GitHub Action workflow: `.github/workflows/storybook-mobile.yml` (runs build + accessibility + Chromatic)

## Running Locally

```bash
pnpm --filter @todo/ui-mobile build-storybook
pnpm --filter @todo/ui-mobile chromatic
```

## Environment / Secrets

Set the GitHub secret `CHROMATIC_PROJECT_TOKEN` (matches Chromatic project token) for the CI run. The workflow uses:

```yaml
env:
  CHROMATIC_PROJECT_TOKEN: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
```

If the secret is missing the step soft-fails (current behavior).

## Snapshot Review Flow

1. Open the Chromatic build link from PR checks.
2. Review changed snapshots (UI diffs) and accept if valid.
3. Merge once snapshots are approved (or iterate if diffs unexpected).

## Hardening Options (Future)

| Option                      | Change                              | Impact                            |
| --------------------------- | ----------------------------------- | --------------------------------- |
| Block on diffs              | Remove `--exit-zero-on-changes`     | Fails CI if unapproved changes    |
| Faster builds               | Add `--only-changed`                | Skips unchanged stories for speed |
| Skip addon during local dev | Conditional addon load via env flag | Speeds dev startup                |

## Recommended Next Enhancements

- Introduce story grouping tags (e.g. `layout`, `typography`, `interactive`) to filter review scope.
- Add web Storybook Chromatic workflow for parity (`@todo/ui-web`).
- Add a pre-push hook to run a quick `chromatic --dry-run` locally (optional).

## Maintenance Checklist

- Keep Chromatic dependency updated.
- Periodically audit orphaned stories (deleted components still in Chromatic).
- Ensure new components include stable visual states (avoid unpredictable animations without reduced-motion guard).

---

Generated during P2-5 to document the visual regression setup.
