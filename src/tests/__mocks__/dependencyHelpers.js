import { vi } from 'vitest';

export const areDependenciesReady = vi.fn(async (taskId, status) => ({
  ready: true,
  blocking: [],
}));
