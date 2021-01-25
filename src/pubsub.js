import { isEqual, needLogs, defaultEventData } from './utils';

// Using Map as consumer storage, as getting any key from Map is O(1)
const events = new Map();

/**
 * Publish
 * @param {string} event The event name that need to be published
 * @param {any} data The value, that need to be delivered to subscribers
 */
const publish = (event, data) => {
  const neededEvent = getEvent(event);

  if (neededEvent.fireDuplicates || !isEqual(data, neededEvent.lastState)) {

    if (data === undefined && !neededEvent.lastState) {
      log(`No passed data when publishing: ${event}.`);
    }

    const isFunction = typeof data === 'function';

    neededEvent.lastState = isFunction ? data(neededEvent.lastState) : data;
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
const register = (event, initial, fireDuplicates) => {
  if (getEvent(event)) return log(`Event already exists: ${event}.`);
  const neededEvent = createEvent(event, inital, fireDuplicates);
  return neededEvent;
}

/**
 * DoesEventExists
 * @param {string} event The event name to be checked
 * @return {boolean} The boolean value that describes does the event is registered or not.
 */
const doesEventExists = event => events.has(event);

/**
 * CreateEvent
 * @param {string} event The event name to be created
 */
const createEvent = (event, inital, fireDuplicates) => {
  events.set(event, defaultEventData(fireDuplicates));
  console.log(`Event has been created: ${event}.`);
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
  log,
  events,
  publish,
  register,
  subscribe,
  doesEventExists,
};
