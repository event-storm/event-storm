const middlewares = [];

const addMiddlewares = (...args) => {
  middlewares.push(...args);
}

const runMiddlewares = (eventName, event, prev, next, options, callbacks) => {
  if (callbacks.length) {
    const [middleware, ...rest] = callbacks;
    middleware(eventName, event, prev, next, options);
    return runMiddlewares(eventName, event, prev, next, options, rest);
  }
}

const applyMiddlewares = (eventName, event, prev, next, options) =>
  runMiddlewares(eventName, event, prev, next, options, middlewares);

export { addMiddlewares, applyMiddlewares };
