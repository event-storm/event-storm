import { createStorm } from 'src';

describe('Creating a storm', () => {
  test('storm object matches pattern', () => {
    const storm = createStorm({
      name: 'John',
      surname: 'Doe',
    });

    expect(typeof storm.dispatch).toBe('function');
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

    storm.dispatch(prev => ({ ...prev, name: 'Jain', age: 34 }));

    expect(storm.getState()).toEqual({
      age: 34,
      name: 'Jain',
      surname: 'Doe',
    });
  });
  test('it must be possible to add new keys to the existing object', () => {
    const initialState = { user: {} };
    const storm = createStorm(initialState);

    storm.dispatch({ user: { age: 1 } });

    expect(storm.getState()).toEqual({ user: { age: 1 } });
  });

  test('Changing key data type must be possible', () => {
    const initialState = {
      user: null
    };
    const storm = createStorm(initialState);

    storm.dispatch({ user: [] });

    expect(storm.getState()).toEqual({ user: [] });
  });

  test('storm indiviudal key subscribe', () => {
    const initialState = {
      changable: true,
      nonChangable: true,
    }

    const storm = createStorm(initialState);

    const changableSubscriptionCallback = jest.fn();
    const nonChangableSubscriptionCallback = jest.fn();

    storm.subscribe((state, subscribe) => {
      changableSubscriptionCallback();
      return subscribe(state.changable);
    });
    storm.subscribe((state, subscribe) => {
      nonChangableSubscriptionCallback();
      return subscribe(state.nonChangable);
    });

    storm.dispatch(prev => ({ ...prev, changable: !prev.changable }));

    expect(changableSubscriptionCallback).toBeCalledTimes(2);
    expect(nonChangableSubscriptionCallback).toBeCalledTimes(1);
  });

  test('subscribe must fire on any fragment change', () => {
    const initialState = {
      info: [],
    }
    const storm = createStorm(initialState);
    const addedValue= 'addedValue';
    const callback = jest.fn();

    storm.subscribe((state, subscribe) => {
      callback(state);
      return subscribe(state);
    });
    storm.dispatch(prev => ({ info: [...prev.info, addedValue] }));
    storm.dispatch(prev => ({ info: [...prev.info, addedValue] }));

    expect(callback).lastCalledWith({ info: [addedValue, addedValue] });
  });

  test('subscribe must fire on any fragment change', () => {
    const initialState = {
      name: 'John',
      surname: 'Doe',
    }
    const finalState = { name: 'Jain' };
    const storm = createStorm(initialState);
    const callback = jest.fn();

    storm.subscribe((state, subscribe) => {
      callback(state);
      return subscribe(state);
    });
    storm.dispatch(prev => ({ ...prev, ...finalState }));

    expect(callback).toBeCalledTimes(2);
    expect(callback).lastCalledWith({ ...initialState, ...finalState });
  });

    test('partial state update with array replacement', () => {
    const initialState = {
      users: ['a'],
      activeId: 'some-id',
    };
    const finalState = {
      users: ['Alice'],
      activeId: 'some-id',
    };

    const patch = { users: ['Alice'] };

    const storm = createStorm(initialState);
    storm.dispatch(patch);

    expect(storm.getState()).toEqual(finalState);
  });

  test('dispatch method must update single information unit', () => {
    const initialState = {
      name: 'John',
      surname: null,
    };
    const fragment = {
      surname: 'Jane',
    }

    const storm = createStorm(initialState);
    storm.dispatch(fragment);

    expect(storm.getState()).toEqual({ ...initialState, ...fragment});
  });

  // test('dispatch method must update the storm with async function', async () => {
  //   const initialValue = { type: 'sync' };
  //   const finalValue = { type: 'async' };
  //   const storm = createStorm(initialValue);
  //   const waitTime = 1000;
  //   const callback = () => {
  //     return new Promise(resolve => setTimeout(() => resolve(finalValue), waitTime));
  //   }

  //   await storm.dispatch(callback);

  //   expect(storm.getState()).toEqual(finalValue);
  // });

  test('dispatch method must update the storm by multiple values', () => {
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
    storm.dispatch(prev => ({ ...prev, ...fragment }));

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
    storm.subscribe((state, subscribe) => {
      userSubscriber();
      return subscribe(state.user)
    });
    storm.subscribe((state, subscribe) => {
      nameSubscriber();
      return subscribe(state.user.name);
    });

    storm.dispatch({
      user: {
        name: 'Alice',
      },
    });

    expect(userSubscriber).toBeCalledTimes(2);
    expect(nameSubscriber).toBeCalledTimes(2);
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
    storm.subscribe((state, subscribe) => {
      ageSubscriber();
      return subscribe(state.user.age);
    });
    storm.subscribe((state, subscribe) => {
      nameSubscriber();
      return subscribe(state.user.name);
    });

    storm.dispatch({
      user: {
        name: 'Alice',
      },
    });

    expect(ageSubscriber).toBeCalledTimes(1);
    expect(nameSubscriber).toBeCalledTimes(2);
  });

  test('Nested state updates with array: dispatching from storm', () => {
    const initialState = {
      layers: [{
        name: 'Layer 0',
        id: '0',
        settings: {
          type: 'static',
        },
      },{
        name: 'Layer 1',
        id: '1',
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

    storm.subscribe((state, subscribe) => {
      subscriptionCallback();
      return subscribe(state.layers);
    });
    storm.subscribe((state, subscribe) => {
      subscriptionCallbackFor0();
      return subscribe(state.layers[0]);
    });
    storm.subscribe((state, subscribe) => {
      subscriptionCallbackFor1();
      return subscribe(state.layers[1]);
    });
    storm.subscribe((state, subscribe) => {
      subscriptionCallbackFor1Settings();
      return subscribe(state.layers[1].settings);
    });
    storm.subscribe((state, subscribe) => {
      subscriptionCallbackFor1Id();
      return subscribe(state.layers[1].id);
    });

    storm.dispatch(prev => ({
      layers: prev.layers.map(layer =>
        layer.id === '1'
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

    expect(subscriptionCallback).toBeCalledTimes(2);
    expect(subscriptionCallbackFor0).toBeCalledTimes(2);
    expect(subscriptionCallbackFor1).toBeCalledTimes(2);
    expect(subscriptionCallbackFor1Id).toBeCalledTimes(1);
    expect(subscriptionCallbackFor1Settings).toBeCalledTimes(2);
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

    const storm = createStorm(initialState);
    storm.subscribe((state, subscribe) => {
      subscriptionCallback();
      return subscribe(state.users);
    });

    storm.dispatch(finalState);

    expect(subscriptionCallback).toBeCalledTimes(2);
  });

  test('Middleware must receive the prev and next states of the store', () => {
    const initialState = {
      users: [],
    };
    const finalState = {
      users: [{
        name: 'Alice',
      }],
    };
    const configs = {};
    const middleware = jest.fn();

    const storm = createStorm(initialState);
    storm.addMiddleware(middleware);
    storm.dispatch(finalState, configs);

    expect(middleware).toBeCalledTimes(1);
    expect(middleware).toHaveBeenCalledWith(finalState, initialState, configs);
  })

  test('After unsubscribe middleware must not receive any update', () => {
    const initialState = {
      users: [],
    };
    const finalState = {
      users: [{
        name: 'Alice',
      }],
    };
    const middleware = jest.fn();

    const storm = createStorm(initialState);
    const unsubscribe = storm.addMiddleware(middleware);
    unsubscribe();
    storm.dispatch(finalState);

    expect(middleware).toBeCalledTimes(0);
  })
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
    storm.subscribe((state, subscribe) => {
      subscriptionCallback(state);
      return subscribe(state.users);
    });
    storm.dispatch(intermediateState);

    expect(subscriptionCallback).toBeCalledTimes(2);
    expect(subscriptionCallback.mock.calls[1][0]).toEqual(intermediateState);

    storm.dispatch(finalState);

    expect(subscriptionCallback).toBeCalledTimes(3);
    expect(subscriptionCallback.mock.calls[2][0]).toEqual(finalState);

    const firstItemSubscriptionCallback = jest.fn();
    const secondItemSubscriptionCallback = jest.fn();
    storm.subscribe((state, subscribe) => {
      firstItemSubscriptionCallback();
      return subscribe(state.users[0]);
    });
    storm.subscribe((state, subscribe) => {
      secondItemSubscriptionCallback();
      return subscribe(state.users[1]);
    });

    storm.dispatch({
      users: [110, 2]
    });

    expect(secondItemSubscriptionCallback).toBeCalledTimes(2);
    expect(firstItemSubscriptionCallback).toBeCalledTimes(2);
  });

  test('Updating an array', () => {
    const initialState = {
      users: [{ name: 'Alice' }],
    };
    const updateItem = { name: 'Bob' };
    const subscriptionCallback = jest.fn();
    const storm = createStorm(initialState);
    storm.subscribe((state, subscribe) => {
      subscriptionCallback(state);
      return subscribe(state.users);
    });

    storm.dispatch(prev => ({ users: [...prev.users, updateItem] }));

    expect(subscriptionCallback).toBeCalledTimes(2);
    expect(subscriptionCallback.mock.calls[1][0]).toEqual({ ...initialState, users: [ ...initialState.users, updateItem ] });
  });

  test('Deleting an array', () => {
    const initialState = {
      users: [{ name: 'Alice' }],
    };
    const finalState = { users: null };
    const storm = createStorm(initialState);
    const subscriptionCallback = jest.fn();
    const unsubscribe = storm.subscribe((state, subscribe) => {
      subscriptionCallback(state);
      return subscribe(state.users);
    });
    unsubscribe();

    storm.dispatch(finalState);

    expect(subscriptionCallback).toBeCalledTimes(1);
    expect(storm.getState()).toEqual(finalState);
  });

  test('Deleting an array item(reassigning to null)', () => {
    const initialState = {
      users: [{ name: 'Alice' }],
    };
    const finalState = { users: [null] };
    const storm = createStorm(initialState);

    storm.dispatch(finalState);

    expect(storm.getState()).toEqual(finalState);
  });

  test('Adding an array item', () => {
    const initialState = {
      users: [],
      activeId: 'some-id',
    };
    const finalState = { users: [{ name: 'Alice' }] };
    const storm = createStorm(initialState);
    const fn = jest.fn();
    
    storm.subscribe((state, subscribe) => {
      fn();
      subscribe(state.users);
      subscribe(state.activeId);
    });
    storm.dispatch(finalState);

    expect(storm.getState()).toEqual({ ...initialState, ...finalState });
    expect(fn).toBeCalledTimes(2);
  });
});

describe('Empty object/array are terminal replace values', () => {
  test('empty object resets a nested branch instead of a no-op merge', () => {
    const storm = createStorm({ a: 1, b: 2, user: { id: 1 } });
    storm.dispatch(prev => ({ ...prev, user: {} }));
    expect(storm.getState()).toEqual({ a: 1, b: 2, user: {} });
  });

  test('empty array resets a nested array', () => {
    const storm = createStorm({ list: [1, 2, 3], keep: 'x' });
    storm.dispatch({ list: [] });
    expect(storm.getState()).toEqual({ list: [], keep: 'x' });
  });

  test('empty object replaces a non-empty array (type change)', () => {
    const storm = createStorm({ x: [1, 2] });
    storm.dispatch({ x: {} });
    expect(storm.getState()).toEqual({ x: {} });
  });

  test('empty array replaces a non-empty object (type change)', () => {
    const storm = createStorm({ x: { a: 1 } });
    storm.dispatch({ x: [] });
    expect(storm.getState()).toEqual({ x: [] });
  });

  test('deeply nested branch resets', () => {
    const storm = createStorm({ a: { b: { c: 1, d: 2 } } });
    storm.dispatch({ a: { b: {} } });
    expect(storm.getState()).toEqual({ a: { b: {} } });
  });

  test('empty value on a brand new key is simply assigned', () => {
    const storm = createStorm({ a: 1 });
    storm.dispatch({ fresh: {} });
    expect(storm.getState()).toEqual({ a: 1, fresh: {} });
  });

  test('non-empty patch still merges (regression)', () => {
    const storm = createStorm({ user: { id: 1, name: 'a' } });
    storm.dispatch({ user: { name: 'b' } });
    expect(storm.getState()).toEqual({ user: { id: 1, name: 'b' } });
  });

  test('resetting an array element to empty clears it', () => {
    const storm = createStorm({ layers: [{ id: '0', settings: { type: 'static' } }] });
    storm.dispatch({ layers: [{}] });
    expect(storm.getState()).toEqual({ layers: [{}] });
  });
});

describe('Subscription correctness when a branch is reset', () => {
  test('the branch subscriber fires, an unrelated subscriber does not', () => {
    const storm = createStorm({ user: { id: 1 }, other: { n: 1 } });
    const userSubscriber = jest.fn();
    const otherSubscriber = jest.fn();
    storm.subscribe((state, subscribe) => {
      userSubscriber();
      return subscribe(state.user);
    });
    storm.subscribe((state, subscribe) => {
      otherSubscriber();
      return subscribe(state.other);
    });

    storm.dispatch({ user: {} });

    expect(userSubscriber).toBeCalledTimes(2);
    expect(otherSubscriber).toBeCalledTimes(1);
  });

  test('the subscriber receives the emptied value', () => {
    const storm = createStorm({ user: { id: 1 } });
    const subscriber = jest.fn();
    storm.subscribe((state, subscribe) => {
      subscriber(state.user);
      return subscribe(state.user);
    });

    storm.dispatch({ user: {} });

    expect(subscriber.mock.calls[1][0]).toEqual({});
  });

  test('a subscriber on a leaf of the reset branch is notified it disappeared', () => {
    const storm = createStorm({ user: { id: 1, profile: { name: 'a' } } });
    const idSubscriber = jest.fn();
    const nameSubscriber = jest.fn();
    storm.subscribe((state, subscribe) => {
      idSubscriber();
      return subscribe(state.user?.id);
    });
    storm.subscribe((state, subscribe) => {
      nameSubscriber();
      return subscribe(state.user?.profile?.name);
    });

    storm.dispatch({ user: {} });

    expect(idSubscriber).toBeCalledTimes(2);
    expect(nameSubscriber).toBeCalledTimes(2);
  });

  test('a subscriber on a leaf of a reset array element is notified', () => {
    const storm = createStorm({ layers: [{ id: '0', settings: { type: 'static' } }] });
    const settingsSubscriber = jest.fn();
    storm.subscribe((state, subscribe) => {
      settingsSubscriber();
      return subscribe(state.layers?.[0]?.settings?.type);
    });

    storm.dispatch({ layers: [{}] });

    expect(settingsSubscriber).toBeCalledTimes(2);
  });
});
