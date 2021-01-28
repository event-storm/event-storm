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

/**
 * Publish
 * @param {string} event The event name that need to be published
 * @param {any} valueSetter The value, that need to be delivered to subscribers
 */
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

/**
 * Subscribe
 * @param  {string} event Event name to be, on which need to register a subscription
 * @param  {Function} callback The function will be called on each next value
 * @param  {boolean} needPrevious Passing the value as true will deliver the last published state for this event
 * @return {Function} call of this function will destroy the subscription
 */
const subscribe = (event, callback, needPrevious) => {
  const neededEvent = getEvent(event);

  needPrevious && callback(neededEvent.lastState);
  neededEvent.subscribers.push(callback);

  return () => {
    neededEvent.subscribers = neededEvent.subscribers.filter(subscription => subscription !== callback);
  }
}

/**
 * Register
 * @param {string} event The event name to be registered
 * @param {any} initial Initial value of the event
 * @return {object} Event The stored object
 * @return {any} Event.lastState The last published or the initial value
 * @return {Function[]} Event.subscribers The subscriber functions list
 */
const register = (event, initial, options) =>
  doesEventExist(event)
    ? log(`Event already exists: ${event}.`)
    : createEvent(event, initial, options);

/**
 * DoesEventExist
 * @param {string} event The event name to be checked
 * @return {boolean} The boolean value that describes does the event is registered or not.
 */
const doesEventExist = event => events.has(event);

/**
 * CreateEvent
 * @param {string} event The event name to be created
 */
const createEvent = (event, inital, options) => {
  events.set(event, defaultEventData(inital, options));
  needLogs && console.log(`Event has been created: ${event}.`);
  return getEvent(event);
}

/**
 * GetEvent
 * @param {string} event The event name to get from storage
 * @return {object} Event returns the event object(creates new if not exist)
 */
const getEvent = event => events.get(event);

/**
 * Log - tracing the stack, as this will help to find the code segment that propagates the change
 * @param {string} message Message to log
 */
const log = message => {
  needLogs && console.trace(message);
}

export {
  publish,
  register,
  subscribe,
  addMiddleware,
};
