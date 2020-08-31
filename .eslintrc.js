module.exports = {
  root: true,
  env: {
    es6: true
  },
  extends: [
    '@react-native-community',
    'plugin:react/recommended',
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: [
    'react',
    '@typescript-eslint'
  ],
  rules: {
    'react/prop-types': 'off',

    // fix false positive on types
    '@typescript-eslint/no-unused-vars': [2, { args: 'none' }],

    // fix false positive for safe navigation operator
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-expressions': 2
  }
}
