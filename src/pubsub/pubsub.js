import { isEqual, isPromise, isFunction, isBoolean } from 'utils';

import { getEvent } from './events';

const publish = async (event, valueSetter, publishConfigs) => {
  const neededEvent = getEvent(event);

  if (!neededEvent) return;

  const intermediateValue = isFunction(valueSetter) ? valueSetter(neededEvent.lastState) : valueSetter;
  const nextState = isPromise(intermediateValue) ? await intermediateValue : intermediateValue;

  let skipUpdate;
  const { lastState } = neededEvent;
  neededEvent.lastState = nextState;
  neededEvent.subscribers.forEach(({ equalityFn, callback }) => {
    if (publishConfigs.fireDuplicates || neededEvent.options.fireDuplicates) return callback(nextState, publishConfigs);

    if (isFunction(equalityFn) && !equalityFn(nextState, lastState)) return callback(nextState, publishConfigs);

    skipUpdate = isBoolean(skipUpdate) ? skipUpdate : isEqual(nextState, lastState);
    if (!skipUpdate) return callback(nextState, publishConfigs);
  });
}

const subscribe = (event, callback, options = {}) => {
  const neededEvent = getEvent(event);

  options.needPrevious && callback(neededEvent.lastState);
  !neededEvent.subscribers.some(subscription => subscription.callback === callback) && neededEvent.subscribers.push({ equalityFn: options.equalityFn, callback });

  return () => {
    neededEvent.subscribers = neededEvent.subscribers.filter(subscription => subscription.callback !== callback);
  }
}

export { publish, subscribe };
