import { Ref, MutableRefObject } from 'react';

/**
 * Converts a truthy value to 'true' for aria attributes, otherwise undefined.
 */
export function ariaAttr(value?: boolean | null): 'true' | undefined {
  return value ? 'true' : undefined;
}

/**
 * Converts a truthy value to '' for data attributes, otherwise undefined.
 */
export function dataAttr(value?: boolean | null): '' | undefined {
  return value ? '' : undefined;
}

/**
 * Merge multiple React refs (callback or object refs) into a single ref callback.
 */
export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (value: T) => {
    refs.forEach(ref => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(value);
      } else {
        try {
          (ref as MutableRefObject<T | null>).current = value;
        } catch {
          /* ignore */
        }
      }
    });
  };
}

/**
 * Determines if an element is focusable.
 */
export function isFocusable(el: HTMLElement | null): boolean {
  if (!el) return false;
  const focusableSelectors = [
    'a[href]',
    'area[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    'iframe',
    'object',
    'embed',
    '*[tabindex]',
  ];
  if ((el as any).disabled) return false;
  const nodeName = el.nodeName.toLowerCase();
  if (nodeName === 'input' && (el as HTMLInputElement).type === 'hidden') return false;
  const style = window.getComputedStyle(el);
  if (style.visibility === 'hidden' || style.display === 'none') return false;
  return focusableSelectors.some(selector => el.matches(selector));
}
