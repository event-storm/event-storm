import { createVirtualModel } from 'api/configure';

import { createValueHandler, valuePublisher } from './utils';

function createVirtualValue(model, creator, initialConfiguration) {
  const virtualModel = createVirtualModel({
    ...initialConfiguration,
    models: [model],
    handler: createValueHandler(model),
  });

  return {
    ...virtualModel,
    publish: async function (possibleNextValues, configs) {
      return valuePublisher.call(this, {
        configs,
        creator,
        virtualModel,
        possibleNextValues,
      });
    },
    models: [model],
    setOptions: function(configuration) {
      this.models.forEach((model) => model.setOptions(configuration));
    }
  };
}

export default createVirtualValue;
