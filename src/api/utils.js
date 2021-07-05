let counter = 0;
const generateId = () => String(Date.now() + counter++);

const collectState = models => models.map(model => model.getState());

const collectMiddlewareState = models => {

  const entries = Object.entries(models);

  return {
    entries,
    values: entries.reduce((result, [key, model]) => {
      result[key] = model.getState();
      return result;
    }, {}),
  };
}

export { generateId, collectState, collectMiddlewareState };
