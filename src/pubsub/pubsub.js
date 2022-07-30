import { isPromise, isFunction } from 'utils';

import { getEvent } from './events';

const publish = async (event, valueSetter, { force, ...publishConfigs }) => {
  const neededEvent = getEvent(event);

  const intermediateValue = isFunction(valueSetter) ? valueSetter(neededEvent.lastState) : valueSetter;
  const nextState = isPromise(intermediateValue) ? await intermediateValue : intermediateValue;

  const { lastState } = neededEvent;
  neededEvent.lastState = nextState;

  const fireDuplicates = publishConfigs.fireDuplicates || neededEvent.options.fireDuplicates;
  neededEvent.subscribers.forEach(({ callback }) => {
    if (fireDuplicates || force) return callback(nextState, publishConfigs);

    if (nextState !== lastState) return callback(nextState, publishConfigs);
  });
}

const subscribe = (event, callback, options = {}) => {
  const neededEvent = getEvent(event);

  options.needPrevious && callback(neededEvent.lastState);
  !neededEvent.subscribers.some(subscription => subscription.callback === callback) && neededEvent.subscribers.push({ callback });

  return () => {
    neededEvent.subscribers = neededEvent.subscribers.filter(subscription => subscription.callback !== callback);
  }
}

export { publish, subscribe };
