import { createModel, createVirtualModel } from 'api/configure';

import { createProxy, isFunction, isPrimitive, isObject } from './utils';

function createStore(options) {
  if (isFunction(options)) throw new Error('Argument can\'t be a function');

  if (isPrimitive(options)) return createModel(options);

  const isOptionsArray = Array.isArray(options);
  let result = isOptionsArray ? [] : {};
  let keys = isOptionsArray ? options.map((_, order) => order) : Object.keys(options);
  keys.map(key => {
    const value = options[key];
    if (isFunction(value)) {
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
      result[key] = createVirtualModel(() => {
        models = [];
        const state = value(proxy);
        result[key].setOptions({ models });
        return state;
      });
    } else {
      result[key] = isObject(value) ?  createStore(value) : createModel(value);
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
  }, isOptionsArray ? [] : {});

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
      const possiblePromise = isFunction(fragments) ? fragments(getState()) : fragments;
      const snapshot = possiblePromise instanceof Promise ? await possiblePromise : possiblePromise;
      if (isOptionsArray) {
        // losing old subscriptions here
        keys = fragments.map((_, order) => order);
        result = createStore(snapshot);
      } else {
        Object.entries(snapshot).forEach(([key, value]) => {
          if (!result.hasOwnProperty(key)) {
            result[key] = createStore(value);
            keys.push(key);
            return;
          }
          result[key].publish(value, options);
        });
      }
    },
  };
};

export default createStore;
