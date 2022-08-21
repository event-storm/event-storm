import { createModel } from 'src';

import { defaultdispatchConfigs } from './constants';

describe('Creating a Model', () => {
  test('model object matches pattern', () => {
    const model = createModel(true);

    expect(typeof model).toBe('object');
    expect(typeof model.getState).toBe('function');
    expect(typeof model.subscribe).toBe('function');
  });

  test('Get state must give the default state, when nothing dispatched', () => {
    const model = createModel(1);

    expect(model.getState()).toBe(1);
  });

  test('State must be updated after dispatchment(primitive value)', () => {
    const initialValue = {};
    const nextValue = { user: 'Bob' };
    const model = createModel(initialValue);

    expect(model.getState()).toBe(initialValue);

    model.dispatch(nextValue);

    expect(model.getState()).toBe(nextValue);
  });

  test('State must be updated after dispatchment(by function)', () => {
    const initialValue = 'start string';
    const nextValue = 'final string';
    const model = createModel(initialValue);

    expect(model.getState()).toBe(initialValue);

    model.dispatch(() => nextValue);

    expect(model.getState()).toBe(nextValue);
  });

  test('Subscribe method must be fired when value dispatched', () => {
    const model = createModel('test');
    const nextValue = 'updated test';
    const callback = jest.fn();

    model.subscribe(callback);
    model.dispatch(nextValue);

    expect(callback).toBeCalledTimes(1);
    expect(callback).lastCalledWith(nextValue, defaultdispatchConfigs);
  });

  test('Subscribe must not fire on same value dispatched', () => {
    const initialValue = [];
    const model = createModel(initialValue);
    const callback = jest.fn();

    model.subscribe(callback);
    model.dispatch(initialValue);

    expect(callback).toBeCalledTimes(0);
  });

  test('Subscribe must fire on same value dispatched, when second parameter is true', () => {
    const initialValue = [];
    const model = createModel(initialValue, { fireDuplicates: true });
    const callback = jest.fn();

    model.subscribe(callback);
    model.dispatch(initialValue);

    expect(callback).toBeCalledTimes(1);
  });

  test('Subscribe method must be fired immediatly when second argument is set to true', () => {
    const initialValue = 'test';
    const model = createModel(initialValue);
    const callback = jest.fn();

    model.subscribe(callback, { needPrevious: true });

    expect(callback).toBeCalledTimes(1);
    expect(callback).lastCalledWith(initialValue);
  });

  test('Unsubcribe call must make the callback not fire anymore', () => {
    const initialValue = 'test';
    const finalState = 'final';
    const model = createModel(initialValue);
    const callback = jest.fn();

    const unsubscribe = model.subscribe(callback);
    unsubscribe();

    model.dispatch(finalState);

    expect(model.getState()).toEqual(finalState);
    expect(callback).toBeCalledTimes(0);
  });
});
