import { configureModels } from 'helpers';

const options = {
  event1: 0,
  event2: 'test',
  event3: ({ event1, event2 }) => event1 + event2,
};

const { subscribers, publishers } = configureModels(options);

export default {
  ...subscribers,
  ...publishers,
}
