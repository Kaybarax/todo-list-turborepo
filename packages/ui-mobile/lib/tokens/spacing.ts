/**
 * Spacing Design Tokens
 * Consistent spacing scale for margins, padding, and gaps
 */

export interface SpacingTokens {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
  xxxxl: number;
}

// Base unit: 4px for consistent spacing
const BASE_UNIT = 4;

export const spacing: SpacingTokens = {
  xs: BASE_UNIT, // 4px
  sm: BASE_UNIT * 2, // 8px
  md: BASE_UNIT * 3, // 12px
  lg: BASE_UNIT * 4, // 16px
  xl: BASE_UNIT * 5, // 20px
  xxl: BASE_UNIT * 6, // 24px
  xxxl: BASE_UNIT * 8, // 32px
  xxxxl: BASE_UNIT * 10, // 40px
};

// Component-specific spacing patterns
export const componentSpacing = {
  // Button spacing
  button: {
    paddingHorizontal: {
      sm: spacing.md,
      md: spacing.lg,
      lg: spacing.xl,
    },
    paddingVertical: {
      sm: spacing.sm,
      md: spacing.md,
      lg: spacing.lg,
    },
    gap: spacing.sm,
  },

  // Card spacing
  card: {
    padding: spacing.lg,
    gap: spacing.md,
  },

  // Form field spacing
  formField: {
    marginBottom: spacing.lg,
    labelMarginBottom: spacing.xs,
    errorMarginTop: spacing.xs,
  },

  // List item spacing
  listItem: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },

  // Screen spacing
  screen: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
};

export default spacing;
