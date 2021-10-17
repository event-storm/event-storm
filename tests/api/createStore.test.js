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
    };
    const store = createStore(initialState);

    expect(store.getState()).toEqual(initialState);

    store.publish({ name: 'Jain' });

    expect(store.getState()).toEqual({
      name: 'Jain',
      surname: 'Doe',
    });
  });

  test('subscribe must fire on any fragment change', () => {
    const initialState = {
      name: 'John',
      surname: 'Doe',
    };
    const store = createStore(initialState);
    const callback = jest.fn();

    store.subscribe(callback);
    store.publish({ name: 'Jain' });

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

    store.publish({ taxes: 30 });

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

    store.publish({ taxes: 30 });

    expect(store.getState()).toEqual({
      taxes: 30,
      isEnough: false,
      netSalary: 70_000,
      grossSalary: 100_000,
    });

    store.publish({ grossSalary: 200_000 });

    expect(store.getState()).toEqual({
      taxes: 30,
      isEnough: true,
      netSalary: 140_000,
      grossSalary: 200_000,
    });
  });

  test('publish method must update the store by single value', () => {
    const initialState = {
      name: 'John',
      surname: 'Doe',
    };
    const fragment = {
      name: 'Jane',
    };

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
    };

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
    };

    const store = createStore(initialState);
    store.publish(fragment);

    expect(store.getState()).toEqual({ ...initialState, ...fragment });
  });

  test('None predifined state key must give an error on publish', () => {
    const initialState = {
      age: 21,
      name: 'John',
      surname: 'Doe',
    };

    const fragment = {
      anotherName: 'Jane',
    };

    const store = createStore(initialState);

    expect(store.publish(fragment)).rejects.toThrow('You need to specify default value before publishing');
  });

  test('Defining nested object as store must result in deep merging the state', () => {
    const initialState = {
      user: {
        name: 'John',
        age: 45
      },
      cards: {
        id: 'some_id',
        isPresent: false,
      },
    };

    const store = createStore(initialState);

    const fragment = {
      user: {
        name: 'Bob',
      },
    };

    store.publish(fragment);
    // deepmerge
    expect(store.getState()).toEqual({
      ...initialState,
      user: {
        ...initialState.user,
        ...fragment.user,
      },
    });
  });

  test('The nested property update must trigger parents subscibe', () => {
    const initialState = {
      user: {
        name: 'John',
        age: 45
      },
      cards: {
        id: 'some_id',
        isPresent: false,
      },
    };
    const fragment = {
      user: {
        name: 'Bob',
      },
    };
    const callbackChild = jest.fn();
    const callbackGlobal = jest.fn();

    const store = createStore(initialState);
    store.models.user.subscribe(callbackChild);
    store.subscribe(callbackGlobal);

    store.publish(fragment);

    expect(callbackChild).toBeCalledTimes(1);
    expect(callbackGlobal).toBeCalledTimes(1);
  });

  test('Array properties must stay arrays', () => {
    // const initialState = [1,2,3,4];

    // const store = createStore(initialState);

    // store.publish(state => state.map(number => number * 3));

    // expect(store.getState()).toEqual([1,2]);
  });
});
