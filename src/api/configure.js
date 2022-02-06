import { isEqual, createDefault, noop } from 'utils';
import { registerEvent, updateEvent, subscribe, publish } from 'pubsub';

import { generateId } from './utils';

const createModel = (defaultData, configuration) => {
  const event = generateId();

  const model = registerEvent(event, defaultData, configuration);

  return {
    getState: () => model.lastState,
    publish: (data, options) => publish(event, data, { ...options }),
    setOptions: configs => updateEvent(event, configs),
    subscribe: (callback, needPrevious) => subscribe(event, callback, needPrevious),
  };
}

const createVirtualModel = ({ models = [], handler, ...options } = {}) => {
  const virtualEvent = createDefault({ options });
  virtualEvent.options.handler = handler;
  virtualEvent.options.models = models;

  const updateHandler = publishConfigs => {
    const nextState = virtualEvent.options.handler();
    if (virtualEvent.options.fireDuplicates || !isEqual(nextState, virtualEvent.lastState)) {
      virtualEvent.lastState = nextState;
      virtualEvent.subscribers.forEach(subscriber => {
        subscriber(virtualEvent.lastState, publishConfigs);
      });
    }
  }

  let subscriptions = models.map(model => model.subscribe((_, publishConfigs) => updateHandler(publishConfigs)));

  return ({
    publish: noop,
    getState: () => {
      virtualEvent.lastState = virtualEvent.options.handler();
      return virtualEvent.lastState;
    },
    subscribe: function(callback, needPrevious) {
      needPrevious && callback(this.getState());
      virtualEvent.subscribers.push(callback);
      return () => {
        virtualEvent.subscribers = virtualEvent.subscribers.filter(subscriber => subscriber !== callback);
      }
    },
    setOptions: ({
      models: newModels,
      ...newOptions
    }) => {
      const duplicateOptionChanged = typeof newOptions.fireDuplicates === 'boolean' && virtualEvent.options.fireDuplicates !== newOptions.fireDuplicates;
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
