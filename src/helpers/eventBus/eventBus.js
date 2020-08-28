import { isEqual, needLogs, defaultEventData } from './utils';

const events = new Map();

const publish = (event, data) => {
  const neededEvent = getEvent(event);

  if (!isEqual(data, neededEvent.lastState)) {

    if (data === undefined && !neededEvent.lastState) {
      log(`There is no passed data for published event named ${event}. Use "null" instead of "undefined" as default.`);
    }

    const isFunction = typeof data === 'function';

    neededEvent.lastState = isFunction ? data(neededEvent.lastState) : data;
    neededEvent.subscribers.forEach(callback => callback(neededEvent.lastState));
  } else {
    log(`There is no need for update. Unnecassary event publishment ${event}`);
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

const register = (event, initial) => {
  const neededEvent = getEvent(event);
  neededEvent.lastState = initial;
  return neededEvent;
}

const doesEventExists = event => events.has(event);

const createEvent = event => {
  events.set(event, defaultEventData());
  console.log(`Event: ${event} created`);
}

const getEvent = event => {
  if (!doesEventExists(event)) {
    // TODO:: consider proper sulution
    createEvent(event);
  }

  return events.get(event);
}

const log = message => {
  needLogs && console.trace(message);
}

export {
  log,
  events,
  publish,
  register,
  subscribe,
  doesEventExists,
};
