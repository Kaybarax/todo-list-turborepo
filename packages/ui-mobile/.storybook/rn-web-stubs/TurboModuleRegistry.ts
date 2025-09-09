// Lightweight stub for TurboModuleRegistry for web Storybook environment.
// Provides minimal get/getEnforcing interface returning undefined or throwing if enforcing.
export const TurboModuleRegistry = {
  get(_: string) {
    return undefined;
  },
  getEnforcing(name: string) {
    throw new Error(`TurboModule '${name}' not available in web Storybook stub.`);
  },
};
export default TurboModuleRegistry;
