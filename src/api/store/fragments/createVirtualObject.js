import { createVirtualModel } from 'api/configure';
import { isFunction, isPromise } from 'utils';

const createObjectHandler = entries => () => entries.reduce((acc, [key, value]) => {
  acc[key] = value.getState();
  return acc;
}, {});

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
      const possiblePromiseValues = isFunction(possibleNextValues) ? possibleNextValues(this.getState()) : possibleNextValues;
      const nextValues = isPromise(possiblePromiseValues) ? await possiblePromiseValues : possiblePromiseValues;
      const nextModelEntries = Object.entries(nextValues).reduce((acc, [key, value]) => {
        if (!this.models.hasOwnProperty(key)) {
          acc.push([key, creator(value)]);
        } else {
          acc.unshift([key, this.models[key]]);
        }
        return acc;
      }, []);

      const duplicateChangesNeeded = nextModelEntries.length !== Object.keys(this.models).length || nextModelEntries.some(([key]) => !this.models.hasOwnProperty(key));

      // unsubscribe to not propagate on each key change
      duplicateChangesNeeded && virtualModel.setOptions({
        models: [],
        handler: createObjectHandler(nextModelEntries),
      });

      this.models = nextModelEntries.reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

      nextModelEntries.forEach(([key, value], index) => {
        if (index  === Object.entries(nextValues).length - 1) {
          // subscribe back to all changes :)
          duplicateChangesNeeded && virtualModel.setOptions({
            models: nextModelEntries.map(([, value]) => value),
            ...(duplicateChangesNeeded && { fireDuplicates: true }),
          });
        }
        this.models[key].publish(nextValues[key], configs);
      });
      duplicateChangesNeeded && virtualModel.setOptions({
        fireDuplicates: false,
      });
    },
    models,
    // TODO:: "entries" can be wrong value, this.models is more relevant
    setOptions: (configuration) => entries.forEach(([, model]) => model.setOptions(configuration))
  };
}

export default createVirtualObject;
