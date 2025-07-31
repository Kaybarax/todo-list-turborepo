# Deployment Guide - @todo/ui-mobile

This guide covers the build and deployment process for the `@todo/ui-mobile` React Native component library.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Build Process](#build-process)
- [Package Publishing](#package-publishing)
- [Showcase Deployment](#showcase-deployment)
- [Validation](#validation)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying the package, ensure you have:

- Node.js 18+ installed
- pnpm 9+ installed
- npm account with publishing permissions
- React Native development environment set up
- Expo CLI installed (for showcase)
- Access to the monorepo

## Build Process

### 1. Clean Build

```bash
# Clean previous builds
pnpm run clean

# Install dependencies
pnpm install
```

### 2. TypeScript Validation

```bash
# Validate TypeScript configuration
pnpm run typecheck
```

### 3. Build Package

```bash
# Build the library
pnpm run build

# Or build just the library without TypeScript compilation
pnpm run build:lib
```

### Build Outputs

The build process generates the following files in the `dist/` directory:

```
dist/
├── index.js          # ES module build
├── index.cjs         # CommonJS build
├── index.d.ts        # TypeScript declarations
└── *.map            # Source maps
```

### Build Configuration

The build is configured through:

- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript compilation for build
- `tsconfig.dev.json` - TypeScript configuration for development
- `package.json` - Entry points and exports

## Package Publishing

### 1. Automated Validation

```bash
# Run comprehensive validation
pnpm run validate-packages
```

This validates:
- TypeScript configurations
- Build outputs
- Package imports
- Showcase applications
- Test coverage

### 2. Version Management

```bash
# Create a changeset
pnpm changeset

# Version packages
pnpm version-packages
```

### 3. Publishing

```bash
# Dry run (recommended first)
pnpm run publish-packages:dry-run

# Actual publishing
pnpm run publish-packages
```

### Manual Publishing

If you need to publish manually:

```bash
cd packages/ui-mobile

# Ensure you're logged in
npm whoami

# Build the package
pnpm run build

# Publish
npm publish
```

## Showcase Deployment

### Development

```bash
# Start Expo development server
pnpm run showcase:start

# Platform-specific development
pnpm run showcase:android  # Android
pnpm run showcase:ios      # iOS
pnpm run showcase:web      # Web
```

### Production Build

```bash
# Build for production
pnpm run showcase:build
```

### Deployment Options

#### Expo Application Services (EAS)

1. Install EAS CLI:
   ```bash
   npm install -g @expo/eas-cli
   ```

2. Configure EAS:
   ```bash
   cd packages/ui-mobile/showcase
   eas build:configure
   ```

3. Build for platforms:
   ```bash
   # Build for iOS
   eas build --platform ios
   
   # Build for Android
   eas build --platform android
   
   # Build for both
   eas build --platform all
   ```

4. Submit to app stores:
   ```bash
   eas submit --platform ios
   eas submit --platform android
   ```

#### Web Deployment

The showcase can also run as a web application:

```bash
# Build for web
cd packages/ui-mobile/showcase
expo build:web

# Deploy to static hosting
# The web-build directory contains the built web app
```

#### Expo Snack

Share the showcase as an Expo Snack:

1. Create a new Snack at https://snack.expo.dev
2. Copy the showcase code
3. Add the package as a dependency
4. Share the Snack URL

## Validation

### Pre-deployment Validation

Always run validation before deploying:

```bash
# Full validation suite
./scripts/validate-packages.sh

# Test package installation
./scripts/test-package-installation.sh
```

### Post-deployment Validation

After publishing, verify the package works:

```bash
# Create a test React Native project
npx react-native init TestApp --template react-native-template-typescript
cd TestApp

# Install your published package
npm install @todo/ui-mobile

# Install peer dependencies
npm install @ui-kitten/components @eva-design/eva react-native-vector-icons

# Test import
node -e "console.log(Object.keys(require('@todo/ui-mobile')))"
```

### Platform Testing

Test on multiple platforms:

```bash
# iOS Simulator
pnpm run showcase:ios

# Android Emulator
pnpm run showcase:android

# Web browser
pnpm run showcase:web
```

### Visual Regression Testing

```bash
# Run visual tests
pnpm run visual-test

# Run visual tests in CI
pnpm run visual-test:ci
```

## Troubleshooting

### Common Issues

#### Build Failures

**TypeScript Errors:**
```bash
# Check TypeScript configuration
pnpm run typecheck

# Fix common issues:
# - Ensure React Native types are installed
# - Check tsconfig.json for React Native settings
# - Verify lib directory structure
```

**Vite Build Errors:**
```bash
# Check Vite configuration
cat vite.config.ts

# Common fixes:
# - Verify React Native externals are listed
# - Check entry point exists
# - Ensure React Native plugin configuration
```

#### Publishing Issues

**React Native Compatibility:**
```bash
# Verify peer dependencies
npm ls --depth=0

# Check React Native version compatibility
# Ensure your package supports the target RN version
```

**Metro Bundler Issues:**
```bash
# Clear Metro cache
npx react-native start --reset-cache

# Check metro.config.js in consuming projects
```

#### Import Issues

**Module Resolution in React Native:**
```bash
# Verify package.json main field
cat package.json | jq '.main'

# Check if package works with Metro bundler
# Metro has different resolution rules than Node.js
```

**UI Kitten Integration:**
```bash
# Verify UI Kitten is properly configured
# Check ApplicationProvider setup in consuming app
# Ensure Eva theme is imported
```

**Vector Icons Issues:**
```bash
# Verify react-native-vector-icons is linked
# Check if fonts are properly installed
# iOS: Check Info.plist for font entries
# Android: Check fonts are in android/app/src/main/assets/fonts/
```

### Platform-Specific Issues

#### iOS Issues

```bash
# Clean iOS build
cd ios && rm -rf build && cd ..
npx react-native run-ios --reset-cache

# Check CocoaPods
cd ios && pod install && cd ..
```

#### Android Issues

```bash
# Clean Android build
cd android && ./gradlew clean && cd ..
npx react-native run-android --reset-cache

# Check Android dependencies
cd android && ./gradlew dependencies && cd ..
```

### Debug Mode

Enable debug mode for detailed information:

```bash
# React Native debug mode
npx react-native run-ios --verbose
npx react-native run-android --verbose

# Expo debug mode
EXPO_DEBUG=true expo start

# Vite debug mode
DEBUG=vite:* pnpm run build
```

### Getting Help

If you encounter issues:

1. Check the [troubleshooting section](#troubleshooting)
2. Review React Native and Expo documentation
3. Validate your environment meets [prerequisites](#prerequisites)
4. Run the validation scripts to identify issues
5. Check platform-specific setup requirements
6. Review the monorepo documentation for additional guidance

## Environment Variables

The following environment variables can be used:

```bash
# Chromatic project token for visual testing
CHROMATIC_PROJECT_TOKEN=your_token_here

# Custom npm registry
NPM_REGISTRY=https://your-registry.com

# Expo debug mode
EXPO_DEBUG=true

# React Native debug mode
RN_DEBUG=true

# Debug mode
DEBUG=vite:*
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy UI Mobile Package

on:
  push:
    branches: [main]
    paths: ['packages/ui-mobile/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9
          
      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
          
      - name: Install dependencies
        run: pnpm install
        
      - name: Validate packages
        run: pnpm run validate-packages
        
      - name: Build packages
        run: pnpm run build:packages
        
      - name: Test package installation
        run: pnpm run test:packages
        
      - name: Build showcase
        run: |
          cd packages/ui-mobile
          pnpm run showcase:build
          
      - name: Publish packages
        run: pnpm run publish-packages
        env:
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### EAS Build Integration

```yaml
name: EAS Build

on:
  push:
    branches: [main]
    paths: ['packages/ui-mobile/showcase/**']

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Setup Expo and EAS
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
          
      - name: Install dependencies
        run: |
          cd packages/ui-mobile/showcase
          npm install
          
      - name: Build on EAS
        run: |
          cd packages/ui-mobile/showcase
          eas build --platform all --non-interactive
```

## Package Distribution

### npm Registry

The package is published to npm and can be installed with:

```bash
npm install @todo/ui-mobile
# or
yarn add @todo/ui-mobile
# or
pnpm add @todo/ui-mobile
```

### Private Registry

For private distribution, configure your registry:

```bash
# Set registry
npm config set registry https://your-private-registry.com

# Or use .npmrc file
echo "registry=https://your-private-registry.com" > .npmrc
```

---

*This deployment guide should be updated as the build and deployment processes evolve.*