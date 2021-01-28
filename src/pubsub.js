import { isEqual, needLogs, defaultEventData } from './utils';

// Using Map as consumer storage, as getting any key from Map is O(1)
const events = new Map();

const middlewares = [];

const addMiddleware = middleware => {
  middlewares.push(middleware);
}

const applyMiddlewares = (eventName, event, prev, next, options, middlewares) => {
  if (middlewares.length) {
    const [middleware, ...rest] = middlewares;
    return middleware(eventName, event, prev, next, options, rest);
  }
}

const publish = (event, valueSetter, options) => {
  const neededEvent = getEvent(event);

  if (neededEvent.options.fireDuplicates || !isEqual(valueSetter, neededEvent.lastState)) {

    const isFunction = typeof valueSetter === 'function';
    const nextValue = isFunction ? valueSetter(neededEvent.lastState) : valueSetter;

    applyMiddlewares(event, neededEvent, neededEvent.lastState, nextValue, options, middlewares);
    neededEvent.lastState = nextValue;
    neededEvent.subscribers.forEach(callback => callback(neededEvent.lastState));
  } else {
    log(`There is no need for update: ${event}.`);
  }
}

const subscribe = (event, callback, needPrevious) => {
  const neededEvent = getEvent(event);

  needPrevious && callback(neededEvent.lastState);
  neededEvent.subscribers.push(callback);

  return () => {
    neededEvent.subscribers = neededEvent.subscribers.filter(subscription => subscription !== callback);
  }
}

const register = (event, initial, options) =>
  doesEventExist(event)
    ? log(`Event already exists: ${event}.`)
    : createEvent(event, initial, options);

const doesEventExist = event => events.has(event);

const createEvent = (event, inital, options) => {
  events.set(event, defaultEventData(inital, options));
  needLogs && console.log(`Event has been created: ${event}.`);
  return getEvent(event);
}

const getEvent = event => events.get(event);

const log = message => needLogs && console.trace(message);

export {
  publish,
  register,
  subscribe,
  addMiddleware,
};
