const defaultState = {};

const createDefault = ({ options = {}, ...rest }) => {
  const lastState = 'lastState' in rest ? rest.lastState : defaultState;

  return { lastState, options, subscribers: [] };
}

const noop = () => {};

const isFunction = fn => typeof fn === 'function';

const isArray = options => Array.isArray(options);

const isUndefined = value => typeof value === 'undefined';

export const isDefaultState = state => state === defaultState;

const isObject = options => typeof options === 'object' && options;

const isPromise = possiblePromise => !!possiblePromise && isFunction(possiblePromise.then);

export { isPromise, createDefault, noop, isFunction, isArray, isObject, isUndefined };
