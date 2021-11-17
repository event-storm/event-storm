// TODO: provide an option for changing comparison logic
const isEqual = (next, prev) => Object.is(next, prev);

const defaultState = {};

const createDefault = ({ options = {}, ...rest }) => {
  const lastState = 'lastState' in rest ? rest.lastState : defaultState;

  return { lastState, options, subscribers: [] };
}

const isDefault = state => state === defaultState;

const noop = () => {};

const isFunction = fn => typeof fn === 'function';

const isPromise = possiblePromise => possiblePromise instanceof Promise;

export { isEqual, isPromise, createDefault, noop, isDefault, isFunction };
