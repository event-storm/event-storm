import { isEqual, isPromise, isFunction } from 'utils';

import { log } from './logger';
import { getEvent } from './events';

const publish = async (event, valueSetter, options) => {
  const neededEvent = getEvent(event);

  if (!neededEvent) return;

  const intermediateValue = isFunction(valueSetter) ? valueSetter(neededEvent.lastState) : valueSetter;
  const nextValue = isPromise(intermediateValue) ? await intermediateValue : intermediateValue;

  if (options.fireDuplicates || neededEvent.options.fireDuplicates || !isEqual(nextValue, neededEvent.lastState)) {
    neededEvent.lastState = nextValue;
    neededEvent.subscribers.forEach(callback => callback(neededEvent.lastState, options));
  } else {
    // TODO:: needs to output more informative and visible log
    // log(`There is no need for update: ${event}.`);
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
