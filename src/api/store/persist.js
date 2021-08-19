import { noop } from 'utils';

const persisted = createStore => ({
  storageKey,
  beforeunload = noop,
  permanent = false,
}) => defaultState => {
  const storage = permanent ? window.localStorage : window.sessionStorage;
  const store = createStore({
    ...defaultState,
    ...(JSON.parse(storage.getItem(storageKey)) || {}),
  });
  window.addEventListener('beforeunload', () => {
    storage.setItem(storageKey, JSON.stringify(beforeunload(store.getState())));
  });
  return store;
};

export default persisted;