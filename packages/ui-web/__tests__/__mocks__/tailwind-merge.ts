// Mock for tailwind-merge
export function twMerge(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export default twMerge;
