import { createModel, createVirtualModel } from 'api/configure';

import { createProxy } from './utils';

function createStore(options) {
  const isArray = Array.isArray(options);
  const result = isArray ? [] : {};
  const keys = Object.keys(options);

  keys.map(key => {
    const value = options[key];

    if (typeof value === 'function') {
      let models = [];

      const proxy = createProxy(options, {
        getter: key => {
          if (!result[key]) return;

          const model = result[key];

          if (!models.includes(model)) {
            models.push(model);
          }
          return model.getState();
        }
      });

      const virtualModel = createVirtualModel(() => {
        models = [];

        const state = value(proxy);
        result[key].setOptions({ models });

        return state;
      });

      isArray ? result.push(virtualModel) : (result[key] = virtualModel);

    } else if (typeof value === 'object') {
      isArray ? result.push(createStore(value)) : (result[key] = createStore(value));
    } else {
      isArray ? result.push(createModel(value)) : (result[key] = createModel(value));
    }
  });

  let subscribers = [];
  keys.map(key => {
    const model = result[key];
    model.subscribe(nextValue => {
      subscribers.forEach(subscriber => {
        // TODO:: maybe we need numbered key here
        subscriber(key, nextValue, model);
      });
    });
  });

  const getState = () => {
    if (isArray) {
      return result.map(item => item.getState());
    }

    return keys.reduce((store, key) => {
      store[key] = result[key].getState();
      return store;
    }, {});
  }

  return {
    getState,
    models: result,
    subscribe: callback => {
      subscribers.push(callback);
      return () => {
        subscribers = subscribers.filter(subscriber => subscriber !== callback);
      }
    },
    publish: async (fragments, options) => {
      const isFunction = typeof fragments === 'function';
      const possiblePromise = isFunction ? fragments(getState()) : fragments;
      const snapshot = possiblePromise instanceof Promise ? await possiblePromise : possiblePromise;
      Object.entries(snapshot).forEach(([key, value]) => {
        if (!result[key]) throw new Error('You need to specify default value before publishing');
        result[key].publish(value, options);
      });
    },
  };
};

export default createStore;
