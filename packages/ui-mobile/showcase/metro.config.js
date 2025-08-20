const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

// Path references
const projectRoot = __dirname; // packages/ui-mobile/showcase
const uiMobileRoot = path.resolve(projectRoot, '..'); // packages/ui-mobile
const packagesRoot = path.resolve(projectRoot, '..', '..'); // packages/
const servicesRoot = path.resolve(packagesRoot, 'services'); // packages/services
const monorepoRoot = path.resolve(packagesRoot, '..'); // repo root

const config = getDefaultConfig(projectRoot);

// Ensure Metro can resolve the local package and watch for changes in parent
config.watchFolders = Array.from(new Set([uiMobileRoot, servicesRoot, packagesRoot, monorepoRoot]));

config.resolver = config.resolver || {};
config.resolver.extraNodeModules = Object.assign({}, config.resolver.extraNodeModules, {
  '@todo/ui-mobile': path.resolve(uiMobileRoot, 'lib'),
  '@todo/services': path.resolve(servicesRoot, 'dist'),
  zod: path.resolve(monorepoRoot, 'node_modules', 'zod'),
});

config.resolver.nodeModulesPaths = Array.from(
  new Set([
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(uiMobileRoot, 'node_modules'),
    path.resolve(packagesRoot, 'node_modules'),
    path.resolve(monorepoRoot, 'node_modules'),
  ]),
);

module.exports = config;
