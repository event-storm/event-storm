import { noop } from 'utils';

const persisted = createStorm => ({
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

  const storm = createStorm({
    ...defaultState,
    ...fragment,
  });
  window.addEventListener('beforeunload', () => {
    storage.setItem(storageKey, JSON.stringify(beforeunload(storm.getState())));
  });
  return storm;
};

export default persisted;