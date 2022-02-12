import { createVirtualModel } from 'api/configure';

const subscribe = Symbol('subscribe');

const mirror = _ => _;
const exact = fragment => fragment[subscribe];

function createProxyRecursive(data, onChange) {
  const proxy = new Proxy(data, {
    get: (target, prop) => {
      if (prop === subscribe) {
        onChange(target);
        return;
      }
      return createProxyRecursive(target.models[prop], onChange);
    },
  });
  return proxy;
}

const selectFragment = (storm, callback) => {
  const models = [];
  const virtualModel = createVirtualModel({ handler: mirror, models: [storm] });
  const changeHandler = () => callback(storm.getState(), mirror);

  const firstCallhandler = () => {
    const result = callback(
      createProxyRecursive(storm, model => models.push(model)),
      exact,
    );
    virtualModel.setOptions({ handler: changeHandler, models });
    return result;
  }
  virtualModel.setOptions({ handler: firstCallhandler });

  return virtualModel;
}

export default selectFragment;
