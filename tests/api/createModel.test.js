import { createModel } from 'src';

describe('Creating a Model', () => {
  test('model object matches pattern', () => {
    const model = createModel(true);

    expect(typeof model).toBe('object');
    expect(typeof model.getState).toBe('function');
    expect(typeof model.subscribe).toBe('function');
  });

  test('Get state must give the default state, when nothing published', () => {
    const model = createModel(1);

    expect(model.getState()).toBe(1);
  });

  test('State must be updated after publishment(primitive value)', () => {
    const initialValue = {};
    const nextValue = { user: 'Bob' };
    const model = createModel(initialValue);

    expect(model.getState()).toBe(initialValue);

    model.publish(nextValue);

    expect(model.getState()).toBe(nextValue);
  });

  test('State must be updated after publishment(by function)', () => {
    const initialValue = 'start string';
    const nextValue = 'final string';
    const model = createModel(initialValue);

    expect(model.getState()).toBe(initialValue);

    model.publish(() => nextValue);

    expect(model.getState()).toBe(nextValue);
  });

  test('Subscribe method must be fired when value published', () => {
    const model = createModel('test');
    const nextValue = 'updated test';
    const callback = jest.fn();

    model.subscribe(callback);
    model.publish(nextValue);

    expect(callback).toBeCalledTimes(1);
    expect(callback).lastCalledWith(nextValue, {});
  });

  test('Subscribe must not fire on same value published', () => {
    const initialValue = [];
    const model = createModel(initialValue);
    const callback = jest.fn();

    model.subscribe(callback);
    model.publish(initialValue);

    expect(callback).toBeCalledTimes(0);
  });

  test('Subscribe must fire on same value published, when second parameter is true', () => {
    const initialValue = [];
    const model = createModel(initialValue, { fireDuplicates: true });
    const callback = jest.fn();

    model.subscribe(callback);
    model.publish(initialValue);

    expect(callback).toBeCalledTimes(1);
  });

  test('Subscribe method must be fired immediatly when second argument is set to true', () => {
    const initialValue = 'test';
    const model = createModel(initialValue);
    const callback = jest.fn();

    model.subscribe(callback, true);

    expect(callback).toBeCalledTimes(1);
    expect(callback).lastCalledWith(initialValue);
  });
});
