import { register, log, doesEventExists, subscribe, publish } from './eventBus';
import { generateId, isEqual } from './utils';

/**
 * createModel
 * @param {any} defaultData Models default value(if nothing passed `null` will be stored)
 * @return {object} Model
 * @return {string} Model.event
 * @return {Function} Model.getState
 * @return {Function} Model.subscribe
 */
const createModel = (defaultData = null) => {
  const event = generateId();
  if (doesEventExists(event)) {
    log(`There is an event already registered with name "${event}"`);
    return;
  }
  const model = register(event, defaultData);

  return {
    event,
    getState: () => model.lastState,
    subscribe: (callback, needPrevious) => subscribe(event, callback, needPrevious),
  };
}

/**
 * createVirutalModel
 * @param  {Model[]} models [description]
 * @return {Function}
 */
const createVirtualModel = (...models) => {
  const info = [];
  return handler => {
    const current = handler(...models.map(model => model.getState()));
    const state = { current };
    return ({
      event: models.map(({ event }) => event),
      getState: () => state.current,
      subscribe: (callback, needPrevious = true) => {
        // NOTE: one single model can include many subscriptions of the same event, if it is virtual.
        // Need to be considered wheter we need the uniqunes of the models underlyed events or not.
        const subscriptions = models.reduce((subscriptions, model, index) => {
          const subscription = model.subscribe(nextState => {
            info[index] = nextState;
            // NOTE: Some memoization can be needed if the processed value is the same as the previous one
            if (info.length === models.length) {
              const computed = handler(...info);
              if (!isEqual(computed, state.current)) {
                state.current = computed;
                callback(state.current);
              }
            }
          }, needPrevious);

          subscriptions.push(subscription);
          return subscriptions;
        }, []);

        return () => subscriptions.forEach(unsubscribe => unsubscribe());
      },
    })
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
