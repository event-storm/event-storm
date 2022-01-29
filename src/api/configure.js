import { isEqual, createDefault, noop } from 'utils';
import { registerEvent, updateEvent, subscribe, publish } from 'pubsub';

import { generateId } from './utils';

const createModel = (defaultData, options) => {
  const event = generateId();

  const model = registerEvent(event, defaultData, options);

  return {
    getState: () => model.lastState,
    publish: (data, options) => publish(event, data, { ...options }),
    setOptions: options => updateEvent(event, options),
    subscribe: (callback, needPrevious) => subscribe(event, callback, needPrevious),
  };
}

const createVirtualModel = ({ models = [], handler, ...options } = {}) => {
  const virtualEvent = createDefault({ options });
  virtualEvent.options.handler = handler;
  virtualEvent.options.models = models;

  const updateHandler = () => {
    const nextState = virtualEvent.options.handler();
    if (virtualEvent.options.fireDuplicates || !isEqual(nextState, virtualEvent.lastState)) {
      virtualEvent.lastState = nextState;
      virtualEvent.subscribers.forEach(subscriber => {
        subscriber(virtualEvent.lastState);
      });
    }
  }

  let subscriptions = models.map(model => model.subscribe(updateHandler));

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
        subscriptions = newModels.map(model => model.subscribe(updateHandler));
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
