import { produce, setAutoFreeze } from 'immer';

import { isArray, isFunction, isObject, isUndefined } from 'utils';

const mirror = _ => _;
const subscribe = Symbol('subscribe');
const exact = fragment => {
  fragment?.[subscribe];
  return fragment;
};
// This is required to create a different proxy on top of internal state
// https://immerjs.github.io/immer/freezing
setAutoFreeze(false);

const createProxyRecursive = (destination, sendPath, rootPath = '') => {
  const proxyObject = new Proxy(destination, {
    get: (target, prop) => {
      if (prop === subscribe) {
        sendPath(rootPath);
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

const mergeRecursive = (state, partialState, paths = [], rootPath = '') => {
  if (isArray(state) && isArray(partialState)) {
    partialState.forEach((item, index) => {
      paths.push(`${rootPath}[${index}]`);
      if (isUndefined(state[index])) {
        state[index] = item;
      } else {
        if (partialState[index]) {
          return mergeRecursive(state[index], partialState[index], paths, `${rootPath}[${index}]`);
        } else {
          state[index] = partialState[index];
        }
      }
    });
    state.length = partialState.length;
    return paths;
  }

  for (let key in partialState) {
    if (!(key in state)) {
      paths.push(`${rootPath}${`${rootPath ? '.' : ''}${key}`}`);
      state[key] = partialState[key];
    } else if (isObject(partialState[key]) && partialState[key] && state[key] !== partialState[key]) {
      paths.push(`${rootPath}${`${rootPath ? '.' : ''}${key}`}`);
      if (partialState[key] && state[key]) {
        return mergeRecursive(state[key], partialState[key], paths, `${rootPath}${rootPath ? '.' : ''}${key}`);
      } else {
        state[key] = partialState[key];
      }
    } else if (state[key] !== partialState[key]) {
      state[key] = partialState[key];
      paths.push(`${rootPath}${`${rootPath ? '.' : ''}${key}`}`);
    }
  }
  return paths;
};

const createStorm = defaultState => {
  let lastState = defaultState;
  let subscribersTree = {};
  let middlewares = [];
  return {
    getState: () => lastState,
    subscribe: (callback = exact) => {
      let subscriptionPath;
      const proxyStore = createProxyRecursive(lastState, pathString => {
        subscriptionPath = pathString || 'default';
      });
      callback(proxyStore, exact);

      subscribersTree[subscriptionPath] = subscribersTree[subscriptionPath] || [];
      subscribersTree[subscriptionPath].push(callback);
      return () => {
        subscribersTree[subscriptionPath] = subscribersTree[subscriptionPath]
          .filter(subscription => subscription !== callback);
      };
    },
    addMiddleware: middleware => {
      middlewares.push(middleware);
      return () => {
        middlewares = middlewares.filter(installedMiddleware => installedMiddleware !== middleware);
      }
    },
    dispatch: (partialState, configs) => {
      let updatePaths;
      const nextState = produce(lastState, draftState => {
        const nextState = isFunction(partialState) ? partialState(draftState) : partialState;
        updatePaths = mergeRecursive(draftState, nextState);
      });

      middlewares.forEach(middleware => middleware(nextState, lastState, configs));
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
