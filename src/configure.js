import { register, subscribe, publish } from './pubsub';
import { generateId, isEqual, defaultEventData } from './utils';

/**
 * createModel
 * @param {any} defaultData Models default value
 * @param {any} fireDuplcates fires subscribers on duplicate changes if set to true
 * @return {object} Model
 * @return {string} Model.event
 * @return {Function} Model.getState
 * @return {Function} Model.subscribe
 */
const createModel = (defaultData, options) => {
  const event = generateId();

  const model = register(event, defaultData, options);

  return {
    event,
    getState: () => model.lastState,
    subscribe: (callback, needPrevious) => subscribe(event, callback, needPrevious),
  };
}

/**
 * createVirutalModel
 * @param {Model[]} models [description]
 * @return {Function}
 */
const createVirtualModel = (...models) => {
  return (handler, options) => {

    const virtualEvent = defaultEventData(handler(...models.map(model => model.getState())), options);

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
