import { register, log, doesEventExists, subscribe, publish } from './pubsub';
import { generateId, isEqual } from './utils';

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
  if (doesEventExists(event)) {
    log(`There is an event already registered with name "${event}"`);
    return;
  }
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
    const info = [];
    const subscribers = [];
    const current = handler(...models.map(model => model.getState()));
    const lastState = { current };
    return ({
      event: models.map(({ event }) => event),
      getState: () => lastState.current,
      subscribe: (callback, needPrevious) => {
        // NOTE: one single model can include many subscriptions of the same event, if it is virtual.
        // Need to be considered whether we need the uniquness of the models underlyed events or not.

        const subscriptions = models.reduce((subscriptions, model, index) => {
          const subscription = model.subscribe(nextState => {
            info[index] = nextState;

            // NOTE: Some memoization can be needed if the processed value is the same as the previous one

            if (info.length === models.length) {
              const computed = handler(...info);
              if (!isEqual(computed, lastState.current)) {
                lastState.current = computed;
                subscribers.forEach(subscriber => subscriber(lastState.current));
              }
            }
          }, true);

          subscriptions.push(subscription);
          return subscriptions;
        }, []);

        needPrevious && callback(state.current);
        subscribers.push(callback);

        return () => {
          subscribers = subscribers.filter(subscriber => callback !== subscriber);
          subscriptions.forEach(unsubscribe => unsubscribe())
        };
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
