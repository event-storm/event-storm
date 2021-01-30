import { createDefault } from '../utils';

import { needLogs } from './utils';

// Using Map as consumer storage, as getting any key from Map is O(1)
const events = new Map();

const doesEventExist = event => events.has(event);

const createEvent = (event, inital, options) => {
  events.set(event, createDefault(inital, options));
  needLogs && console.log(`Event has been created: ${event}.`);
  return getEvent(event);
}

const getEvent = event => events.get(event);

export { doesEventExist, createEvent, getEvent };
