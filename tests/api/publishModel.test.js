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

    expect(callback.mock.calls.length).toBe(1);
    expect(callback.mock.calls[0][0]).toBe(nextValue);

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

    expect(callback.mock.calls.length).toBe(1);
    expect(callback.mock.calls[0][0]).toBe(nextValue);
    expect(publisher.mock.calls.length).toBe(1);
    expect(publisher.mock.results[0].value).toBe(nextValue);

    expect(model.getState()).toBe(nextValue);
  });

  test('previous state must be received', () => {
    const initialValue = 1;
    const model = createModel(initialValue);
    const callback = jest.fn();

    publishModel(model, callback);

    expect(callback.mock.calls.length).toBe(1);
    expect(callback.mock.calls[0][0]).toBe(initialValue);
  });
});
