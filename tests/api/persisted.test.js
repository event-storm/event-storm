/**
 * @jest-environment jsdom
 */
import { createStore, persisted } from 'src';

describe('Creating a persisted store', () => {
  test('store persisted fragments must be kept up to date after reload', () => {
    const initialState = {
      age: 21,
      name: 'John',
      surname: 'Doe',
    };

    const fragment = {
      name: 'Jane',
    }

    const store = persisted(createStore)({
      storageKey: 'event_storm',
      beforeunlaod: state => ({ name: state.name }),
    })(initialState);

    store.publish(fragment);

    window.dispatchEvent(new Event("beforeunload"));

    expect(store.getState()).toEqual({ ...initialState, ...fragment });
  });
});
