import { configureModels } from 'helpers';

const options = {
  test1: 0,
  test2: 'test',
  test3: ({ test1, test2 }) => console.log(test1, test2) || test1 + test2,
};

const { subscribers, publishers } = configureModels(options);

export default {
  ...subscribers,
  ...publishers,
}
