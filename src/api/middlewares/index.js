import { collectMiddlewareState } from 'api/utils';

const addMiddlewares = models => {
  const middlewares = [];

  let { entries, values } = collectMiddlewareState(models);
  entries.forEach(([key, model]) => {
    model.subscribe((nextValue, options) => {
      const nextValues = { ...values, [key]: nextValue };
      middlewares.forEach(middleware => {
        middleware(values, nextValues, options);
      });
      values = nextValues;
    });
  });
  return (...middleware) => {
    middlewares.push(...middleware);
  }
}

export default addMiddlewares;
