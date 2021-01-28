// TODO: provide an option for changin comparizon logic
const isEqual = (next, prev) => Object.is(next, prev);

const createDefault = (lastState, options = {}) => ({ lastState, options, subscribers: [] });

export { isEqual, createDefault };
