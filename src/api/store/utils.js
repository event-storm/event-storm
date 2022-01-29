const createProxy = (target, options) => {
  const proxy = {};
  const keys = Object.keys(target);
  keys.forEach(key => {
    Object.defineProperty(proxy, key, {
      get: () => options.getter(key),
    });
  });
  return proxy;
}

const isArray = options => Array.isArray(options);
const isObject = options => typeof options === 'object' && options !== null;

export { createProxy, isArray, isObject };
