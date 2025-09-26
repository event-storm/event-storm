import { createDefault } from 'utils';

const events = {};

const doesEventExist = event => !!events[event];

const createEvent = (event, initial, options) => {
  events[event] = createDefault({ lastState: initial, options });
  return getEvent(event);
}

const getEvent = event => events[event];

const updateEvent = (event, options) => {
  const needed = getEvent(event);
  needed.options = options;
}

const registerEvent = (event, initial, options) => !doesEventExist(event) && createEvent(event, initial, options);

export {
  getEvent,
  updateEvent,
  registerEvent,
};
