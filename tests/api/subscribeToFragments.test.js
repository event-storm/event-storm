import { createStorm, subscribeToFragments } from 'src';

describe('Subscribe to fragments of storm', () => {
  test('subscription must work', () => {
    const storm = createStorm({
      age: 1,
      name: 'Bob',
    });
    const mock = jest.fn();

    const revokable = subscribeToFragments(storm, (state, exact) => {
      mock();
      return 10 * exact(state.age);
    });

    expect(mock).toBeCalledTimes(1);

    storm.publish({ age: 3 });
    expect(mock).toBeCalledTimes(2);
  });
});
