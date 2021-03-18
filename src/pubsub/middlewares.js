const middlewares = [];

const addMiddlewares = (...args) => middlewares.push(...args);

const runMiddlewares = (previous, next, options, callbacks) => {
  if (callbacks.length) {
    const [middleware, ...rest] = callbacks;
    middleware(previous, next, options);
    return runMiddlewares(previous, next, options, rest);
  }
}

const applyMiddlewares = (previous, next, options) =>
  runMiddlewares(previous, next, options, middlewares);

export { addMiddlewares, applyMiddlewares };
