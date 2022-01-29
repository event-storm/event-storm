import { createStorm } from 'src';

describe('Creating a store', () => {
  test('store object matches pattern', () => {
    const store = createStorm({
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
    const store = createStorm(initialState);

    expect(store.getState()).toEqual(initialState);

    store.publish(prev => ({ ...prev, name: 'Jain' }));

    expect(store.getState()).toEqual({
      name: 'Jain',
      surname: 'Doe',
    });
  });

  test('store indiviudal key subscribe', () => {
    const initialState = {
      changable: true,
      nonChangable: true,
    }

    const store = createStorm(initialState);

    const changableSubscriptionCallback = jest.fn();
    const nonChangableSubscriptionCallback = jest.fn();

    store.models.changable.subscribe(changableSubscriptionCallback);
    store.models.nonChangable.subscribe(nonChangableSubscriptionCallback);

    store.publish(prev => ({ ...prev, changable: !prev.changable }));

    expect(changableSubscriptionCallback).toBeCalledTimes(1);
    expect(nonChangableSubscriptionCallback).toBeCalledTimes(0);
  });

  test('subscribe must fire on any fragment change', () => {
    const initialState = {
      name: 'John',
      surname: 'Doe',
    }
    const finalState = { name: 'Jain' };
    const store = createStorm(initialState);
    const callback = jest.fn();

    store.subscribe(callback);
    store.publish(prev => ({ ...prev, ...finalState }));

    expect(callback).toBeCalledTimes(1);
    expect(callback).lastCalledWith({ ...initialState, ...finalState });
  });

  test('publish method must update single information unit', () => {
    const initialState = {
      name: 'John',
      surname: null,
    };
    const fragment = {
      surname: 'Jane',
    }

    const store = createStorm(initialState);
    store.publish(fragment);

    expect(store.getState()).toEqual(fragment);
  });

  test('publish method must update the store with async function', async () => {
    const initialValue = { type: 'sync' };
    const finalValue = { type: 'async' };
    const store = createStorm(initialValue);
    const waitTime = 1000;
    const callback = () => {
      return new Promise(resolve => setTimeout(() => resolve(finalValue), waitTime));
    }

    await store.publish(callback);

    expect(store.getState()).toEqual(finalValue);
  });

  test('publish method must update the store by multiple values', () => {
    const initialState = {
      age: 21,
      name: 'John',
      surname: undefined,
    };
    const fragment = {
      name: 'Jane',
      age: 35,
    }

    const store = createStorm(initialState);
    store.publish(prev => ({ ...prev, ...fragment }));

    expect(store.getState()).toEqual({ ...initialState, ...fragment });
  });

  test('Store must support nested state', () => {
    const initialState = {
      user: {
        name: 'Bob',
        age: 21,
      },
      message: 'Some message',
    };

    const store = createStorm(initialState);

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

    const store = createStorm(initialState);
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
    };
    const ageSubscriber = jest.fn();
    const nameSubscriber = jest.fn();

    const store = createStorm(initialState);
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
  // TODO:: udpate after subscribeToFragment will be ready
  // test('Nested state updates with array: virtual model', () => {
  //   const initialSelectedId = '1';
  //   const finalSelectedId = '2';
  //   const initialState = {
  //     layers: [{
  //       name: 'Layer 1',
  //       id: '1',
  //     },{
  //       name: 'Layer 2',
  //       id: '2',
  //     },{
  //       name: 'Layer 3',
  //       id: '3',
  //     },{
  //       name: 'Layer 4',
  //       id: '4',
  //     }],
  //     selectedLayerId: initialSelectedId,
  //     selectedLayer: ({ layers, selectedLayerId }) => {
  //       return layers.find(layer => layer.id === selectedLayerId);
  //     },
  //   };
  //   const subscriptionCallback = jest.fn();

  //   const store = createStorm(initialState);

  //   store.models.selectedLayer.subscribe(subscriptionCallback);

  //   expect(store.getState().selectedLayer).toEqual(initialState.layers.find(layer => layer.id === initialSelectedId));

  //   store.publish({
  //     selectedLayerId: finalSelectedId,
  //   });

  //   expect(store.getState().selectedLayer).toEqual(initialState.layers.find(layer => layer.id === finalSelectedId));
  // });

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
      }],
    };
    const subscriptionCallback = jest.fn();
    const subscriptionCallbackFor0 = jest.fn();
    const subscriptionCallbackFor1 = jest.fn();
    const subscriptionCallbackFor1Id = jest.fn();
    const subscriptionCallbackFor1Settings = jest.fn();

    const store = createStorm(initialState);

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

    const store = createStorm(initialState);

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
  // TODO:: change to subscribeToFragment
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

    const store = createStorm(initialState);
    store.models.isPaid.subscribe(paidSubscriber);

    store.publish({
      user: {
        name: 'Alice',
      },
    });

    expect(paidSubscriber).toBeCalledTimes(0);
    expect(selecterFn).toBeCalledTimes(0);
  });

  test('updating arrays', () => {
    const initialState = {
      users: [],
    };
    const finalState = {
      users: [{
        name: 'Alice',
      }],
    };
    const subscriptionCallback = jest.fn();

    const store = createStorm(initialState);
    store.models.users.subscribe(subscriptionCallback);

    store.publish(finalState);

    expect(subscriptionCallback).toBeCalledTimes(1);
  });
});

describe('Store array segment CRUD', () => {
  test('Creating an array', () => {
    const initialState = {
      users: null,
    };
    const finalState = {
      users: [],
    }

    const subscriptionCallback = jest.fn();
    const store = createStorm(initialState);
    store.models.users.subscribe(subscriptionCallback);
    store.publish(finalState);
    expect(subscriptionCallback).toBeCalledTimes(1);
    // emty object is the publish configuration
    expect(subscriptionCallback).lastCalledWith([], {});
  });

  test('Reading an array', () => {

  });

  test('Updating an array', () => {

    const initialState = {
      users: [{ name: 'Alice' }],
    };
    const updateItem = { name: 'Bob' };

    const subscriptionCallback = jest.fn();
    const store = createStorm(initialState);
    store.models.users.subscribe(subscriptionCallback);
    store.publish(prev => ({ users: [...prev.users, updateItem] }));

    expect(subscriptionCallback).toBeCalledTimes(1);
    expect(subscriptionCallback).lastCalledWith([...initialState.users, updateItem]);
  });

  test('Deleting an array', () => {

  });
});
