import {
  isDefined,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isArray,
  isFunction,
  isNull,
  isUndefined,
  isNullish,
  isNonEmptyString,
  isPositiveNumber,
  isNonNegativeNumber,
  isInteger,
  isDate,
  isPromise,
  isError,
  assertNever,
  invariant,
  hasProperty,
  hasPropertyOfType,
  isNonEmptyArray,
  isArrayOf,
  isValidUrl,
  isValidEmail,
} from '../type-guards';

describe('Type Guard Utilities', () => {
  describe('isDefined', () => {
    it('should return true for defined values', () => {
      expect(isDefined('string')).toBe(true);
      expect(isDefined(0)).toBe(true);
      expect(isDefined(false)).toBe(true);
      expect(isDefined({})).toBe(true);
      expect(isDefined([])).toBe(true);
    });

    it('should return false for null and undefined', () => {
      expect(isDefined(null)).toBe(false);
      expect(isDefined(undefined)).toBe(false);
    });
  });

  describe('isString', () => {
    it('should return true for strings', () => {
      expect(isString('hello')).toBe(true);
      expect(isString('')).toBe(true);
      expect(isString('123')).toBe(true);
    });

    it('should return false for non-strings', () => {
      expect(isString(123)).toBe(false);
      expect(isString(true)).toBe(false);
      expect(isString({})).toBe(false);
      expect(isString([])).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(undefined)).toBe(false);
    });
  });

  describe('isNumber', () => {
    it('should return true for valid numbers', () => {
      expect(isNumber(123)).toBe(true);
      expect(isNumber(0)).toBe(true);
      expect(isNumber(-123)).toBe(true);
      expect(isNumber(3.14)).toBe(true);
      expect(isNumber(Infinity)).toBe(true);
      expect(isNumber(-Infinity)).toBe(true);
    });

    it('should return false for NaN and non-numbers', () => {
      expect(isNumber(NaN)).toBe(false);
      expect(isNumber('123')).toBe(false);
      expect(isNumber(true)).toBe(false);
      expect(isNumber({})).toBe(false);
      expect(isNumber([])).toBe(false);
      expect(isNumber(null)).toBe(false);
      expect(isNumber(undefined)).toBe(false);
    });
  });

  describe('isBoolean', () => {
    it('should return true for booleans', () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
    });

    it('should return false for non-booleans', () => {
      expect(isBoolean(1)).toBe(false);
      expect(isBoolean(0)).toBe(false);
      expect(isBoolean('true')).toBe(false);
      expect(isBoolean('false')).toBe(false);
      expect(isBoolean({})).toBe(false);
      expect(isBoolean([])).toBe(false);
      expect(isBoolean(null)).toBe(false);
      expect(isBoolean(undefined)).toBe(false);
    });
  });

  describe('isObject', () => {
    it('should return true for plain objects', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ key: 'value' })).toBe(true);
      expect(isObject(new Date())).toBe(true);
      expect(isObject(new Error())).toBe(true);
    });

    it('should return false for non-objects, null, and arrays', () => {
      expect(isObject(null)).toBe(false);
      expect(isObject([])).toBe(false);
      expect(isObject('string')).toBe(false);
      expect(isObject(123)).toBe(false);
      expect(isObject(true)).toBe(false);
      expect(isObject(undefined)).toBe(false);
    });
  });

  describe('isArray', () => {
    it('should return true for arrays', () => {
      expect(isArray([])).toBe(true);
      expect(isArray([1, 2, 3])).toBe(true);
      expect(isArray(new Array())).toBe(true);
    });

    it('should return false for non-arrays', () => {
      expect(isArray({})).toBe(false);
      expect(isArray('string')).toBe(false);
      expect(isArray(123)).toBe(false);
      expect(isArray(true)).toBe(false);
      expect(isArray(null)).toBe(false);
      expect(isArray(undefined)).toBe(false);
    });
  });

  describe('isFunction', () => {
    it('should return true for functions', () => {
      expect(isFunction(() => {})).toBe(true);
      expect(isFunction(() => {})).toBe(true);
      expect(isFunction(async () => {})).toBe(true);
      expect(isFunction(Date)).toBe(true);
      expect(isFunction(Array.isArray)).toBe(true);
    });

    it('should return false for non-functions', () => {
      expect(isFunction({})).toBe(false);
      expect(isFunction([])).toBe(false);
      expect(isFunction('string')).toBe(false);
      expect(isFunction(123)).toBe(false);
      expect(isFunction(true)).toBe(false);
      expect(isFunction(null)).toBe(false);
      expect(isFunction(undefined)).toBe(false);
    });
  });

  describe('isNull', () => {
    it('should return true for null', () => {
      expect(isNull(null)).toBe(true);
    });

    it('should return false for non-null values', () => {
      expect(isNull(undefined)).toBe(false);
      expect(isNull(0)).toBe(false);
      expect(isNull('')).toBe(false);
      expect(isNull(false)).toBe(false);
      expect(isNull({})).toBe(false);
      expect(isNull([])).toBe(false);
    });
  });

  describe('isUndefined', () => {
    it('should return true for undefined', () => {
      expect(isUndefined(undefined)).toBe(true);
    });

    it('should return false for non-undefined values', () => {
      expect(isUndefined(null)).toBe(false);
      expect(isUndefined(0)).toBe(false);
      expect(isUndefined('')).toBe(false);
      expect(isUndefined(false)).toBe(false);
      expect(isUndefined({})).toBe(false);
      expect(isUndefined([])).toBe(false);
    });
  });

  describe('isNullish', () => {
    it('should return true for null and undefined', () => {
      expect(isNullish(null)).toBe(true);
      expect(isNullish(undefined)).toBe(true);
    });

    it('should return false for non-nullish values', () => {
      expect(isNullish(0)).toBe(false);
      expect(isNullish('')).toBe(false);
      expect(isNullish(false)).toBe(false);
      expect(isNullish({})).toBe(false);
      expect(isNullish([])).toBe(false);
    });
  });

  describe('isNonEmptyString', () => {
    it('should return true for non-empty strings', () => {
      expect(isNonEmptyString('hello')).toBe(true);
      expect(isNonEmptyString(' ')).toBe(true);
      expect(isNonEmptyString('123')).toBe(true);
    });

    it('should return false for empty strings and non-strings', () => {
      expect(isNonEmptyString('')).toBe(false);
      expect(isNonEmptyString(123)).toBe(false);
      expect(isNonEmptyString(true)).toBe(false);
      expect(isNonEmptyString({})).toBe(false);
      expect(isNonEmptyString([])).toBe(false);
      expect(isNonEmptyString(null)).toBe(false);
      expect(isNonEmptyString(undefined)).toBe(false);
    });
  });

  describe('isPositiveNumber', () => {
    it('should return true for positive numbers', () => {
      expect(isPositiveNumber(1)).toBe(true);
      expect(isPositiveNumber(3.14)).toBe(true);
      expect(isPositiveNumber(Infinity)).toBe(true);
    });

    it('should return false for zero, negative numbers, and non-numbers', () => {
      expect(isPositiveNumber(0)).toBe(false);
      expect(isPositiveNumber(-1)).toBe(false);
      expect(isPositiveNumber(-Infinity)).toBe(false);
      expect(isPositiveNumber(NaN)).toBe(false);
      expect(isPositiveNumber('1')).toBe(false);
      expect(isPositiveNumber(true)).toBe(false);
    });
  });

  describe('isNonNegativeNumber', () => {
    it('should return true for non-negative numbers', () => {
      expect(isNonNegativeNumber(0)).toBe(true);
      expect(isNonNegativeNumber(1)).toBe(true);
      expect(isNonNegativeNumber(3.14)).toBe(true);
      expect(isNonNegativeNumber(Infinity)).toBe(true);
    });

    it('should return false for negative numbers and non-numbers', () => {
      expect(isNonNegativeNumber(-1)).toBe(false);
      expect(isNonNegativeNumber(-Infinity)).toBe(false);
      expect(isNonNegativeNumber(NaN)).toBe(false);
      expect(isNonNegativeNumber('0')).toBe(false);
      expect(isNonNegativeNumber(true)).toBe(false);
    });
  });

  describe('isInteger', () => {
    it('should return true for integers', () => {
      expect(isInteger(0)).toBe(true);
      expect(isInteger(1)).toBe(true);
      expect(isInteger(-1)).toBe(true);
      expect(isInteger(100)).toBe(true);
    });

    it('should return false for non-integers and non-numbers', () => {
      expect(isInteger(3.14)).toBe(false);
      expect(isInteger(Infinity)).toBe(false);
      expect(isInteger(-Infinity)).toBe(false);
      expect(isInteger(NaN)).toBe(false);
      expect(isInteger('1')).toBe(false);
      expect(isInteger(true)).toBe(false);
    });
  });

  describe('isDate', () => {
    it('should return true for valid Date objects', () => {
      expect(isDate(new Date())).toBe(true);
      expect(isDate(new Date('2023-01-01'))).toBe(true);
    });

    it('should return false for invalid dates and non-dates', () => {
      expect(isDate(new Date('invalid'))).toBe(false);
      expect(isDate('2023-01-01')).toBe(false);
      expect(isDate(1672531200000)).toBe(false);
      expect(isDate({})).toBe(false);
      expect(isDate(null)).toBe(false);
      expect(isDate(undefined)).toBe(false);
    });
  });

  describe('isPromise', () => {
    it('should return true for Promise objects', () => {
      expect(isPromise(Promise.resolve())).toBe(true);
      expect(isPromise(Promise.reject().catch(() => {}))).toBe(true);
      expect(isPromise(new Promise(() => {}))).toBe(true);
    });

    it('should return true for thenable objects', () => {
      const thenable = {
        then: () => {},
        catch: () => {},
      };
      expect(isPromise(thenable)).toBe(true);
    });

    it('should return false for non-promises', () => {
      expect(isPromise({})).toBe(false);
      expect(isPromise({ then: 'not a function' })).toBe(false);
      expect(isPromise('promise')).toBe(false);
      expect(isPromise(null)).toBe(false);
      expect(isPromise(undefined)).toBe(false);
    });
  });

  describe('isError', () => {
    it('should return true for Error objects', () => {
      expect(isError(new Error())).toBe(true);
      expect(isError(new TypeError())).toBe(true);
      expect(isError(new ReferenceError())).toBe(true);
    });

    it('should return false for non-Error objects', () => {
      expect(isError({ message: 'error' })).toBe(false);
      expect(isError('error')).toBe(false);
      expect(isError({})).toBe(false);
      expect(isError(null)).toBe(false);
      expect(isError(undefined)).toBe(false);
    });
  });

  describe('assertNever', () => {
    it('should throw an error with default message', () => {
      expect(() => assertNever('unexpected' as never)).toThrow('Unexpected value: unexpected');
    });

    it('should throw an error with custom message', () => {
      expect(() => assertNever('value' as never, 'Custom error')).toThrow('Custom error: value');
    });
  });

  describe('invariant', () => {
    it('should not throw when condition is truthy', () => {
      expect(() => invariant(true, 'Should not throw')).not.toThrow();
      expect(() => invariant(1, 'Should not throw')).not.toThrow();
      expect(() => invariant('string', 'Should not throw')).not.toThrow();
    });

    it('should throw when condition is falsy', () => {
      expect(() => invariant(false, 'Should throw')).toThrow('Should throw');
      expect(() => invariant(0, 'Should throw')).toThrow('Should throw');
      expect(() => invariant('', 'Should throw')).toThrow('Should throw');
      expect(() => invariant(null, 'Should throw')).toThrow('Should throw');
      expect(() => invariant(undefined, 'Should throw')).toThrow('Should throw');
    });
  });

  describe('hasProperty', () => {
    it('should return true when object has the property', () => {
      const obj = { name: 'test', age: 25 };
      expect(hasProperty(obj, 'name')).toBe(true);
      expect(hasProperty(obj, 'age')).toBe(true);
    });

    it('should return false when object does not have the property', () => {
      const obj = { name: 'test' };
      expect(hasProperty(obj, 'age')).toBe(false);
    });

    it('should return false for non-objects', () => {
      expect(hasProperty('string', 'length')).toBe(false);
      expect(hasProperty(null, 'prop')).toBe(false);
      expect(hasProperty(undefined, 'prop')).toBe(false);
    });
  });

  describe('hasPropertyOfType', () => {
    it('should return true when object has property of correct type', () => {
      const obj = { name: 'test', age: 25 };
      expect(hasPropertyOfType(obj, 'name', isString)).toBe(true);
      expect(hasPropertyOfType(obj, 'age', isNumber)).toBe(true);
    });

    it('should return false when object has property of wrong type', () => {
      const obj = { name: 'test', age: 25 };
      expect(hasPropertyOfType(obj, 'name', isNumber)).toBe(false);
      expect(hasPropertyOfType(obj, 'age', isString)).toBe(false);
    });

    it('should return false when object does not have the property', () => {
      const obj = { name: 'test' };
      expect(hasPropertyOfType(obj, 'age', isNumber)).toBe(false);
    });
  });

  describe('isNonEmptyArray', () => {
    it('should return true for non-empty arrays', () => {
      expect(isNonEmptyArray([1])).toBe(true);
      expect(isNonEmptyArray([1, 2, 3])).toBe(true);
      expect(isNonEmptyArray(['a', 'b'])).toBe(true);
    });

    it('should return false for empty arrays and non-arrays', () => {
      expect(isNonEmptyArray([])).toBe(false);
      expect(isNonEmptyArray('array')).toBe(false);
      expect(isNonEmptyArray({})).toBe(false);
      expect(isNonEmptyArray(null)).toBe(false);
      expect(isNonEmptyArray(undefined)).toBe(false);
    });
  });

  describe('isArrayOf', () => {
    it('should return true when all elements match the type guard', () => {
      expect(isArrayOf([1, 2, 3], isNumber)).toBe(true);
      expect(isArrayOf(['a', 'b', 'c'], isString)).toBe(true);
      expect(isArrayOf([true, false], isBoolean)).toBe(true);
      expect(isArrayOf([], isString)).toBe(true); // empty array
    });

    it('should return false when some elements do not match', () => {
      expect(isArrayOf([1, '2', 3], isNumber)).toBe(false);
      expect(isArrayOf(['a', 2, 'c'], isString)).toBe(false);
    });

    it('should return false for non-arrays', () => {
      expect(isArrayOf('string', isString)).toBe(false);
      expect(isArrayOf({}, isObject)).toBe(false);
      expect(isArrayOf(null, isNull)).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('should return true for valid URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://localhost:3000')).toBe(true);
      expect(isValidUrl('ftp://files.example.com')).toBe(true);
      expect(isValidUrl('mailto:test@example.com')).toBe(true);
    });

    it('should return false for invalid URLs and non-strings', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('http://')).toBe(false);
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl(123)).toBe(false);
      expect(isValidUrl(null)).toBe(false);
      expect(isValidUrl(undefined)).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.org')).toBe(true);
    });

    it('should return false for invalid email addresses and non-strings', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user@domain')).toBe(false);
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail(123)).toBe(false);
      expect(isValidEmail(null)).toBe(false);
      expect(isValidEmail(undefined)).toBe(false);
    });
  });
});
