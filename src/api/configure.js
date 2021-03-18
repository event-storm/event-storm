import { isEqual, createDefault, noop } from 'utils';
import { registerEvent, updateEvent, subscribe, publish } from 'pubsub';

import { generateId, collectState } from './utils';

const createModel = (defaultData, options) => {
  const event = generateId();

  const model = registerEvent(event, defaultData, options);

  return {
    getState: () => model.lastState,
    publish(data, options) {
      publish(event, data, { ...options, model: this });
    },
    setOptions: options => updateEvent(event, options),
    subscribe: (callback, needPrevious) => subscribe(event, callback, needPrevious),
  };
}

const createVirtualModel = (handler, { models = [], ...options } = {}) => {
  const virtualEvent = createDefault(handler(), options);

  const updateHandler = neededModels => {
    const nextState = handler();
    if (virtualEvent.options.fireDuplcates || !isEqual(nextState, virtualEvent.lastState)) {
      virtualEvent.lastState = nextState;
      virtualEvent.subscribers.forEach(subscriber => subscriber(virtualEvent.lastState));
    }
  }

  let subscriptions = models.map(model => model.subscribe(() => updateHandler(models)));

  return ({
    publish: noop,
    getState: () => virtualEvent.lastState,
    subscribe: (callback, needPrevious) => {
      needPrevious && callback(virtualEvent.lastState);
      virtualEvent.subscribers.push(callback);
      return () => {
        virtualEvent.subscribers = virtualEvent.subscribers(subscriber => subscriber !== callback);
      }
    },
    setOptions: ({
      models: newModels = [],
      ...newOptions
    }) => {
      virtualEvent.options = { ...virtualEvent.options, ...newOptions };
      if (newModels.length) {
        subscriptions.map(unsubscribe => unsubscribe());
        subscriptions = newModels.map(model => model.subscribe(() => updateHandler(newModels)));
      }
    }
  });
}

export {
  createModel,
  createVirtualModel,
}
