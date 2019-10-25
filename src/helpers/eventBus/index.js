import EventBus from './eventBus';

const configure = (event, defaultState) => {
  if (!EventBus.events.has(event)) {
    EventBus.publish(event, defaultState);
  } else {
    EventBus.log(`There is an event already registered with name "${event}"`);
  }

  return [
    data => EventBus.publish(event, data),
    (callback, needPrevious = false) => EventBus.subscribe(event, callback, needPrevious),
  ];
}

export default configure;
