import { register, log, doesEventExists, subscribe, publish } from './eventBus';
import { generateId } from './utils';

const createModel = defaultData => {
  const event = generateId();
  if (doesEventExists(event)) {
    log(`There is an event already registered with name "${event}"`);
    return;
  }
  const model = register(event, defaultData);

  return {
    event,
    getState: () => model.lastState,
    subscribe: (callback, needPrevious) => {
      return subscribe(event, callback, needPrevious);
    },
  };
}

const createVirtualModel = (...models) => {
  const info = [];
  return handler => ({
    event: models.map(({ event }) => event),
    getState: () => handler(models.map(model => model.getState())),
    subscribe: (callback, needPrevious = true) => {
      const uniqueModels = [];
      models.forEach(model => {
        !uniqueModels.includes(model.event) && uniqueModels.push(model);
      });
      const subscriptions = uniqueModels.reduce((subscriptions, model) => {
        const subscription = model.subscribe((nextState, index) => {
          info[index] = nextState;
          info.length === models.length && callback(handler(info));
        }, needPrevious);

        subscriptions.push(subscription);
        return subscriptions;
      }, []);

      return () => subscriptions.forEach(subscription => subscription());
    },
  });
}

export {
  createModel,
  createVirtualModel,
}
