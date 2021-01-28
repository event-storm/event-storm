import { addMiddleware, createModel, publishModel } from '../../src';

describe('Addin a middleware', () => {
  test('middleware must be fired on model change', () => {
    const middleware = jest.fn();
    const example = createModel('start');

    addMiddleware(middleware);
    publishModel(example, 'final');

    expect(middleware.mock.calls.length).toBe(1);
  });


  test('middleware must be fired on model change', () => {
    const middleware1 = jest.fn();
    const middleware2 = jest.fn();
    const example = createModel('start');

    addMiddleware(middleware1, middleware2);
    publishModel(example, 'final');

    expect(middleware1.mock.calls.length).toBe(1);
    expect(middleware2.mock.calls.length).toBe(1);
  });

  test('middleware must run before subscribe callback fires', () => {
    const callback = jest.fn();
    const middleware = jest.fn(() => {
      expect(middleware.mock.calls.length - callback.mock.calls.length).toBe(1);
    });
    const example = createModel('start');

    example.subscribe(callback);
    addMiddleware(middleware);
    publishModel(example, 'final');
    expect(middleware.mock.calls.length).toBe(1);
  });

  test('arguments must match', () => {
    const initialValue = 'start';
    const finalValue = 'final';
    const modelOptions = {};
    const middleware = jest.fn();
    const example = createModel(initialValue);

    addMiddleware(middleware);
    publishModel(example, finalValue);

    expect(middleware.mock.calls[0][0]).toBe(example.event);
    expect(middleware.mock.calls[0][2]).toBe(initialValue);
    expect(middleware.mock.calls[0][3]).toBe(finalValue);
    expect(middleware.mock.calls[0][4]).toBe(undefined);
  });
});
