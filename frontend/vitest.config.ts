import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['components/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['tests/e2e/**', 'playwright.config.ts'],
    environment: 'jsdom',
  },
});
