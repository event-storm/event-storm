import { defaultEventData, needLogs } from '../utils';

// Using Map as consumer storage, as getting any key from Map is O(1)
const events = new Map();

const doesEventExist = event => events.has(event);

const createEvent = (event, inital, options) => {
  events.set(event, defaultEventData(inital, options));
  needLogs && console.log(`Event has been created: ${event}.`);
  return getEvent(event);
}

const getEvent = event => events.get(event);

export { doesEventExist, createEvent, getEvent };
