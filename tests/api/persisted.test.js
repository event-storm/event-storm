/**
 * @jest-environment jsdom
 */
import { createStore, persisted } from 'src';

describe('Creating a persisted store', () => {
  beforeEach(() => {
    window.localStorage.removeItem('event_storm');
    window.sessionStorage.removeItem('event_storm');
  });

  it('store persisted fragments must be kept up to date after reload', () => {
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

    const storeAfterUnload = persisted(createStore)({
      storageKey: 'event_storm',
      beforeunlaod: state => ({ name: state.name }),
    })(initialState);

    // expect(storeAfterUnload.getState()).toEqual({ ...initialState, ...fragment });
  });

  it('store not persisted fragments must be restored as initial', () => {
    const initialState = {
      age: 21,
      name: 'John',
      surname: 'Doe',
    };

    const fragment = {
      name: 'Jane',
      age: 25,
    }

    const store = persisted(createStore)({
      storageKey: 'event_storm',
      beforeunlaod: state => ({ name: state.name }),
    })(initialState);

    store.publish(fragment);

    expect(store.getState()).toEqual({ ...initialState, ...fragment });

    window.dispatchEvent(new Event("beforeunload"));

    const storeAfterUnload = persisted(createStore)({
      storageKey: 'event_storm',
      beforeunlaod: state => ({ name: state.name }),
    })(initialState);

    // expect(storeAfterUnload.getState()).toEqual({ ...initialState, name: 'Jane' });
  });
});
