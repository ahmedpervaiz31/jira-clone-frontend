import { vi } from 'vitest';

export const fetchRagResponse = vi.fn(async (message, options) => {
  if (message === 'error') {
    return { error: 'Mocked error' };
  }
  return { type: 'TEXT', content: `Mocked response to: ${message}` };
});
