import { register, subscribe, publish } from './pubsub';
import { generateId } from './utils';

/**
 * createModel
 * @param {any} defaultData Models default value
 * @param {any} fireDuplcates fires subscribers on duplicate changes if set to true
 * @return {object} Model
 * @return {string} Model.event
 * @return {Function} Model.getState
 * @return {Function} Model.subscribe
 */
const createModel = (defaultData, fireDuplicates) => {
  const event = generateId();

  const model = register(event, defaultData, fireDuplicates);

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
  return handler => {
    const virtualEvent = {
      subscribers: [],
      lastState: handler(...models.map(model => model.getState())),
    }

    models.map(model =>
      model.subscribe(() => {
        virtualEvent.lastState = handler(...models.map(model => model.getState()));
        virtualEvent.subscribers.forEach(subscriber => subscriber(virtualEvent.lastState));
      })
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
