const defaultState = {};

const createDefault = ({ options = {}, ...rest }) => {
  const lastState = 'lastState' in rest ? rest.lastState : defaultState;

  return { lastState, options, subscribers: [] };
}

const noop = () => {};

const isFunction = fn => typeof fn === 'function';

const isPromise = possiblePromise => !!possiblePromise && isFunction(possiblePromise.then);

const isArray = options => Array.isArray(options);
const isUndefined = value => typeof value === 'undefined';

const isObject = options => typeof options === 'object' && options;

export { isPromise, createDefault, noop, isFunction, isArray, isObject, isUndefined };
