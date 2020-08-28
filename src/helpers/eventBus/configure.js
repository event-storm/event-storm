import { register, log, doesEventExists, subscribe, publish } from './eventBus';

const createModel = (event, defaultData) => {
  if (doesEventExists(event)) {
    log(`There is an event already registered with name "${event}"`);
    return;
  }
  const model = register(event, defaultData);

  return {
    event,
    getState: () => model.lastState,
    publish: nextState => publish(event, nextState),
    subscribe: (callback, needPrevious) => {
      return subscribe(event, callback, needPrevious);
    },
  };
}

const createVirtualModel = (...models) => {
  const info = {};
  const needPrevious = true;
  return handler => ({
    getState: () => {
      const result = models.reduce((state, model) => {
        state[model.event] = model.getState();
        return state;
      }, {});
      return handler(result);
    },
    subscribe: callback => {
      const subscriptions = models.reduce((subscriptions, model) => {
        const subscription = model.subscribe((nextState) => {
          info[model.event] = nextState;
          Object.keys(info).length === models.length && callback(handler(info));
        }, needPrevious);

        subscriptions.push(subscription);
        return subscriptions;
      }, []);

      return () => subscriptions.forEach(subscription => subscription());
    }
  });
}

export {
  createModel,
  createVirtualModel,
}
