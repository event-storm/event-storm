// TODO: provide an option for changing comparison logic
const isEqual = (next, prev) => Object.is(next, prev);

const defaultState = {};

const createDefault = ({ lastState = defaultState, options = {} }) => ({ lastState, options, subscribers: [] });

const isDefault = state => state === defaultState;

const noop = () => {};

export { isEqual, createDefault, noop, isDefault };
