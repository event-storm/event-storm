import { createModel, createVirtualModel } from 'api/configure';
import { isPromise, isFunction } from 'utils';

import { createProxy } from './utils';

function createStore(options) {
  const isArray = Array.isArray(options);
  const result = isArray ? [] : {};
  const keys = Object.keys(options);

  const generateStoreFragment = (key, value) => {
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

      const virtualModel = createVirtualModel(() => {
        models = [];

        const state = value(proxy);
        result[key].setOptions({ models });

        return state;
      });

      isArray ? result.push(virtualModel) : (result[key] = virtualModel);

    } else if (typeof value === 'object' && value !== null) {
      isArray ? result.push(createStore(value)) : (result[key] = createStore(value));
    } else {
      isArray ? result.push(createModel(value)) : (result[key] = createModel(value));
    }
  };

  keys.map(key => generateStoreFragment(key, options[key]));

  let subscribers = [];
  const establishSubscription = key => {
    const model = result[key];
    model.subscribe(nextValue => {
      subscribers.forEach(subscriber => {
        // TODO:: maybe we need numbered key here
        subscriber(key, nextValue, model);
      });
    });
  };

  keys.map(key => establishSubscription(key));

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
    publish: async (fragments, publishOptions = {}) => {
      const possiblePromise = isFunction(fragments) ? fragments(getState()) : fragments;
      const snapshot = isPromise(possiblePromise) ? await possiblePromise : possiblePromise;

      Object.entries(snapshot).forEach(([key, value]) => {
        if (!result[key]) {
          generateStoreFragment(key, value);
          establishSubscription(key);
          publishOptions.fireDuplicates = true;
        }
        result[key].publish(value, publishOptions);
      });
    },
  };
};

export default createStore;
