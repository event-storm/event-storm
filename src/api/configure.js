import { isFunction, createDefault, noop, isBoolean } from 'utils';
import { registerEvent, updateEvent, subscribe, publish } from 'pubsub';

import { generateId } from './utils';

const createModel = (defaultData, configuration) => {
  const id = generateId();

  const event = registerEvent(id, defaultData, configuration);
  let freezePublishConfigs = null;
  let freezeTimes = 0;

  return {
    getState: () => event.lastState,
    publish: (data, options) => {
      if (event.options.freeze) {
        freezePublishConfigs = options;
      }
      publish(id, data, { ...options });
    },
    setOptions: configs => {
      if (isBoolean(configs.freeze)) {
        configs.freeze ? freezeTimes++ : freezeTimes--;
      }
      updateEvent(id, configs);
      if (!freezeTimes && freezePublishConfigs !== null) {
        publish(id, event.lastState, { ...(freezePublishConfigs || {}), force: true });
        freezePublishConfigs = null;
      }
    },
    subscribe: (callback, options) => subscribe(id, callback, options),
  };
}

const createVirtualModel = ({ models = [], handler, ...options } = {}) => {
  const virtualEvent = createDefault({ options });
  virtualEvent.options.handler = handler;
  virtualEvent.options.models = models;

  const updateHandler = publishConfigs => {
    if (virtualEvent.options.freeze) return;
    const nextState = virtualEvent.options.handler();
    
    const { lastState } = virtualEvent;
    virtualEvent.lastState = nextState;
    virtualEvent.subscribers.forEach(({ callback, equalityFn }) => {
      if (virtualEvent.options.fireDuplicates) return callback(nextState, publishConfigs);
      
      if (isFunction(equalityFn) && !equalityFn(nextState, lastState)) return callback(nextState, publishConfigs);
      
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
        equalityFn: options.equalityFn,
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
