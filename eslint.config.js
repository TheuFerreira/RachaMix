import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/**', '.angular/**', 'node_modules/**']
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts', 'tests/**/*.mjs'],
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error'
    }
  },
  {
    files: ['src/app/app.component.ts', 'src/app/pages/results/results-page.component.ts'],
    rules: {
      '@typescript-eslint/consistent-type-imports': 'off'
    }
  }
);
