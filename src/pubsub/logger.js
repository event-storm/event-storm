const configs = {
  needLogs: process.env.NODE_ENV === 'development',
}

const configure = options => {
  for (let key in options) {
    configs[key] = options[key];
  }
}

const messagePrefix = 'Event strom:';

const log = (message, trace = true) => configs.needLogs && (trace ? console.trace(messagePrefix, message) : console.log(messagePrefix, message));

export { log, configure };
