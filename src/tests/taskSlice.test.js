
import taskReducer, { setTasksLocal } from '../store/taskSlice';
import { createTask, deleteTaskAsync, moveTaskAsync } from '../store/taskSlice';

describe('taskSlice reducer', () => {
	const initialState = {
		tasksByBoard: {},
		loading: false,
		error: null,
		tasksPage: {},
		tasksHasMore: {},
		tasksTotal: {},
		tasksLoadingByBoard: {},
	};

	it('setTasksLocal sets tasks for a board', () => {
		const action = setTasksLocal({
			boardId: 'b1',
			tasks: [
				{ id: 't1', title: 'Task 1' },
				{ id: 't2', title: 'Task 2' },
			],
			totals: { todo: 2 },
		});
		const nextState = taskReducer(initialState, action);
		expect(nextState.tasksByBoard['b1']).toEqual([
			{ id: 't1', title: 'Task 1' },
			{ id: 't2', title: 'Task 2' },
		]);
		expect(nextState.tasksTotal['b1']).toEqual({ todo: 2 });
	});

	it('createTask.fulfilled adds a new task to the correct board', () => {
		const prevState = {
			...initialState,
			tasksByBoard: { b1: [{ id: 't1', title: 'Task 1' }] },
		};
		const payload = {
			_id: 't2',
			title: 'Task 2',
			status: 'todo',
			boardId: 'b1',
		};
		const action = { type: createTask.fulfilled.type, payload };
		const nextState = taskReducer(prevState, action);
		expect(nextState.tasksByBoard['b1']).toHaveLength(2);
		expect(nextState.tasksByBoard['b1'][1]).toMatchObject({ id: 't2', title: 'Task 2', status: 'todo' });
	});

	it('deleteTaskAsync.fulfilled removes the task from all boards', () => {
		const prevState = {
			...initialState,
			tasksByBoard: {
				b1: [
					{ id: 't1', title: 'Task 1' },
					{ id: 't2', title: 'Task 2' },
				],
				b2: [
					{ id: 't2', title: 'Task 2' },
					{ id: 't3', title: 'Task 3' },
				],
			},
		};
		const action = { type: deleteTaskAsync.fulfilled.type, payload: 't2' };
		const nextState = taskReducer(prevState, action);
		expect(nextState.tasksByBoard['b1']).toEqual([{ id: 't1', title: 'Task 1' }]);
		expect(nextState.tasksByBoard['b2']).toEqual([{ id: 't3', title: 'Task 3' }]);
	});

	it('moveTaskAsync.fulfilled updates the status and order of the task', () => {
		const prevState = {
			...initialState,
			tasksByBoard: {
				b1: [
					{ id: 't1', title: 'Task 1', status: 'todo', order: 1 },
					{ id: 't2', title: 'Task 2', status: 'todo', order: 2 },
				],
			},
		};
		const payload = {
			_id: 't2',
			status: 'in-progress',
			order: 1,
			boardId: 'b1',
		};
		const action = { type: moveTaskAsync.fulfilled.type, payload };
		const nextState = taskReducer(prevState, action);
		expect(nextState.tasksByBoard['b1'][1]).toMatchObject({ id: 't2', status: 'in-progress', order: 1 });
	});
});
