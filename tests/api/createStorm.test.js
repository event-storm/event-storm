import { createStorm } from 'src';

import { defaultPublishConfigs } from './constants';

describe('Creating a storm', () => {
  test('storm object matches pattern', () => {
    const storm = createStorm({
      name: 'John',
      surname: 'Doe',
    });

    expect(typeof storm.models).toBe('object');
    expect(typeof storm.publish).toBe('function');
    expect(typeof storm.getState).toBe('function');
    expect(typeof storm.subscribe).toBe('function');
  });

  test('getState must return the snapshot of the storm tree', () => {
    const initialState = {
      name: 'John',
      surname: 'Doe',
    }
    const storm = createStorm(initialState);

    expect(storm.getState()).toEqual(initialState);

    storm.publish(prev => ({ ...prev, name: 'Jain' }));

    expect(storm.getState()).toEqual({
      name: 'Jain',
      surname: 'Doe',
    });
  });

  test('storm indiviudal key subscribe', () => {
    const initialState = {
      changable: true,
      nonChangable: true,
    }

    const storm = createStorm(initialState);

    const changableSubscriptionCallback = jest.fn();
    const nonChangableSubscriptionCallback = jest.fn();

    storm.models.changable.subscribe(changableSubscriptionCallback);
    storm.models.nonChangable.subscribe(nonChangableSubscriptionCallback);

    storm.publish(prev => ({ ...prev, changable: !prev.changable }));

    expect(changableSubscriptionCallback).toBeCalledTimes(1);
    expect(nonChangableSubscriptionCallback).toBeCalledTimes(0);
  });

  test('subscribe must fire on any fragment change', () => {
    const initialState = {
      name: 'John',
      surname: 'Doe',
    }
    const finalState = { name: 'Jain' };
    const storm = createStorm(initialState);
    const callback = jest.fn();

    storm.subscribe(callback);
    storm.publish(prev => ({ ...prev, ...finalState }));

    expect(callback).toBeCalledTimes(1);
    expect(callback).lastCalledWith({ ...initialState, ...finalState }, defaultPublishConfigs);
  });

  test('publish method must update single information unit', () => {
    const initialState = {
      name: 'John',
      surname: null,
    };
    const fragment = {
      surname: 'Jane',
    }

    const storm = createStorm(initialState);
    storm.publish(fragment);

    expect(storm.getState()).toEqual(fragment);
  });

  test('publish method must update the storm with async function', async () => {
    const initialValue = { type: 'sync' };
    const finalValue = { type: 'async' };
    const storm = createStorm(initialValue);
    const waitTime = 1000;
    const callback = () => {
      return new Promise(resolve => setTimeout(() => resolve(finalValue), waitTime));
    }

    await storm.publish(callback);

    expect(storm.getState()).toEqual(finalValue);
  });

  test('publish method must update the storm by multiple values', () => {
    const initialState = {
      age: 21,
      name: 'John',
      surname: undefined,
    };
    const fragment = {
      name: 'Jane',
      age: 35,
    }

    const storm = createStorm(initialState);
    storm.publish(prev => ({ ...prev, ...fragment }));

    expect(storm.getState()).toEqual({ ...initialState, ...fragment });
  });

  test('storm must support nested state', () => {
    const initialState = {
      user: {
        name: 'Bob',
        age: 21,
      },
      message: 'Some message',
    };

    const storm = createStorm(initialState);

    expect(storm.getState()).toEqual(initialState);
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

    const storm = createStorm(initialState);
    storm.models.user.subscribe(userSubscriber);
    storm.models.user.models.name.subscribe(nameSubscriber);

    storm.publish({
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

    const storm = createStorm(initialState);
    storm.models.user.models.age.subscribe(ageSubscriber);
    storm.models.user.models.name.subscribe(nameSubscriber);

    storm.publish({
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

  //   const storm = createStorm(initialState);

  //   storm.models.selectedLayer.subscribe(subscriptionCallback);

  //   expect(storm.getState().selectedLayer).toEqual(initialState.layers.find(layer => layer.id === initialSelectedId));

  //   storm.publish({
  //     selectedLayerId: finalSelectedId,
  //   });

  //   expect(storm.getState().selectedLayer).toEqual(initialState.layers.find(layer => layer.id === finalSelectedId));
  // });

  test('Nested state updates with array: publishing from storm', () => {
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

    const storm = createStorm(initialState);

    storm.models.layers.subscribe(subscriptionCallback);
    storm.models.layers.models[0].subscribe(subscriptionCallbackFor0);
    storm.models.layers.models[1].subscribe(subscriptionCallbackFor1);
    storm.models.layers.models[1].models.settings.subscribe(subscriptionCallbackFor1Settings);
    storm.models.layers.models[1].models.id.subscribe(subscriptionCallbackFor1Id);

    storm.publish(prev => ({
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

    const storm = createStorm(initialState);

    storm.models.layers.subscribe(subscriptionCallback);
    storm.models.layers.models[0].subscribe(subscriptionCallbackFor0);
    storm.models.layers.models[1].subscribe(subscriptionCallbackFor1);
    storm.models.layers.models[1].models.settings.subscribe(subscriptionCallbackFor1Settings);
    storm.models.layers.models[1].models.id.subscribe(subscriptionCallbackFor1Id);

    storm.models.layers.models[1].models.settings.models.type.publish('dynamic');

    expect(subscriptionCallback).toBeCalledTimes(1);
    expect(subscriptionCallbackFor0).toBeCalledTimes(0);
    expect(subscriptionCallbackFor1).toBeCalledTimes(1);
    expect(subscriptionCallbackFor1Id).toBeCalledTimes(0);
    expect(subscriptionCallbackFor1Settings).toBeCalledTimes(1);
  });
  // TODO:: change to subscribeToFragment
  // test('Nested state updates must not fire additional subscription functions: virtualModel', () => {
  //   const selecterFn = jest.fn();
  //   const initialState = {
  //     user: {
  //       name: 'Bob',
  //       age: 21,
  //       info: {
  //         paid: false,
  //       }
  //     },
  //     message: 'Some message',
  //     isPaid: selecterFn,
  //   };

  //   const paidSubscriber = jest.fn();

  //   const storm = createStorm(initialState);
  //   storm.models.isPaid.subscribe(paidSubscriber);

  //   storm.publish({
  //     user: {
  //       name: 'Alice',
  //     },
  //   });

  //   expect(paidSubscriber).toBeCalledTimes(0);
  //   expect(selecterFn).toBeCalledTimes(0);
  // });

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

    const storm = createStorm(initialState);
    storm.models.users.subscribe(subscriptionCallback);

    storm.publish(finalState);

    expect(subscriptionCallback).toBeCalledTimes(1);
  });
});

describe('storm array segment CRUD', () => {
  test('Creating an array', () => {
    const initialState = {
      users: null,
    };
    const intermediateState = {
      users: [],
    }

    const finalState = {
      users: [1, 2],
    }

    const subscriptionCallback = jest.fn();
    const storm = createStorm(initialState);
    storm.models.users.subscribe(subscriptionCallback);
    storm.publish(intermediateState);

    expect(subscriptionCallback).toBeCalledTimes(1);
    expect(subscriptionCallback).lastCalledWith([], defaultPublishConfigs);

    storm.publish(finalState);

    expect(subscriptionCallback).toBeCalledTimes(2);
    expect(subscriptionCallback).lastCalledWith([1, 2], defaultPublishConfigs);

    const firstItemSubscriptionCallback = jest.fn();
    const secondItemSubscriptionCallback = jest.fn();
    storm.models.users.models[0].subscribe(firstItemSubscriptionCallback);
    storm.models.users.models[1].subscribe(secondItemSubscriptionCallback);

    storm.publish({
      users: [110, 2]
    });

    expect(secondItemSubscriptionCallback).toBeCalledTimes(0);
    expect(firstItemSubscriptionCallback).toBeCalledTimes(1);
  });

  test('Reading an array', () => {

  });

  test('Updating an array', () => {

    const initialState = {
      users: [{ name: 'Alice' }],
    };
    const updateItem = { name: 'Bob' };

    const subscriptionCallback = jest.fn();
    const storm = createStorm(initialState);
    storm.models.users.subscribe(subscriptionCallback);
    storm.publish(prev => ({ users: [...prev.users, updateItem] }));

    expect(subscriptionCallback).toBeCalledTimes(1);
    expect(subscriptionCallback).lastCalledWith([...initialState.users, updateItem], defaultPublishConfigs);
  });

  test('Deleting an array', () => {

  });
});
