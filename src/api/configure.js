import { generateId  } from './utils';

import { isEqual, createDefault } from '../utils';
import { register, subscribe, publish } from '../pubsub';

const createModel = (defaultData, options) => {
  const event = generateId();

  const model = register(event, defaultData, options);

  return {
    event,
    getState: () => model.lastState,
    subscribe: (callback, needPrevious) => subscribe(event, callback, needPrevious),
  };
}

const createVirtualModel = (...models) => {
  return (handler, options) => {

    const virtualEvent = createDefault(handler(...models.map(model => model.getState())), options);

    models.map(model =>
      model.subscribe(() => {
        const nextState = handler(...models.map(model => model.getState()));
        if (virtualEvent.options.fireDuplcates || !isEqual(nextState, virtualEvent.lastState)) {
          virtualEvent.lastState = nextState;
          virtualEvent.subscribers.forEach(subscriber => subscriber(virtualEvent.lastState));
        }
      }),
    );

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
    });
  };
}

const publishModel = (model, data) => {
  publish(model.event, data);
}

export {
  createModel,
  publishModel,
  createVirtualModel,
}
