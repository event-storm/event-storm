import { noop } from 'utils';

const persisted = createStore => ({
  storageKey,
  beforeunload = noop,
  permanent = false,
}) => defaultState => {
  const storage = permanent ? window.localStorage : window.sessionStorage;
  let fragment;
  try {
    fragment = JSON.parse(storage.getItem(storageKey));
  } catch {
    fragment = {};
  }

  const store = createStore({
    ...defaultState,
    ...fragment,
  });
  window.addEventListener('beforeunload', () => {
    storage.setItem(storageKey, JSON.stringify(beforeunload(store.getState())));
  });
  return store;
};

export default persisted;