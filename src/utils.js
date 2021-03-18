// TODO: provide an option for changing comparison logic
const isEqual = (next, prev) => Object.is(next, prev);

const createDefault = (lastState, options = {}) => ({ lastState, options, subscribers: [] });

const noop = () => {};

export { isEqual, createDefault, noop };
