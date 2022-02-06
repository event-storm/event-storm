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

export { createProxy };
