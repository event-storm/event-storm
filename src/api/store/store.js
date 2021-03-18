import { createModel, createVirtualModel } from 'api/configure';

import { createProxy } from './utils';

function createStore(options) {
  const result = {};
  const keys = Object.keys(options);
  keys.map(key => {
    const value = options[key];
    if (typeof value === 'function') {
      const models = [];
      const proxy = createProxy(options, {
        getter: key => {
          if (!result[key]) {
            result[key] = createStore({ key: value })[key];
          }
          const model = result[key];

          if (!models.includes(model)) {
            models.push(model);
          }
          return result[key].getState();
        }
      });
      result[key] = createVirtualModel(() => value(proxy));
      result[key].setOptions({ models });
    } else {
      result[key] = createModel(value);
    }
  });

  let subscribers = [];
  keys.map(key => {
    const model = result[key];
    model.subscribe(nextValue => {
      subscribers.forEach(subscriber => {
        subscriber(key, nextValue, model);
      });
    });
  });

  const getState = () => keys.reduce((store, key) => {
    store[key] = result[key].getState();
    return store;
  }, {});

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
        result[key].publish(value, options);
      });
    },
  };
};

export default createStore;
