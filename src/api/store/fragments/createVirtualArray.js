import { createVirtualModel } from 'api/configure';
import { isFunction, isPromise } from 'utils';

const createArrayHandler = models => () => models.map(model => model.getState());

function createVirtualArray(models, creator, initialConfiguration) {
  const virtualModel = createVirtualModel({
    ...initialConfiguration,
    models,
    handler: createArrayHandler(models),
  });

  return {
    ...virtualModel,
    publish: async function (possibleNextValues, configs) {
      const possiblePromiseValues = isFunction(possibleNextValues) ? possibleNextValues(this.getState()) : possibleNextValues;
      const nextValues = isPromise(possiblePromiseValues) ? await possiblePromiseValues : possiblePromiseValues;
      // unsubscribe to not propagate on each key change
      const duplicateChangesNeeded = nextValues.length !== this.models.length;
      duplicateChangesNeeded && virtualModel.setOptions({ models: [] });

      if (nextValues.length < this.models.length) {
        const nextModels = models.filter((_, index) => index < nextValues.length);
        virtualModel.setOptions({
          handler: createArrayHandler(nextModels),
        });
        this.models = nextModels;
      }
      if (nextValues.length > this.models.length) {
        const newModelsData = nextValues.filter((_, index) => index >= this.models.length);
        const nextModels = [...models, ...newModelsData.map(newModel => creator(newModel))];
        virtualModel.setOptions({
          handler: createArrayHandler(nextModels),
        });
        this.models = nextModels;
      }
      nextValues.forEach((nextValue, index) => {
        if (index === nextValues.length - 1) {
          // subscribe back to all changes :)
          duplicateChangesNeeded && virtualModel.setOptions({
            models: this.models,
            ...(duplicateChangesNeeded && { fireDuplicates: true }),
          });
        }
        this.models[index].publish(nextValue, configs);
      });

      duplicateChangesNeeded && virtualModel.setOptions({ fireDuplicates: false });
    },
    // TODO:: remove models from API
    models,
    setOptions: function (configuration) {
      this.models.forEach(model => model.setOptions(configuration));
    }
  };
}

export default createVirtualArray;
