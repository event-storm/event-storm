import { needLogs } from './utils';

const log = message => needLogs && console.trace(message);

export { log };
