const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const figmaPlugin = require('@figma/eslint-plugin-figma-plugins');

module.exports = tseslint.config(
  { ignores: ['code.js', 'code.js.map', 'node_modules/**', 'dist/**', 'eslint.config.cjs'] },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    plugins: { '@figma/figma-plugins': figmaPlugin },
    languageOptions: {
      globals: { figma: 'readonly', __html__: 'readonly' },
      parserOptions: { project: './tsconfig.json', tsconfigRootDir: __dirname },
    },
    rules: {
      ...figmaPlugin.configs.recommended.rules,
      // TypeScript handles ambient API names and type-only references.
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: { globals: { process: 'readonly', console: 'readonly' } },
  },
);
