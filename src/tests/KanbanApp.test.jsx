import React from 'react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import '@testing-library/jest-dom/vitest';
import KanbanApp from '../features/kanban/UI/KanbanApp';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), 
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

vi.mock('../../utils/socket', () => ({
  socket: {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
    connect: vi.fn(),
    connected: true,
  }
}));

vi.mock('../../utils/lexorank', () => ({
  getIntermediateRank: vi.fn(() => 'mocked-rank')
}));

vi.mock('../../utils/dependencyHelpers', () => ({
  areDependenciesReady: vi.fn().mockResolvedValue({ ready: true, blocking: [] })
}));

const mockStore = configureStore([thunk]);

const baseState = {
  auth: { user: { id: 'user1', name: 'Test User' } },
  board: {
    boards: [
      { id: 'b1', name: 'Board 1' },
      { id: 'b2', name: 'Board 2' }
    ],
    loading: false
  },
  users: {
    searchResults: [],
    loading: false,
    error: null
  },
  tasks: {
    loading: false,
    tasksPage: { b1: {} },
    tasksHasMore: { b1: {} },
    tasksTotal: { b1: {} },
    entities: {},
    ids: [],
    tasksByBoard: { b1: [] },
    tasksLoadingByBoard: { b1: {} },
  },
};

function renderWithProviders(ui, { route = '/kanban/b1', state = baseState } = {}) {
  const store = mockStore(state);
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/kanban/:kanbanId" element={ui} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}
describe('KanbanApp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders loading when boards are empty', () => {
    renderWithProviders(<KanbanApp />, {
      state: { 
        ...baseState, 
        board: { boards: [], loading: true },
        tasks: { ...baseState.tasks, loading: true } 
      },
    });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('renders not found when board does not exist', () => {
    renderWithProviders(<KanbanApp />, {
      route: '/kanban/doesnotexist',
    });
    expect(screen.getByText(/board not found/i)).toBeInTheDocument();
  });

  test('renders board UI when board exists', () => {
    renderWithProviders(<KanbanApp />);
    expect(screen.getByText('Board 1')).toBeInTheDocument();
  });
});