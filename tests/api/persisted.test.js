/**
 * @jest-environment jsdom
 */
import { createStorm, persisted } from 'src';

describe('Creating a persisted storm', () => {
  beforeEach(() => {
    window.localStorage.removeItem('event_storm');
    window.sessionStorage.removeItem('event_storm');
  });

  it('storm persisted fragments must be kept up to date after reload', () => {
    const initialState = {
      age: 21,
      name: 'John',
      surname: 'Doe',
    };

    const fragment = {
      name: 'Jane',
    }

    const storm = persisted(createStorm)({
      storageKey: 'event_storm',
      beforeunload: state => ({ name: state.name }),
    })(initialState);

    storm.publish(fragment);

    window.dispatchEvent(new Event("beforeunload"));

    const storeAfterUnload = persisted(createStorm)({
      storageKey: 'event_storm',
      beforeunload: state => ({ name: state.name }),
    })(initialState);

    expect(storeAfterUnload.getState()).toEqual({ ...initialState, ...fragment });
  });

  it('storm not persisted fragments must be restored as initial', () => {
    const initialState = {
      age: 21,
      name: 'John',
      surname: 'Doe',
    };

    const fragment = {
      name: 'Jane',
      age: 25,
    }

    const storm = persisted(createStorm)({
      storageKey: 'event_storm',
      permanent: true,
      beforeunload: state => ({ name: state.name }),
    })(initialState);

    storm.publish(prev => ({ ...prev, ...fragment }));

    expect(storm.getState()).toEqual({ ...initialState, ...fragment });

    window.dispatchEvent(new Event("beforeunload"));

    const storeAfterUnload = persisted(createStorm)({
      storageKey: 'event_storm',
      beforeunload: state => ({ name: state.name }),
    })(initialState);

    expect(storeAfterUnload.getState()).toEqual({ ...initialState, name: 'Jane' });
  });

  it('on crash everything must be as initial', () => {
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: () => {
          throw new Error('testing crash');
        },
        setItem: () => {
          throw new Error('testing crash');
        }
      }
    });
    const initialState = {
      age: 21,
      name: 'John',
      surname: 'Doe',
    };

    const fragment = {
      name: 'Jane',
      age: 25,
    }

    const storm = persisted(createStorm)({
      storageKey: 'event_storm',
      beforeunload: state => ({ name: state.name }),
    })(initialState);

    storm.publish(prev => ({ ...prev, ...fragment }));

    expect(storm.getState()).toEqual({ ...initialState, ...fragment });

    window.dispatchEvent(new Event("beforeunload"));

    const storeAfterUnload = persisted(createStorm)({
      storageKey: 'event_storm',
      beforeunload: state => ({ name: state.name }),
    })(initialState);

    expect(storeAfterUnload.getState()).toEqual(initialState);
  });
});
