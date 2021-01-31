import { isEqual, createDefault } from '../utils';
import { registerEvent, updateEvent, subscribe, publish } from '../pubsub';

import { generateId, collectState  } from './utils';

const createModel = (defaultData, options) => {
  const event = generateId();

  const model = registerEvent(event, defaultData, options);

  return {
    event,
    getState: () => model.lastState,
    setOptions: options => updateEvent(event, options),
    subscribe: (callback, needPrevious) => subscribe(event, callback, needPrevious),
  };
}

const createVirtualModel = (handler, { models = [], ...options } = {}) => {
  const virtualEvent = createDefault(handler(...collectState(models)), options);

  const updateHandler = neededModels => {
    const nextState = handler(...collectState(neededModels));
    if (virtualEvent.options.fireDuplcates || !isEqual(nextState, virtualEvent.lastState)) {
      virtualEvent.lastState = nextState;
      virtualEvent.subscribers.forEach(subscriber => subscriber(virtualEvent.lastState));
    }
  }

  let subscriptions = models.map(model => model.subscribe(() => updateHandler(models)));

  return ({
    event: models.map(({ event }) => event),
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

const publishModel = (model, data) => publish(model.event, data, { model });

export {
  createModel,
  publishModel,
  createVirtualModel,
}
