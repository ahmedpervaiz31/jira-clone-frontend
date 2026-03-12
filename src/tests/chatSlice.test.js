import { describe, test, expect, vi } from 'vitest';
import chatReducer, { addUserMessage, addBotMessage, clearChat, setBoardId, resetBoardId } from '../store/chatSlice';
import * as api from '../utils/api';

vi.mock('../utils/api', () => require('./__mocks__/fetchRagResponse'));

describe('chatSlice', () => {
  test('should add user message', () => {
    const action = addUserMessage('test');
    const result = chatReducer(undefined, action);
    expect(result.messages[result.messages.length - 1]).toEqual({ from: 'user', type: 'TEXT', content: 'test' });
  });

  test('should add bot message', () => {
    const action = addBotMessage({ type: 'TEXT', content: 'hello' });
    const result = chatReducer(undefined, action);
    expect(result.messages[result.messages.length - 1]).toEqual({ from: 'bot', type: 'TEXT', content: 'hello' });
  });

  test('should clear chat', () => {
    const preState = {
      messages: [
        { from: 'user', type: 'TEXT', content: 'test' },
        { from: 'bot', type: 'TEXT', content: 'hi' }
      ],
      loading: true,
      error: 'err',
      boardId: 'abc',
    };
    const action = clearChat();
    const result = chatReducer(preState, action);
    expect(result.messages).toEqual([
      { from: 'bot', type: 'TEXT', content: expect.any(String) }
    ]);
    expect(result.loading).toBe(false);
    expect(result.error).toBeNull();
  });

  test('should set board id', () => {
    const action = setBoardId('test');
    const result = chatReducer(undefined, action);
    expect(result.boardId).toBe('test');
  });

  test('should reset board id', () => {
    const preState = { ...chatReducer(undefined, { type: '' }), boardId: 'abc' };
    const action = resetBoardId();
    const result = chatReducer(preState, action);
    expect(result.boardId).toBeNull();
  });
});