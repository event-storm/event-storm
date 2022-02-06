const addMiddlewares = modelsObject => {
  const middlewares = [];
  const entries = Object.entries(modelsObject);

  let values = entries.reduce((result, [key, model]) => {
    result[key] = model.getState();
    return result;
  }, {});

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
