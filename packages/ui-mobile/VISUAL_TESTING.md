# Visual Regression Testing Guide

This document outlines the visual regression testing setup for the mobile design system, including Chromatic integration, cross-platform screenshots, and performance benchmarks.

## Overview

The visual regression testing suite includes:

- **Chromatic Integration**: Automated visual testing with Storybook
- **Cross-Platform Screenshots**: iOS, Android, and Web comparisons
- **Accessibility Testing**: WCAG 2.1 Level AA compliance
- **Performance Benchmarks**: Component rendering and interaction metrics

## Setup

### Prerequisites

```bash
# Install dependencies
pnpm install

# Install Playwright browsers
pnpm exec playwright install --with-deps
```

### Environment Variables

Create a `.env` file with your Chromatic project token:

```env
CHROMATIC_PROJECT_TOKEN=your_project_token_here
```

## Running Tests

### Visual Regression Tests

```bash
# Run all visual tests
pnpm test:visual

# Run specific platform/theme
pnpm test:visual --platform=ios --theme=dark

# Run with Chromatic
pnpm chromatic
```

### Accessibility Tests

```bash
# Run accessibility tests
pnpm test:a11y

# Run with specific viewport
pnpm test:a11y --project=accessibility-mobile
```

### Performance Tests

```bash
# Run performance benchmarks
pnpm test:performance

# Run specific performance test
pnpm test:performance --grep="rendering performance"
```

### Storybook Test Runner

```bash
# Run all Storybook tests
pnpm test:storybook

# Run in CI mode
pnpm test:storybook:ci
```

## Configuration

### Visual Test Scenarios

The testing suite covers multiple scenarios defined in `.storybook/visual-tests.ts`:

- **iOS Light/Dark**: iPhone SE, iPhone 12 Pro Max
- **Android Light/Dark**: Small and large Android devices
- **Tablet**: Portrait and landscape orientations
- **Web**: Desktop responsive breakpoints

### Performance Budgets

Performance budgets are defined in `.storybook/performance-tests.ts`:

| Component | Render Time | Bundle Size | Memory Usage |
| --------- | ----------- | ----------- | ------------ |
| Button    | 5ms         | 5KB         | 1MB          |
| Card      | 10ms        | 8KB         | 2MB          |
| Modal     | 20ms        | 15KB        | 5MB          |
| TabBar    | 15ms        | 12KB        | 3MB          |
| Header    | 8ms         | 6KB         | 1.5MB        |

### Accessibility Rules

WCAG 2.1 Level AA compliance includes:

- Color contrast (4.5:1 normal text, 3:1 large text)
- Touch target size (minimum 44x44px)
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Reduced motion preferences

## CI/CD Integration

### GitHub Actions

The visual regression workflow (`.github/workflows/visual-regression.yml`) runs:

1. **Chromatic Tests**: Visual regression detection
2. **Accessibility Tests**: WCAG compliance validation
3. **Performance Tests**: Component benchmarking
4. **Cross-Platform Screenshots**: Multi-device comparisons

### Chromatic Configuration

Key settings in `.chromatic.config.json`:

- Only test changed components (`onlyChanged: true`)
- Auto-accept changes on main branch
- Skip dependabot branches
- Generate JUnit reports for CI

## Test Structure

### Visual Tests (`tests/visual/`)

- Component screenshot comparisons
- Theme switching validation
- Responsive breakpoint testing
- Interactive state capture

### Accessibility Tests (`tests/accessibility/`)

- WCAG 2.1 compliance validation
- Keyboard navigation testing
- Screen reader compatibility
- Touch target validation
- Color contrast verification

### Performance Tests (`tests/performance/`)

- Component rendering benchmarks
- Memory usage monitoring
- Animation performance analysis
- Bundle size tracking
- Interaction timing measurement

## Best Practices

### Writing Visual Tests

1. **Disable Animations**: Use CSS to disable animations for consistent screenshots
2. **Wait for Stability**: Allow components to fully render before capturing
3. **Use Semantic Selectors**: Target components with `data-testid` attributes
4. **Test Multiple States**: Cover default, hover, focus, and active states

### Accessibility Testing

1. **Test Real Interactions**: Use actual keyboard and screen reader patterns
2. **Validate Touch Targets**: Ensure minimum 44x44px size
3. **Check Color Contrast**: Test both light and dark themes
4. **Verify Focus Management**: Ensure proper focus trapping in modals

### Performance Testing

1. **Set Realistic Budgets**: Based on target device capabilities
2. **Monitor Trends**: Track performance over time
3. **Test Real Interactions**: Measure actual user interaction patterns
4. **Consider Platform Differences**: Account for browser variations

## Troubleshooting

### Common Issues

1. **Flaky Screenshots**: Increase wait times or disable animations
2. **Accessibility Failures**: Check ARIA attributes and roles
3. **Performance Regressions**: Review recent component changes
4. **Chromatic Timeouts**: Optimize Storybook build process

### Debug Commands

```bash
# Run tests in headed mode
pnpm test:visual --headed

# Generate detailed reports
pnpm test:a11y --reporter=html

# Debug performance with traces
pnpm test:performance --trace=on
```

## Reporting

### Visual Reports

- Chromatic dashboard: Visual diffs and approval workflow
- Playwright HTML reports: Detailed test results with screenshots

### Accessibility Reports

- HTML report: Interactive accessibility violations
- JUnit XML: CI/CD integration format

### Performance Reports

- JSON metrics: Detailed performance data
- Console logs: Real-time performance feedback

## Maintenance

### Regular Tasks

1. **Update Baselines**: Approve legitimate visual changes in Chromatic
2. **Review Performance**: Monitor for regressions in component budgets
3. **Update Test Scenarios**: Add new devices and viewports as needed
4. **Accessibility Audits**: Regular WCAG compliance reviews

### Version Updates

When updating dependencies:

1. Run full test suite to catch regressions
2. Update performance baselines if needed
3. Review accessibility rule changes
4. Update browser versions in CI

## Resources

- [Chromatic Documentation](https://www.chromatic.com/docs/)
- [Playwright Testing](https://playwright.dev/docs/intro)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Performance Budgets](https://web.dev/performance-budgets-101/)
