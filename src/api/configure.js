import { isEqual, isFunction, createDefault, noop, isBoolean } from 'utils';
import { registerEvent, updateEvent, subscribe, publish } from 'pubsub';

import { generateId } from './utils';

const createModel = (defaultData, configuration) => {
  const event = generateId();

  const model = registerEvent(event, defaultData, configuration);

  return {
    getState: () => model.lastState,
    publish: (data, options) => publish(event, data, { ...options }),
    setOptions: configs => updateEvent(event, configs),
    subscribe: (callback, options) => subscribe(event, callback, options),
  };
}

const createVirtualModel = ({ models = [], handler, ...options } = {}) => {
  const virtualEvent = createDefault({ options });
  virtualEvent.options.handler = handler;
  virtualEvent.options.models = models;

  const updateHandler = publishConfigs => {
    const nextState = virtualEvent.options.handler();

    let skipUpdate;
    const { lastState } = virtualEvent;
    virtualEvent.lastState = nextState;
    virtualEvent.subscribers.forEach(({ callback, equalityFn }) => {
      if (virtualEvent.options.fireDuplicates) return callback(nextState, publishConfigs);

      if (isFunction(equalityFn) && !equalityFn(nextState, lastState)) return callback(nextState, publishConfigs);

      skipUpdate = isBoolean(skipUpdate) ? skipUpdate : isEqual(nextState, lastState);
      if (!skipUpdate) return callback(nextState, publishConfigs);
    });
  }

  let subscriptions = models.map(model => model.subscribe((_, publishConfigs) => updateHandler(publishConfigs)));

  return ({
    publish: noop,
    getState: () => {
      virtualEvent.lastState = virtualEvent.options.handler();
      return virtualEvent.lastState;
    },
    subscribe: function(callback, options = {}) {
      options.needPrevious && callback(this.getState());
      !virtualEvent.subscribers.some(subscription => subscription.callback === callback) && virtualEvent.subscribers.push({
        equalityFn: options.equalityFn,
        callback,
      });
      return () => {
        virtualEvent.subscribers = virtualEvent.subscribers.filter(subscription => subscription.callback !== callback);
      }
    },
    setOptions: ({
      models: newModels,
      ...newOptions
    }) => {
      const duplicateOptionChanged = isBoolean(newOptions.fireDuplicates) && virtualEvent.options.fireDuplicates !== newOptions.fireDuplicates;
      virtualEvent.options = { ...virtualEvent.options, ...newOptions };
      if (newModels) {
        subscriptions.map(unsubscribe => unsubscribe());
        virtualEvent.options.models = newModels;
        subscriptions = newModels.map(model => model.subscribe((_, publishConfigs) => updateHandler(publishConfigs)));
      }
      duplicateOptionChanged && virtualEvent.options.models.forEach(model => {
        model.setOptions({ fireDuplicates: virtualEvent.options.fireDuplicates });
      });
    }
  });
}

export {
  createModel,
  createVirtualModel,
}
