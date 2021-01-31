let counter = 0;
const generateId = () => String(Date.now() + counter++);

const collectState = models => models.map(model => model.getState());

export { generateId, collectState };
