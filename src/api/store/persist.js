const persisted = createStore => ({
  storageKey,
  beforeunload,
  permanent = false,
}) => defaultState => {
  const storage = permanent ? window.localStorage : window.sessionStorage;
  window.addEventListener('beforeunload', () => {
    storage.setItem(storageKey, JSON.stringify(beforeunload(store.getState())));
  });
  return createStore({
    ...defaultState,
    ...(JSON.parse(storage.getItem(storageKey)) || {}),
  });
};

export default persisted;