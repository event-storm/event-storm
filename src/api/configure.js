import { createDefault, noop } from 'utils';
import { registerEvent, updateEvent, subscribe, publish } from 'pubsub';

import { generateId } from './utils';

const createModel = (defaultData, configuration) => {
  const id = generateId();

  const event = registerEvent(id, defaultData, configuration);

  return {
    getState: () => event.lastState,
    publish: (data, options) => {
      publish(id, data, { ...options });
    },
    setOptions: configs => updateEvent(id, configs),
    subscribe: (callback, options) => subscribe(id, callback, options),
  };
}

const createVirtualModel = ({ models = [], handler, ...options } = {}) => {
  const virtualEvent = createDefault({ options });
  virtualEvent.options.handler = handler;
  virtualEvent.options.models = models;

  const updateHandler = publishConfigs => {
    const nextState = virtualEvent.options.handler();
    
    const { lastState } = virtualEvent;
    virtualEvent.lastState = nextState;
    virtualEvent.subscribers.forEach(({ callback }) => {
      if (virtualEvent.options.fireDuplicates) return callback(nextState, publishConfigs);
      
      if (nextState !== lastState) return callback(nextState, publishConfigs);
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
        callback,
      });
      return () => {
        virtualEvent.subscribers = virtualEvent.subscribers.filter(subscription => subscription.callback !== callback);
      }
    },
    setOptions: ({
      models: newModels,
      handler: newHandler = virtualEvent.options.handler,
      ...newOptions
    }) => {
      virtualEvent.options = {
        ...virtualEvent.options,
        ...newOptions,
        handler: newHandler
      };
      if (newModels) {
        subscriptions.map(unsubscribe => unsubscribe());
        virtualEvent.options.models = newModels;
        subscriptions = newModels.map(model => model.subscribe((_, publishConfigs) => updateHandler(publishConfigs)));
      }
      virtualEvent.options.models.forEach(model => {
        model.setOptions(newOptions);
      });
    }
  });
}

export {
  createModel,
  createVirtualModel,
}
