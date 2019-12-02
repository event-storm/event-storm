import EventBus from './eventBus';

import { capitalize } from './utils';

const configure = options => Object.keys(options).reduce((models, event) => {
  const defaultState = options[event];

  if (!EventBus.events.has(event)) {
    EventBus.register(event, defaultState);
  } else {
    EventBus.log(`There is an event already registered with name "${event}"`);
  }

  // NOTE:: "needPrevious" default value needs to proofed by usage
  const subscribe = function(callback, needPrevious = true) {
    return EventBus.subscribe(event, callback, needPrevious);
  }

  subscribe.event = event;

  const capitalizedEvent = capitalize(event);

  models.publishers[`publish${capitalizedEvent}`] = data => EventBus.publish(event, data);
  models.subscribers[`subscribe${capitalizedEvent}`] = subscribe;

  return models;
}, {
  subscribers: {},
  publishers: {},
});

export default configure;
