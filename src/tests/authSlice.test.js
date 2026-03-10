import authReducer, { setCred, logOut } from '../store/authSlice';

describe('authSlice reducer', () => {
	const initialState = {
		user: null,
		isAuthenticated: false,
	};

	it('should return the initial state', () => {
		expect(authReducer(undefined, { type: undefined })).toEqual(initialState);
	});

	it('should handle setCred (login)', () => {
		const user = { id: '1', name: 'Test User' };
		const nextState = authReducer(initialState, setCred(user));
		expect(nextState.user).toEqual(user);
		expect(nextState.isAuthenticated).toBe(true);
	});

	it('should handle logOut (logout)', () => {
		const loggedInState = {
			user: { id: '1', name: 'Test User' },
			isAuthenticated: true,
		};
		const nextState = authReducer(loggedInState, logOut());
		expect(nextState.user).toBeNull();
		expect(nextState.isAuthenticated).toBe(false);
	});
});
