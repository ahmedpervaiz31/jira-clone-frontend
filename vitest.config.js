import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true, 
    setupFiles: [],
    include: ['src/tests/**/*.{test,spec}.{js,jsx,ts,tsx}'],
  },
});
