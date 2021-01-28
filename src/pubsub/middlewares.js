const middlewares = [];

const addMiddleware = middleware => {
  middlewares.push(middleware);
}

const runMiddlewares = (eventName, event, prev, next, options, middlewares) => {
  if (middlewares.length) {
    const [middleware, ...rest] = middlewares;
    return middleware(eventName, event, prev, next, options, rest);
  }
}

const applyMiddlewares = (eventName, event, prev, next, options) =>
  runMiddlewares(eventName, event, prev, next, options, middlewares);

export { addMiddleware, applyMiddlewares };
