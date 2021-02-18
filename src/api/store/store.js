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

  const subscribers = [];
  keys.map(key => {
    const model = result[key];
    model.subscribe(nextValue => {
      subscribers.forEach(subscriber => {
        subscriber(key, nextValue, model);
      });
    });
  })
  return {
    models: result,
    getState: () => keys.reduce((store, key) => {
      store[key] = result[key].getState();
      return store;
    }, {}),
    subscribe: callback => {
      subscribers.push(callback);
      return () => {
        subscribers = subscribers.filter(subscriber => subscriber !== callback);
      }
    },
  };
};

export default createStore;
