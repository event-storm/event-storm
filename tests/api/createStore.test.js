import { createStore } from 'src';

describe('Creating a store', () => {
  test('store object matches pattern', () => {
    const store = createStore({
      name: 'John',
      surname: 'Doe',
    });

    expect(typeof store.models).toBe('object');
    expect(typeof store.publish).toBe('function');
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

    store.models.name.publish('Jain');

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
    store.models.name.publish('Jain');

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

    store.models.taxes.publish(30);

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

    store.models.taxes.publish(30);

    expect(store.getState()).toEqual({
      taxes: 30,
      netSalary: 70_000,
      grossSalary: 100_000,
      isEnough: false
    });

    store.models.grossSalary.publish(200_000);

    expect(store.getState()).toEqual({
      taxes: 30,
      netSalary: 140_000,
      grossSalary: 200_000,
      isEnough: true
    });
  });

  test('publish method must update the store by single value', () => {
    const initialState = {
      name: 'John',
      surname: 'Doe',
    };
    const fragment = {
      name: 'Jane',
    }

    const store = createStore(initialState);
    store.publish(fragment);

    expect(store.getState()).toEqual({ ...initialState, ...fragment });
  });

  test('publish method must update the store with async function', async () => {
    const initialValue = { type: 'sync' };
    const finalValue = { type: 'async' };
    const store = createStore(initialValue);
    const waitTime = 1000;
    const callback = () => {
      return new Promise(resolve => setTimeout(() => resolve(finalValue), waitTime));
    }

    store.publish(callback);
    await callback();

    expect(store.getState()).toEqual(finalValue);
  });

  test('publish method must update the store by multiple values', () => {
    const initialState = {
      age: 21,
      name: 'John',
      surname: 'Doe',
    };
    const fragment = {
      name: 'Jane',
      age: 35,
    }

    const store = createStore(initialState);
    store.publish(fragment);

    expect(store.getState()).toEqual({ ...initialState, ...fragment });
  });

  test('None predifined state key must be created after publish', () => {
    const initialState = {
      age: 21,
      name: 'John',
      surname: 'Doe',
    };

    const fragment = {
      anotherName: 'Jane',
      age: 35,
    }

    const store = createStore(initialState);
    store.publish(fragment);

    expect(store.getState()).toEqual({ ...initialState, ...fragment });
  });
});
