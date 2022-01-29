import { createModel } from 'api/configure';

import { createVirtualObject, createVirtualArray } from './fragments';
import { isArray, isObject } from './utils';

function createStorm(options, configuration) {
  if (isArray(options)) {
    const optionModels = options.map((option) =>
      createStorm(option, configuration)
    );
    return createVirtualArray(optionModels, createStorm, configuration);
  } else if (isObject(options)) {
    const optionsModels = Object.entries(options).reduce(
      (acc, [key, value]) => {
        acc[key] = createStorm(value, configuration);
        return acc;
      },
      {}
    );
    return createVirtualObject(optionsModels, createStorm, configuration);
  } else {
    return createModel(options, configuration);
  }
}

export default createStorm;
