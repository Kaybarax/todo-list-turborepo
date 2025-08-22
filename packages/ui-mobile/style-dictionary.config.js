const StyleDictionary = require('style-dictionary');

// Custom transforms for Eva Design compatibility
StyleDictionary.registerTransform({
  name: 'eva/color',
  type: 'value',
  matcher: token => token.type === 'color',
  transformer: token => {
    return token.value;
  },
});

StyleDictionary.registerTransform({
  name: 'eva/size',
  type: 'value',
  matcher: token => token.type === 'dimension',
  transformer: token => {
    return typeof token.value === 'string' ? token.value : `${token.value}px`;
  },
});

StyleDictionary.registerTransform({
  name: 'eva/fontWeight',
  type: 'value',
  matcher: token => token.type === 'fontWeight',
  transformer: token => {
    return token.value.toString();
  },
});

// Custom transform group for Eva Design
StyleDictionary.registerTransformGroup({
  name: 'eva-design',
  transforms: ['attribute/cti', 'name/cti/kebab', 'eva/color', 'eva/size', 'eva/fontWeight'],
});

// Custom format for Eva Design themes
StyleDictionary.registerFormat({
  name: 'eva-theme',
  formatter: function (dictionary) {
    const tokens = dictionary.allTokens;
    const theme = {};

    tokens.forEach(token => {
      // Convert token path to Eva Design naming convention
      const evaName = token.path.join('-');
      theme[evaName] = token.value;
    });

    return `export const evaTheme = ${JSON.stringify(theme, null, 2)};`;
  },
});

// Custom format for TypeScript types
StyleDictionary.registerFormat({
  name: 'typescript/eva-theme-types',
  formatter: function (dictionary) {
    const tokens = dictionary.allTokens;
    const typeDefinitions = [];

    tokens.forEach(token => {
      const evaName = token.path.join('-');
      typeDefinitions.push(`  '${evaName}': string;`);
    });

    return `export interface EvaTheme {
${typeDefinitions.join('\n')}
}

export interface ThemeTokens extends EvaTheme {}`;
  },
});

module.exports = {
  source: ['tokens/source/**/*.json'],
  platforms: {
    'eva-design': {
      transformGroup: 'eva-design',
      buildPath: 'tokens/build/',
      files: [
        {
          destination: 'eva-theme.ts',
          format: 'eva-theme',
          filter: token => token.filePath.includes('global') || token.filePath.includes('semantic'),
        },
        {
          destination: 'eva-theme-types.ts',
          format: 'typescript/eva-theme-types',
          filter: token => token.filePath.includes('global') || token.filePath.includes('semantic'),
        },
      ],
    },
    'react-native': {
      transformGroup: 'react-native',
      buildPath: 'tokens/build/',
      files: [
        {
          destination: 'tokens.ts',
          format: 'javascript/es6',
          filter: token => !token.filePath.includes('web'),
        },
        {
          destination: 'tokens.d.ts',
          format: 'typescript/es6-declarations',
          filter: token => !token.filePath.includes('web'),
        },
      ],
    },
  },
};
