// eslint.config.js
import { defineConfig } from 'eslint-define-config';

export default defineConfig({
  parserOptions: {
    ecmaVersion: 2021,
  },
  env: {
    es2021: true,
    node: true,
    browser: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    // Your custom rules
  },
});
