import { configureModel } from 'helpers';

import defaultState from './defaultState';

const eventName = 'mainContainer';

const [publishMainContainer, subscribeMainContainer] = configureModel(eventName, defaultState);

export {
  publishMainContainer,
  subscribeMainContainer,
};
 