# UI Mobile Showcase

Interactive showcase application for the UI Mobile component library built with Expo React Native.

## Features

- **Drawer Navigation**: Easy navigation between component examples
- **Interactive Examples**: Live component demonstrations with real functionality
- **Component Documentation**: Comprehensive examples for each component
- **UI Kitten Integration**: Built on UI Kitten design system
- **Cross-Platform**: Runs on iOS, Android, and Web

## Components Showcased

- **Button**: Interactive buttons with variants, sizes, and states
- **Card**: Flexible container components with headers, content, and footers
- **Input**: Form inputs with validation and error states
- **Badge**: Status indicators with color variants
- **Avatar**: User avatars with images and initials
- **Switch**: Toggle switches for boolean values
- **Checkbox**: Multi-selection checkboxes with various states

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

### Running on Different Platforms

```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Web Browser
npm run web
```

## Project Structure

```
showcase/
├── App.tsx                 # Main app with navigation
├── app.json               # Expo configuration
├── src/
│   ├── screens/           # Component demonstration screens
│   │   ├── HomeScreen.tsx
│   │   ├── ButtonScreen.tsx
│   │   ├── CardScreen.tsx
│   │   ├── InputScreen.tsx
│   │   ├── BadgeScreen.tsx
│   │   ├── AvatarScreen.tsx
│   │   ├── SwitchScreen.tsx
│   │   └── CheckboxScreen.tsx
│   └── components/        # Shared showcase components
│       └── ComponentExample.tsx
└── assets/               # App icons and images
```

## Development

The showcase app imports components directly from the parent `lib` directory:

```typescript
import { Button, Card, Input, Badge, Avatar, Switch, Checkbox } from '@todo/ui-mobile';
```

This ensures that the showcase always reflects the current state of the component library.

## Building for Production

```bash
# Build for production
npm run build

# Build for specific platforms
expo build:ios
expo build:android
```

## Contributing

When adding new components to the library:

1. Create a new screen in `src/screens/`
2. Add the screen to the drawer navigation in `App.tsx`
3. Include comprehensive examples showing all component variants and states
4. Follow the existing pattern used in other screens

## Technologies Used

- **Expo**: React Native development platform
- **React Navigation**: Navigation library with drawer navigator
- **UI Kitten**: React Native UI library
- **Eva Design System**: Design system for UI Kitten
- **TypeScript**: Type-safe JavaScript development