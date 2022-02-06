import { addMiddlewares, createModel, createStorm } from 'src';

describe('Adding a middleware', () => {
  test('middleware must be fired on model change', () => {
    const middleware = jest.fn();
    const example = createModel('start');

    addMiddlewares({ example })(middleware);
    example.publish('final');

    expect(middleware).toBeCalledTimes(1);
  });


  test('middlewares must be fired on model change', () => {
    const middleware1 = jest.fn();
    const middleware2 = jest.fn();
    const example = createModel('start');

    addMiddlewares({ example })(middleware1, middleware2);
    example.publish('final');

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
    addMiddlewares({ example })(middleware);
    example.publish('final');
    expect(middleware).toBeCalledTimes(1);
  });

  test('arguments must match', () => {
    const initialValue = 'start';
    const finalValue = 'final';
    const modelOptions = {};
    const middleware = jest.fn();
    const example = createModel(initialValue);

    addMiddlewares({ example })(middleware);
    example.publish(finalValue);

    expect(middleware).lastCalledWith({ example: initialValue }, { example: finalValue }, modelOptions);
  });
});

describe('Using middlewares with storm', () => {
  test('storm basic usage', () => {
    const initialState = {
      age: 30,
      name: 'Bob',
    };
    const finalState = {
      age: 30,
      name: 'Jane',
    };

    const publishConfigs = {
      fromMiddleware: true,
    }
    const storm = createStorm(initialState);
    const middleware = jest.fn();

    addMiddlewares(storm.models)(middleware);
    storm.publish(finalState, publishConfigs);
    
    expect(middleware).toBeCalledTimes(1);
    expect(middleware).lastCalledWith(initialState, finalState, publishConfigs);
  });
});
