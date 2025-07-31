// Mock for clsx
export default function clsx(...args: any[]): string {
  return args
    .filter(Boolean)
    .map(arg => {
      if (typeof arg === 'string') return arg;
      if (typeof arg === 'object' && arg !== null) {
        return Object.keys(arg)
          .filter(key => arg[key])
          .join(' ');
      }
      return '';
    })
    .join(' ')
    .trim();
}

export { clsx };