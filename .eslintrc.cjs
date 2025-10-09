module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  env: { browser: true, es2022: true },
  settings: {
    react: { version: 'detect' },
    'import/resolver': { typescript: { project: './tsconfig.json' } },
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'import', 'unused-imports'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'eslint-config-prettier',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'unused-imports/no-unused-imports': 'error',
    'import/order': [
      'warn',
      {
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
      },
    ],
    'import/no-duplicates': 'error',
    'import/newline-after-import': ['warn', { count: 1 }],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'import/no-unresolved': ['error', { ignore: ['^/'] }],
  },
  ignorePatterns: ['dist', 'build', 'node_modules'],
  overrides: [
    {
      files: ['vite.config.*', 'eslint.config.*', 'postcss.config.*', 'scripts/**/*.*', '*.cjs','*.mjs'],
      env: { node: true },
      parserOptions: { project: null },
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
};