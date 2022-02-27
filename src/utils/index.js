const defaultState = {};

const createDefault = ({ options = {}, ...rest }) => {
  const lastState = 'lastState' in rest ? rest.lastState : defaultState;

  return { lastState, options, subscribers: [] };
}

const isDefault = state => state === defaultState;

const noop = () => {};

const isFunction = fn => typeof fn === 'function';

const isPromise = possiblePromise => isFunction(possiblePromise.then);

const isArray = options => Array.isArray(options);
const isBoolean = value => typeof value === 'boolean';

const isObject = options => typeof options === 'object' && options !== null;

export { default as isEqual } from './isEqual';
export { isPromise, createDefault, isBoolean, noop, isDefault, isFunction, isArray, isObject };
