import React from 'react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom'; // Added Router
import '@testing-library/jest-dom/vitest'; // Added matchers
import tasksReducer from '../store/taskSlice';
import boardsReducer from '../store/boardSlice';
import authReducer from '../store/authSlice';
import KanbanView from '../features/kanban/UI/KanbanView';

// FIX: Mock matchMedia for Ant Design components inside KanbanView
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

const columnsConfig = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

const tasks = [
  { id: 't1', title: 'Task 1', status: 'todo', order: 'a' },
  { id: 't2', title: 'Task 2', status: 'in_progress', order: 'b' },
  { id: 't3', title: 'Task 3', status: 'done', order: 'c' },
];

function renderWithProvider(ui) {
  const store = configureStore({
    reducer: {
      tasks: tasksReducer,
      boards: boardsReducer,
      auth: authReducer,
      // Mocking user search state used by AddTaskModal
      users: (state = { searchResults: [], loading: false }) => state,
    },
    preloadedState: {
      tasks: {
        tasksByBoard: { b1: tasks },
        tasksLoadingByBoard: { b1: {} },
        loading: false,
        tasksPage: { b1: {} },
        tasksHasMore: { b1: {} },
        tasksTotal: { b1: {} },
        entities: {},
        ids: [],
      },
      boards: { boards: [] },
      auth: { user: { id: 'user1', name: 'Test User' } },
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </Provider>
  );
}

describe('KanbanView', () => {
  let props;

  beforeEach(() => {
    props = {
      boardId: "b1",
      title: "Board Title",
      columnsConfig: columnsConfig,
      tasks: tasks,
      selectedTask: null,
      detailVisible: false,
      addVisible: false,
      addStatus: null,
      tasksTotal: { todo: 1, in_progress: 1, done: 1 },
      onAddTask: vi.fn(),
      onDeleteTask: vi.fn(),
      onOpenTaskDetail: vi.fn(),
      onCloseTaskDetail: vi.fn(),
      onOpenAddModal: vi.fn(),
      onCloseAddModal: vi.fn(),
      onDragEnd: vi.fn(),
      tasksPage: {},
      tasksHasMore: {},
      fetchMoreTasks: vi.fn(),
      tasksLoading: {},
      loading: false,
    };
  });

    test('renders columns and tasks', () => {
    renderWithProvider(<KanbanView {...props} />);
    
    expect(screen.getByText('Board Title')).toBeInTheDocument();
    
    expect(screen.getByText(/To Do/i)).toBeInTheDocument();
    expect(screen.getByText(/In Progress/i)).toBeInTheDocument();
    expect(screen.getByText(/Done/i)).toBeInTheDocument();
    
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

  test('calls fetchMoreTasks when Load more is clicked', () => {
    const fetchMoreTasks = vi.fn();
    renderWithProvider(
      <KanbanView 
        {...props} 
        tasksHasMore={{ todo: true }} 
        fetchMoreTasks={fetchMoreTasks} 
      />
    );
    
    const loadMoreBtn = screen.getByText('Load more');
    fireEvent.click(loadMoreBtn);
    expect(fetchMoreTasks).toHaveBeenCalledWith('todo');
  });
});