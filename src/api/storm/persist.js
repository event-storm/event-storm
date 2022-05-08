import { noop } from 'utils';

const persisted = createStorm => ({
  storageKey,
  beforeunload = noop,
  permanent = false,
}) => defaultState => {
  let fragment;
  try {
    const storage = permanent ? window.localStorage : window.sessionStorage;
    fragment = JSON.parse(storage.getItem(storageKey));
  } catch {
    fragment = {};
  }

  const storm = createStorm({
    ...defaultState,
    ...fragment,
  });
  window.addEventListener('beforeunload', () => {
    try {
      const storage = permanent ? window.localStorage : window.sessionStorage;
      storage.setItem(storageKey, JSON.stringify(beforeunload(storm.getState())));
    } catch {
      noop();
    }
  });
  return storm;
};

export default persisted;