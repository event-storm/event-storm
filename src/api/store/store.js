import { createModel } from 'api/configure';

import { createVirtualObject, createVirtualArray } from './fragments';
import { isArray, isObject } from './utils';

function createStore(options, configuration) {
  if (isArray(options)) {
    const optionModels = options.map((option) =>
      createStore(option, configuration)
    );
    return createVirtualArray(optionModels, createStore, configuration);
  } else if (isObject(options)) {
    const optionsModels = Object.entries(options).reduce(
      (acc, [key, value]) => {
        acc[key] = createStore(value, configuration);
        return acc;
      },
      {}
    );
    return createVirtualObject(optionsModels, createStore, configuration);
  } else {
    return createModel(options, configuration);
  }
}

export default createStore;
