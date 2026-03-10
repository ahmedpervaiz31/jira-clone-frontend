import boardReducer, { removeBoardLocal } from '../store/boardSlice';
import { fetchBoards, createBoard, deleteBoardAsync } from '../store/boardSlice';

describe('boardSlice reducer', () => {
	const initialState = {
		boards: [],
		loading: false,
		error: null,
		page: 1,
		hasMore: true,
		total: 0,
	};

	it('fetchBoards.fulfilled populates boards with payload', () => {
		const payload = {
			items: [
				{ _id: '1', name: 'Board 1', key: 'B1', flag: 'public', members: [] },
				{ _id: '2', name: 'Board 2', key: 'B2', flag: 'private', members: ['u1'] },
			],
			total: 2,
			page: 1,
			hasMore: false,
		};
		const action = { type: fetchBoards.fulfilled.type, payload };
		const nextState = boardReducer(initialState, action);
		expect(nextState.boards).toEqual([
			{ id: '1', name: 'Board 1', key: 'B1', flag: 'public', members: [] },
			{ id: '2', name: 'Board 2', key: 'B2', flag: 'private', members: ['u1'] },
		]);
		expect(nextState.total).toBe(2);
		expect(nextState.page).toBe(1);
		expect(nextState.hasMore).toBe(false);
		expect(nextState.loading).toBe(false);
	});

	it('createBoard.fulfilled appends new board to boards', () => {
		const prevState = {
			...initialState,
			boards: [
				{ id: '1', name: 'Board 1', key: 'B1', flag: 'public', members: [] },
			],
		};
		const payload = { _id: '2', name: 'Board 2', key: 'B2', flag: 'private', members: ['u1'] };
		const action = { type: createBoard.fulfilled.type, payload };
		const nextState = boardReducer(prevState, action);
		expect(nextState.boards).toEqual([
			{ id: '1', name: 'Board 1', key: 'B1', flag: 'public', members: [] },
			{ id: '2', name: 'Board 2', key: 'B2', flag: 'private', members: ['u1'] },
		]);
	});

	it('removeBoardLocal removes board by ID', () => {
		const prevState = {
			...initialState,
			boards: [
				{ id: '1', name: 'Board 1', key: 'B1', flag: 'public', members: [] },
				{ id: '2', name: 'Board 2', key: 'B2', flag: 'private', members: ['u1'] },
			],
		};
		const nextState = boardReducer(prevState, removeBoardLocal('1'));
		expect(nextState.boards).toEqual([
			{ id: '2', name: 'Board 2', key: 'B2', flag: 'private', members: ['u1'] },
		]);
	});

	it('deleteBoardAsync.fulfilled removes board by ID after API confirms', () => {
		const prevState = {
			...initialState,
			boards: [
				{ id: '1', name: 'Board 1', key: 'B1', flag: 'public', members: [] },
				{ id: '2', name: 'Board 2', key: 'B2', flag: 'private', members: ['u1'] },
			],
		};
		const action = { type: deleteBoardAsync.fulfilled.type, payload: '2' };
		const nextState = boardReducer(prevState, action);
		expect(nextState.boards).toEqual([
			{ id: '1', name: 'Board 1', key: 'B1', flag: 'public', members: [] },
		]);
	});
});
