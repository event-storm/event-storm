import addMiddlewares from 'api/middlewares';

import { collectMiddlewareState } from 'api/utils';

import { historyOptions, findDiff } from './utils';

const createHistory = (models, { captureExisting } = {}) => {
  let history = [collectMiddlewareState(models).values];
  let pointer = 1;

  const historyMiddleware = (previous, next, { fromHistory }) => {
    if (!fromHistory) {
      if (history.length > pointer) {
        history = history.filter((_, index) => index < pointer);
      }
      history.push(collectMiddlewareState(models).values);
      pointer++;
    }
  }

  addMiddlewares(models)(historyMiddleware);

  return {
    goBack: () => {
      if (pointer > 1) {
        const { key, next } = findDiff(history[pointer - 1], history[pointer - 2]);
        models[key].publish(next, historyOptions);
        pointer--;
      }
    },
    goForward: () => {
      if (pointer < history.length) {
        const { key, previous } = findDiff(history[pointer], history[pointer - 1]);
        models[key].publish(previous, historyOptions);
        pointer++;
      }
    },
    hasPrevious: () => pointer > 1,
    hasNext: () => pointer < history.length,
  }
}

export default createHistory;
