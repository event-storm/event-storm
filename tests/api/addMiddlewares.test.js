import { addMiddlewares, createModel, publishModel } from 'src';

describe('Adding a middleware', () => {
  test('middleware must be fired on model change', () => {
    const middleware = jest.fn();
    const example = createModel('start');

    addMiddlewares(middleware);
    publishModel(example, 'final');

    expect(middleware).toBeCalledTimes(1);
  });


  test('middleware must be fired on model change', () => {
    const middleware1 = jest.fn();
    const middleware2 = jest.fn();
    const example = createModel('start');

    addMiddlewares(middleware1, middleware2);
    publishModel(example, 'final');

    expect(middleware1).toBeCalledTimes(1);
    expect(middleware2).toBeCalledTimes(1);
  });

  test('middleware must run before subscribe callback fires', () => {
    const callback = jest.fn();
    const middleware = jest.fn(() => {
      expect(middleware.mock.calls.length - callback.mock.calls.length).toBe(1);
    });
    const example = createModel('start');

    example.subscribe(callback);
    addMiddlewares(middleware);
    publishModel(example, 'final');
    expect(middleware).toBeCalledTimes(1);
  });

  test('arguments must match', () => {
    const initialValue = 'start';
    const finalValue = 'final';
    const modelOptions = {};
    const middleware = jest.fn();
    const example = createModel(initialValue);

    addMiddlewares(middleware);
    publishModel(example, finalValue);

    expect(middleware).lastCalledWith(initialValue, finalValue, { model: example });
  });
});
