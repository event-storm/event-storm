import { createVirtualModel } from 'api/configure';

import { createObjectHandler, objectPublisher } from './utils';

function createVirtualObject(models, creator, initialConfiguration) {
  const entries = Object.entries(models);
  const virtualModel = createVirtualModel({
    ...initialConfiguration,
    models: entries.map(([, value]) => value),
    handler: createObjectHandler(entries),
  });

  return {
    ...virtualModel,
    publish: async function (possibleNextValues, configs) {
      return objectPublisher.call(this, {
        configs,
        creator,
        virtualModel,
        possibleNextValues,
      });
    },
    models,
    setOptions: function (configuration) {
      Object.values(this.models).forEach((model) => model.setOptions(configuration));
    }
  };
}

export default createVirtualObject;
