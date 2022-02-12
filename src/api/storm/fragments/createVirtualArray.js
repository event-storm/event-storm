import { createVirtualModel } from 'api/configure';

import { createArrayHandler, arrayPublisher } from './utils';

function createVirtualArray(models, creator, initialConfiguration) {
  const virtualModel = createVirtualModel({
    ...initialConfiguration,
    models,
    handler: createArrayHandler(models),
  });

  return {
    ...virtualModel,
    publish: async function (possibleNextValues, configs) {
      return arrayPublisher.call(this, {
        configs,
        creator,
        virtualModel,
        possibleNextValues,
      });
    },
    models,
    setOptions: function (configuration) {
      this.models.forEach(model => model.setOptions(configuration));
    }
  };
}

export default createVirtualArray;
