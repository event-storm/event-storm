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
      return createProxyRecursive(target.models[prop], onChange); // maybe must be somehow recursive
    },
  });
  return proxy;
}

const subscribeToFragments = (storm, callback) => {
  const subsrciptions = [];
  const changeHandler = () => callback(storm.getState(), mirror);

  callback(createProxyRecursive(storm, () => subsrciptions.push(storm.subscribe(changeHandler))), exact);

  return () => {
    subsrciptions.forEach(unsubscribe => unsubscribe());
  }
}

export default subscribeToFragments;
