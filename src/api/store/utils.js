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

const isFunction = value => typeof value === 'function';
const isObject = value => typeof value === 'object';
const isPrimitive = value => !isObject(value) && !isFunction(value);

export { createProxy, isPrimitive, isObject, isFunction };
