const needLogs = process.env.NODE_ENV === 'development';
const messagePrefix = 'Event strom:';

const log = (message, trace = true) => needLogs && (trace ? console.trace(messagePrefix, message) : console.log(messagePrefix, message));

export { log };
