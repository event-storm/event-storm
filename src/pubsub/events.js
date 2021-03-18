import { createDefault } from 'utils';

import { needLogs } from './utils';

const events = {};

const doesEventExist = event => !!events[event];

const createEvent = (event, inital, options) => {
  events[event] = createDefault(inital, options);
  needLogs && console.log(`Event has been created: ${event}.`);
  return getEvent(event);
}

const getEvent = event => events[event];

const updateEvent = (event, options) => {
  const needed = getEvent(event);
  needed.options = { ...needed.options, ...options };
}

const registerEvent = (event, initial, options) =>
  doesEventExist(event)
    ? log(`Event already exists: ${event}.`)
    : createEvent(event, initial, options);

export {
  getEvent,
  updateEvent,
  registerEvent,
};
