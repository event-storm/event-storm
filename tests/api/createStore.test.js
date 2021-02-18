import { createStore, publishModel } from 'src';

describe('Creating a store', () => {
  test('store object matches pattern', () => {
    const store = createStore({
      name: 'John',
      surname: 'Doe',
    });

    expect(typeof store.models).toBe('object');
    expect(typeof store.getState).toBe('function');
    expect(typeof store.subscribe).toBe('function');
  });

  test('getState must return the snapshot of the store tree', () => {
    const initialState = {
      name: 'John',
      surname: 'Doe',
    }
    const store = createStore(initialState);

    expect(store.getState()).toEqual(initialState);

    publishModel(store.models.name, 'Jain');

    expect(store.getState()).toEqual({
      name: 'Jain',
      surname: 'Doe',
    });
  });

  test('subscribe must fire on any fragment change', () => {
    const initialState = {
      name: 'John',
      surname: 'Doe',
    }
    const store = createStore(initialState);
    const callback = jest.fn();

    store.subscribe(callback);
    publishModel(store.models.name, 'Jain');

    expect(callback).toBeCalledTimes(1);
    expect(callback).lastCalledWith('name', 'Jain', store.models.name);
  });

  test('creating virtual method is possible', () => {
    const store = createStore({
      taxes: 20,
      grossSalary: 100_000,
      netSalary: ({ taxes, grossSalary }) => grossSalary * (100 - taxes) / 100,
    });

    expect(store.getState()).toEqual({
      taxes: 20,
      netSalary: 80_000,
      grossSalary: 100_000,
    });
  });

  test('virtual method must update on dependency change', () => {
    const store = createStore({
      taxes: 20,
      grossSalary: 100_000,
      netSalary: ({ taxes, grossSalary }) => grossSalary * (100 - taxes) / 100,
    });

    publishModel(store.models.taxes, 30);

    expect(store.getState()).toEqual({
      taxes: 30,
      netSalary: 70_000,
      grossSalary: 100_000,
    });
  });

  test('create virtual model over virtual model', () => {
    const store = createStore({
      taxes: 20,
      grossSalary: 100_000,
      netSalary: ({ taxes, grossSalary }) => grossSalary * (100 - taxes) / 100,
      isEnough: ({ netSalary }) => netSalary > 100_000,
    });

    publishModel(store.models.taxes, 30);

    expect(store.getState()).toEqual({
      taxes: 30,
      netSalary: 70_000,
      grossSalary: 100_000,
      isEnough: false
    });

    publishModel(store.models.grossSalary, 200_000);

    expect(store.getState()).toEqual({
      taxes: 30,
      netSalary: 140_000,
      grossSalary: 200_000,
      isEnough: true
    });
  });
});
