import { createDefault } from 'utils';
import { registerEvent, updateEvent, subscribe, dispatch } from 'pubsub';

import { generateId } from './utils';

const createModel = (defaultData, configuration) => {
  const id = generateId();

  const event = registerEvent(id, defaultData, configuration);

  return {
    getState: () => event.lastState,
    dispatch: (data, options) => {
      dispatch(id, data, { ...options });
    },
    setOptions: configs => updateEvent(id, configs),
    subscribe: (callback, options) => subscribe(id, callback, options),
  };
}

const createVirtualModel = ({ models = [], handler, ...options } = {}) => {
  const virtualEvent = createDefault({ options });
  virtualEvent.options.handler = handler;
  virtualEvent.options.models = models;

  const updateHandler = dispatchConfigs => {
    const nextState = virtualEvent.options.handler();
    
    const { lastState } = virtualEvent;
    virtualEvent.lastState = nextState;
    virtualEvent.subscribers.forEach(({ callback }) => {
      if (virtualEvent.options.fireDuplicates) return callback(nextState, dispatchConfigs);
      
      if (nextState !== lastState) return callback(nextState, dispatchConfigs);
    });
  }

  let subscriptions = models.map(model => model.subscribe((_, dispatchConfigs) => updateHandler(dispatchConfigs)));

  return ({
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
        subscriptions = newModels.map(model => model.subscribe((_, dispatchConfigs) => updateHandler(dispatchConfigs)));
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
