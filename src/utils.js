// TODO: provide an option for changing comparison logic
const defaultState = {};

const createDefault = ({ options = {}, ...rest }) => {
  const lastState = 'lastState' in rest ? rest.lastState : defaultState;

  return { lastState, options, subscribers: [] };
}

const isDefault = state => state === defaultState;

const noop = () => {};

const isFunction = fn => typeof fn === 'function';

const isPromise = possiblePromise => possiblePromise instanceof Promise;

export { default as isEqual } from 'fast-deep-equal';
export { isPromise, createDefault, noop, isDefault, isFunction };
