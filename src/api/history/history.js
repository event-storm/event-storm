import { publish, addMiddlewares } from '../../pubsub';
import { historyOptions, collectState, findDiff } from './utils';

const createHistory = ([models], { captureExisting }) => {
  const history = [collectState()];
  let pointer = 0;

  const historyMiddleware = (previous, next, { fromHistory, model }) => {
    if (!fromHistory && models.includes(model)) {
      history.push(collectState());
      pointer++;
    }
  }

  addMiddlewares(historyMiddleware);

  return {
    goBack: () => {
      if (pointer > 0) {
        const { index, next } = findDiff(history[pointer], history[pointer - 1]);
        publish(models[index], next, historyOptions);
      }
    },
    goForward: () => {
      if (pointer < history.length - 1) {
        const { index, previous } = findDiff(history[pointer], history[pointer + 1]);
        publish(models[index], previous, historyOptions);
      }
    },
    hasPrevious: () => pointer > 0,
    hasNext: () => pointer < history.length - 1,
  }
}

export default createHistory;
