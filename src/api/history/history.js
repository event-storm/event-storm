import { publish, addMiddlewares } from '../../pubsub';
import { historyOptions, collectState, findDiff } from './utils';

const createHistory = (models, { captureExisting } = {}) => {
  let history = [collectState(models)];
  let pointer = 1;

  const historyMiddleware = (previous, next, { fromHistory, model }) => {
    if (!fromHistory && models.includes(model)) {
      if (history.length > pointer) {
        history = history.filter((_, index) => index < pointer);
      }
      history.push(collectState(models));
      pointer++;
    }
  }

  addMiddlewares(historyMiddleware);

  return {
    goBack: () => {
      if (pointer > 1) {
        const { index, next } = findDiff(history[pointer - 1], history[pointer - 2]);
        publish(models[index].event, next, historyOptions);
        pointer--;
      }
    },
    goForward: () => {
      if (pointer < history.length) {
        const { index, previous } = findDiff(history[pointer], history[pointer - 1]);
        publish(models[index].event, previous, historyOptions);
        pointer++;
      }
    },
    hasPrevious: () => pointer > 1,
    hasNext: () => pointer < history.length,
  }
}

export default createHistory;
