# Mobile App Theme Architecture

## Overview

The mobile app now uses a **unified theme system** via `EnhancedThemeProvider` from `@todo/ui-mobile`, which integrates:

- Eva Design System (via UI Kitten)
- Custom design tokens
- Legacy theme compatibility

## Previous Architecture (Removed)

- ❌ Custom `ThemeProvider` from `src/providers/ThemeProvider.tsx`
- ❌ Separate `EvaProvider` wrapper
- ❌ Manual theme bridging between systems
- ❌ Inconsistent theme access across components

## Current Architecture (Unified)

### Provider Setup

```tsx
<EnhancedThemeProvider initialTheme="light" initialEvaTheme="light" followSystemTheme={true} enableEvaDesign={true}>
  {/* App content */}
</EnhancedThemeProvider>
```

### Theme Access Patterns

**For UI Components:**

```tsx
import { useEnhancedTheme } from '@todo/ui-mobile';

const { theme, themeName, evaTheme, toggleTheme } = useEnhancedTheme();
```

**For Design Tokens:**

```tsx
import { useDesignTokens } from '../hooks/useDesignTokens';

const tokens = useDesignTokens();
// Access: tokens.colors, tokens.spacing, tokens.typography, etc.
```

## Benefits

1. **Single Source of Truth**: One provider manages all theming
2. **Automatic Sync**: Eva theme and legacy theme stay synchronized
3. **Dark Mode Support**: Proper dark/light theme switching with correct colors
4. **Persistent**: Theme preference saved to AsyncStorage
5. **System Theme Following**: Respects device theme settings

## Components Updated

- ✅ `app/_layout.tsx` - Uses EnhancedThemeProvider
- ✅ `app/index.tsx` - Uses useEnhancedTheme
- ✅ `src/hooks/useDesignTokens.ts` - Uses useEnhancedTheme
- ✅ All `@todo/ui-mobile` components (Card, Button, Text, etc.)

## Migration Notes

- Removed `src/providers/ThemeProvider.tsx` dependency
- `themeName` replaces `themeMode` (both are 'light' | 'dark')
- `toggleTheme()` works the same way
- All theme token access patterns remain unchanged
