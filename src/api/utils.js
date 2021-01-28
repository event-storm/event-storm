let counter = 0;
const generateId = () => String(Date.now() + counter++);

export { generateId };
