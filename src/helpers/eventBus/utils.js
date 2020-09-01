// NOTE:: more relevant comparison needed
export const isEqual = (next, prev) => Object.is(next, prev);

export const needLogs = process.env.NODE_ENV === 'development';

let counter = 0;
export const generateId = () => String(Date.now() + counter++);

export const defaultEventData = () => ({ handler: null, lastState: null, subscribers: [] });