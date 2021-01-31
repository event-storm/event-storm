import { publishModel, createModel } from '../../src';

describe('Publishing a Model', () => {

  test('model must be updated(simple value)', () => {
    const initalValue = [];
    const nextValue = [1];
    const model = createModel(initalValue);
    const callback = jest.fn();

    expect(model.getState()).toBe(initalValue);

    model.subscribe(callback);
    publishModel(model, nextValue);

    expect(callback).toBeCalledTimes(1);
    expect(callback).lastCalledWith(nextValue);

    expect(model.getState()).toBe(nextValue);
  });

  test('model must be updated(by function)', () => {
    const initalValue = 1;
    const nextValue = 10;
    const model = createModel(initalValue);
    const callback = jest.fn();
    const publisher = jest.fn(() => nextValue);

    expect(model.getState()).toBe(initalValue);

    model.subscribe(callback);
    publishModel(model, publisher);

    expect(callback).toBeCalledTimes(1);
    expect(callback).lastCalledWith(nextValue);
    expect(publisher).toBeCalledTimes(1);
    expect(publisher).toReturnWith(nextValue);

    expect(model.getState()).toBe(nextValue);
  });

  test('previous state must be received', () => {
    const initialValue = 1;
    const model = createModel(initialValue);
    const callback = jest.fn();

    publishModel(model, callback);

    expect(callback).toBeCalledTimes(1);
    expect(callback).lastCalledWith(initialValue);
  });

  test('update state with async function', async () => {
    const initialValue = 'sync';
    const finalValue = 'async';
    const model = createModel(initialValue);
    const waitTime = 1000;
    const callback = () => {
      return new Promise(resolve => setTimeout(() => resolve(finalValue), waitTime));
    }

    publishModel(model, callback);
    await callback();

    expect(model.getState()).toBe(finalValue);
  });
});
