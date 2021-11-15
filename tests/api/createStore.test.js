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
    }
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

  test('None predifined state key must give an error on publish', () => {
    const initialState = {
      age: 21,
      name: 'John',
      surname: 'Doe',
    };

    const fragment = {
      anotherName: 'Jane',
    }

    const store = createStore(initialState);

    expect(store.publish(fragment)).rejects.toThrow('You need to specify default value before publishing');
  });

  test('Nested state must support nested state', () => {
    const initialState = {
      user: {
        name: 'Bob',
        age: 21,
      },
      message: 'Some message',
    };

    const store = createStore(initialState);

    expect(store.getState()).toEqual(initialState);
  });

  test('Nested state updates must be interconnected', () => {
    const initialState = {
      user: {
        name: 'Bob',
        age: 21,
      },
      message: 'Some message',
    };
    const userSubscriber = jest.fn();
    const nameSubscriber = jest.fn();

    const store = createStore(initialState);
    store.models.user.subscribe(userSubscriber);
    store.models.user.models.name.subscribe(nameSubscriber);

    store.publish({
      user: {
        name: 'Alice',
      },
    });

    expect(userSubscriber).toBeCalledTimes(1);
    expect(nameSubscriber).toBeCalledTimes(1);
  });

  test('Nested state updates must not fire additional subscription functions', () => {
    const initialState = {
      user: {
        name: 'Bob',
        age: 21,
        info: {
          paid: false,
        }
      },
      message: 'Some message',
      isPaid: ({ user: { info: { paid } } }) => paid,
    };
    const ageSubscriber = jest.fn();
    const nameSubscriber = jest.fn();

    const store = createStore(initialState);
    store.models.user.models.age.subscribe(ageSubscriber);
    store.models.user.models.name.subscribe(nameSubscriber);

    store.publish({
      user: {
        name: 'Alice',
      },
    });

    expect(ageSubscriber).toBeCalledTimes(0);
    expect(nameSubscriber).toBeCalledTimes(1);
  });

  test('Nested state updates with array: virtual model', () => {
    const initialSelectedId = '1';
    const finalSelectedId = '2';
    const initialState = {
      layers: [{
        name: 'Layer 1',
        id: '1',
      },{
        name: 'Layer 2',
        id: '2',
      },{
        name: 'Layer 3',
        id: '3',
      },{
        name: 'Layer 4',
        id: '4',
      }],
      selectedLayerId: initialSelectedId,
      selectedLayer: ({ layers, selectedLayerId }) => {
        return layers.find(layer => layer.id === selectedLayerId);
      },
    };
    const subscriptionCallback = jest.fn();

    const store = createStore(initialState);

    store.models.selectedLayer.subscribe(subscriptionCallback);

    expect(store.getState().selectedLayer).toEqual(initialState.layers.find(layer => layer.id === initialSelectedId));

    store.publish({
      selectedLayerId: finalSelectedId,
    });

    expect(store.getState().selectedLayer).toEqual(initialState.layers.find(layer => layer.id === finalSelectedId));
  });

  test('Nested state updates with array: publishing from store', () => {
    const initialState = {
      layers: [{
        name: 'Layer 1',
        id: '1',
        settings: {
          type: 'static',
        },
      },{
        name: 'Layer 2',
        id: '2',
        settings: {
          type: 'static',
        },
      },{
        name: 'Layer 3',
        id: '3',
        settings: {
          type: 'static',
        },
      },{
        name: 'Layer 4',
        id: '4',
        settings: {
          type: 'static',
        },
      }],
    };
    const subscriptionCallback = jest.fn();
    const subscriptionCallbackFor0 = jest.fn();
    const subscriptionCallbackFor1 = jest.fn();
    const subscriptionCallbackFor1Id = jest.fn();
    const subscriptionCallbackFor1Settings = jest.fn();

    const store = createStore(initialState);

    store.models.layers.subscribe(subscriptionCallback);
    store.models.layers.models[0].subscribe(subscriptionCallbackFor0);
    store.models.layers.models[1].subscribe(subscriptionCallbackFor1);
    store.models.layers.models[1].models.settings.subscribe(subscriptionCallbackFor1Settings);
    store.models.layers.models[1].models.id.subscribe(subscriptionCallbackFor1Id);

    store.publish(prev => ({
      layers: prev.layers.map(layer =>
        layer.id === '2'
          ? {
            ...layer,
            settings: {
              ...layer.settings,
              type: 'dynamic',
            },
          }
          : layer
      )
    }));

    expect(subscriptionCallback).toBeCalledTimes(1);
    expect(subscriptionCallbackFor0).toBeCalledTimes(0);
    expect(subscriptionCallbackFor1).toBeCalledTimes(1);
    expect(subscriptionCallbackFor1Id).toBeCalledTimes(0);
    expect(subscriptionCallbackFor1Settings).toBeCalledTimes(1);
  });

  test('Nested state updates with array: publish from single model', () => {
    const initialState = {
      layers: [{
        name: 'Layer 1',
        id: '1',
        settings: {
          type: 'static',
        },
      },{
        name: 'Layer 2',
        id: '2',
        settings: {
          type: 'static',
        },
      },{
        name: 'Layer 3',
        id: '3',
        settings: {
          type: 'static',
        },
      },{
        name: 'Layer 4',
        id: '4',
        settings: {
          type: 'static',
        },
      }],
    };
    const subscriptionCallback = jest.fn();
    const subscriptionCallbackFor0 = jest.fn();
    const subscriptionCallbackFor1 = jest.fn();
    const subscriptionCallbackFor1Id = jest.fn();
    const subscriptionCallbackFor1Settings = jest.fn();

    const store = createStore(initialState);

    store.models.layers.subscribe(subscriptionCallback);
    store.models.layers.models[0].subscribe(subscriptionCallbackFor0);
    store.models.layers.models[1].subscribe(subscriptionCallbackFor1);
    store.models.layers.models[1].models.settings.subscribe(subscriptionCallbackFor1Settings);
    store.models.layers.models[1].models.id.subscribe(subscriptionCallbackFor1Id);

    store.models.layers.models[1].models.settings.models.type.publish('dynamic');

    expect(subscriptionCallback).toBeCalledTimes(1);
    expect(subscriptionCallbackFor0).toBeCalledTimes(0);
    expect(subscriptionCallbackFor1).toBeCalledTimes(1);
    expect(subscriptionCallbackFor1Id).toBeCalledTimes(0);
    expect(subscriptionCallbackFor1Settings).toBeCalledTimes(1);
  });

  test('Nested state updates must not fire additional subscription functions: virtualModel', () => {
    const selecterFn = jest.fn();
    const initialState = {
      user: {
        name: 'Bob',
        age: 21,
        info: {
          paid: false,
        }
      },
      message: 'Some message',
      isPaid: selecterFn,
    };

    const paidSubscriber = jest.fn();

    const store = createStore(initialState);
    store.models.isPaid.subscribe(paidSubscriber);

    store.publish({
      user: {
        name: 'Alice',
      },
    });

    expect(paidSubscriber).toBeCalledTimes(0);
    expect(selecterFn).toBeCalledTimes(0);
  });
});
