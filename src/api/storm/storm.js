import { produce, setAutoFreeze } from 'immer';

import { isArray, isFunction, isObject, isUndefined, isEmpty } from 'utils';

const mirror = _ => _;
const subscribe = Symbol('subscribe');
const exact = fragment => {
  const result = fragment?.[subscribe];
  return result || fragment;
};
// This is required to create a different proxy on top of internal state
// https://immerjs.github.io/immer/freezing
setAutoFreeze(false);

const createProxyRecursive = (destination, sendPath, rootPath = '') => {
  const proxyObject = new Proxy(destination, {
    get: (target, prop) => {
      if (prop === subscribe) {
        sendPath(rootPath);
        return destination;
      }
      // Symbols cannot be coerced to strings in template literals —
      // return the raw value without path tracking
      if (typeof prop === 'symbol') {
        return destination[prop];
      }
      if (destination[prop] && isObject(destination[prop])) {
        return createProxyRecursive(
          destination[prop],
          sendPath,
          `${rootPath}${isArray(target) ? `[${prop}]` : `${rootPath ? '.' : ''}${prop}`}`
        );
      }
      sendPath(
        `${rootPath}${isArray(target) ? `[${prop}]` : `${rootPath ? '.' : ''}${prop}`}`
      );

      return destination[prop];
    }
  });
  return proxyObject;
};

// When a branch is replaced wholesale (e.g. reset to an empty object/array), the
// values that lived under it cease to exist. Their subscribers are watching paths
// that will never appear in a merge diff, so we enumerate the old subtree's paths
// explicitly and emit them — otherwise a component bound to a now-gone leaf would
// never learn its value disappeared.
const collectPaths = (value, rootPath, paths) => {
  if (!isObject(value)) return paths;
  for (let key in value) {
    const childPath = `${rootPath}${isArray(value) ? `[${key}]` : `.${key}`}`;
    paths.push(childPath);
    collectPaths(value[key], childPath, paths);
  }
  return paths;
};

const mergeRecursive = (state, partialState, configs, paths = [], rootPath = '') => {
  if (isArray(state) && isArray(partialState)) {
    partialState.forEach((item, index) => {
      paths.push(`${rootPath}[${index}]`);
      if (isUndefined(state[index])) {
        state[index] = item;
      } else {
        if (partialState[index] && isObject(partialState[index]) && !isEmpty(partialState[index])) {
          return mergeRecursive(state[index], partialState[index], configs, paths, `${rootPath}[${index}]`);
        } else {
          isEmpty(partialState[index]) && collectPaths(state[index], `${rootPath}[${index}]`, paths);
          state[index] = partialState[index];
        }
      }
    });
    state.length = partialState.length;
    return paths;
  }

  if (isObject(partialState)) {
    for (let key in partialState) {
      const childPath = `${rootPath}${rootPath ? '.' : ''}${key}`;
      if (!(key in state)) {
        paths.push(childPath);
        state[key] = partialState[key];
      } else if (isEmpty(partialState[key]) && (configs.fireDuplicates || state[key] !== partialState[key])) {
        collectPaths(state[key], childPath, paths);
        paths.push(childPath);
        state[key] = partialState[key];
      } else if (isObject(partialState[key]) && partialState[key] && (configs.fireDuplicates || state[key] !== partialState[key])) {
        paths.push(childPath);
        if (partialState[key] && state[key]) {
          mergeRecursive(state[key], partialState[key], configs, paths, childPath);
        } else {
          state[key] = partialState[key];
        }
      } else if (configs.fireDuplicates || state[key] !== partialState[key]) {
        state[key] = partialState[key];
        paths.push(childPath);
      }
    }
    return paths;
  }
  if (configs.fireDuplicates || state !== partialState) {
    state = partialState;
  }

  return paths;
};

const createStorm = (defaultState, configs) => {
  let lastState = defaultState;
  let subscribersTree = {};
  let middlewares = [];
  return {
    getState: () => lastState,
    subscribe: callback => {
      let subscriptionPaths = new Set();
      const proxyStore = createProxyRecursive(lastState, pathString => {
        pathString && subscriptionPaths.add(pathString);
      });
      callback(proxyStore, exact);

      !subscriptionPaths.size && subscriptionPaths.add('default', callback);

      subscriptionPaths.forEach(subscriptionPath => {
        subscribersTree[subscriptionPath] = subscribersTree[subscriptionPath] || [];
        subscribersTree[subscriptionPath].push(callback);
      });

      return () => {
        subscriptionPaths.forEach(subscriptionPath => {
          if (subscribersTree[subscriptionPath]) {
            subscribersTree[subscriptionPath] = subscribersTree[subscriptionPath]
              .filter(subscription => subscription !== callback);
          }
        });
      };
    },
    addMiddleware: middleware => {
      middlewares.push(middleware);
      return () => {
        middlewares = middlewares.filter(installedMiddleware => installedMiddleware !== middleware);
      }
    },
    dispatch: (partialState, publishConfigs) => {
      let updatePaths;
      const nextPatch = isFunction(partialState) ? partialState(lastState) : partialState;
      const nextState = produce(lastState, draftState => {
        updatePaths = mergeRecursive(draftState, nextPatch, { ...configs, ...(publishConfigs || {})});
      });

      const args = [nextState, lastState];
      !isUndefined(publishConfigs) && args.push(publishConfigs);
      middlewares.forEach(middleware => middleware(...args));
      lastState = nextState;
      
      updatePaths.forEach(updatePath => {
        if (subscribersTree[updatePath]) {
          subscribersTree[updatePath].forEach(subscriber => {
            subscriber(lastState, mirror);
          });
        }
      });
      subscribersTree.default?.forEach(subscriber => subscriber(lastState, mirror));
    }
  };
};

export default createStorm;
