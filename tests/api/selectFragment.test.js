import { createStorm, selectFragment } from 'src';

import { defaultPublishConfigs } from './constants';

describe('Subscribe to fragments of storm', () => {
  test('callback must not fire on the initialization', () => {
    const storm = createStorm({
      age: 1,
      name: 'Bob',
    });
    const mock = jest.fn();

    selectFragment(storm, (state, exact) => {
      mock();
      return 10 * exact(state.age);
    });
    expect(mock).toBeCalledTimes(0);
  });

  test('callback must fire when on virtual model getState', () => {
    const storm = createStorm({
      age: 1,
      name: 'Bob',
    });
    const mock = jest.fn();

    const model = selectFragment(storm, (state, exact) => {
      mock();
      return 10 * exact(state.age);
    });
    expect(mock).toBeCalledTimes(0);

    model.getState();
    expect(mock).toBeCalledTimes(1);
  });

  test('callback must fire when on virtual model subscription', () => {
    const storm = createStorm({
      age: 1,
      name: 'Bob',
    });
    const mock = jest.fn();

    const model = selectFragment(storm, (state, exact) => {
      mock();
      return 10 * exact(state.age);
    });

    model.subscribe(() => null);
    storm.publish({ age: 2 });

    expect(mock).toBeCalledTimes(1);
  });

  test('callback must fire when on virtual model subscription', () => {
    const storm = createStorm({
      age: 1,
      name: 'Bob',
    });
    const mock = jest.fn();

    const model = selectFragment(storm, (state, exact) => {
      mock();
      return 10 * exact(state.age);
    });

    model.subscribe(() => null);
    storm.publish({ age: 2 });

    expect(mock).toBeCalledTimes(1);

    storm.publish({ age: 2, name: 'Jane' });

    expect(mock).toBeCalledTimes(1);
  });


  test('virtual model subscription must receive correct value', () => {
    const storm = createStorm({
      age: 1,
      name: 'Bob',
    });
    const mock = jest.fn();

    const model = selectFragment(storm, (state, exact) => 10 * exact(state.age));

    model.subscribe(mock);
    storm.publish({ age: 2 });

    expect(mock).toBeCalledTimes(1);
    expect(mock).lastCalledWith(20, defaultPublishConfigs);
  });
});
