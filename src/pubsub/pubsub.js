import { isEqual } from 'utils';

import { log } from './logger';
import { getEvent } from './events';

const publish = async (event, valueSetter, options) => {
  const neededEvent = getEvent(event);

  if (!neededEvent) return log(`No event named ${event}`);

  if (neededEvent.options.fireDuplicates || !isEqual(valueSetter, neededEvent.lastState)) {

    const isFunction = typeof valueSetter === 'function';
    const intermediateValue = isFunction ? valueSetter(neededEvent.lastState) : valueSetter;
    const nextValue = intermediateValue instanceof Promise ? await intermediateValue : intermediateValue;

    const { lastState } = neededEvent;
    neededEvent.lastState = nextValue;
    neededEvent.subscribers.forEach(callback => callback(neededEvent.lastState, options));
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

export { publish, subscribe };
