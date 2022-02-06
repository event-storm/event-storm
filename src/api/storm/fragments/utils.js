import { isFunction, isPromise, isArray, isObject } from 'utils';

const createObjectHandler = modelEntries => () => modelEntries.reduce((acc, [key, value]) => {
  acc[key] = value.getState();
  return acc;
}, {});

const createArrayHandler = models => () => models.map(model => model.getState());

const createValueHandler = model => () => model.getState();

const objectPublisher = async function({
  configs,
  creator,
  virtualModel,
  possibleNextValues,
}) {
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

  nextModelEntries.forEach(([key], index) => {
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
}

const arrayPublisher = async function ({
  configs,
  creator,
  virtualModel,
  possibleNextValues,
}) {
  const possiblePromiseValues = isFunction(possibleNextValues) ? possibleNextValues(this.getState()) : possibleNextValues;
  const nextValues = isPromise(possiblePromiseValues) ? await possiblePromiseValues : possiblePromiseValues;
  // unsubscribe to not propagate on each key change
  const duplicateChangesNeeded = nextValues.length !== this.models.length;
  duplicateChangesNeeded && virtualModel.setOptions({ models: [] });

  if (nextValues.length < this.models.length) {
    const nextModels = this.models.filter((_, index) => index < nextValues.length);
    virtualModel.setOptions({
      handler: createArrayHandler(nextModels),
    });
    this.models = nextModels;
  }
  if (nextValues.length > this.models.length) {
    const newModelsData = nextValues.filter((_, index) => index >= this.models.length);
    const nextModels = [...this.models, ...newModelsData.map(newModel => creator(newModel))];
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
}

const valuePublisher = async function({
  configs,
  creator,
  virtualModel,
  possibleNextValues,
}) {
  const possiblePromiseValues = isFunction(possibleNextValues) ? possibleNextValues(this.getState()) : possibleNextValues;
  const nextValues = isPromise(possiblePromiseValues) ? await possiblePromiseValues : possiblePromiseValues;
  if (isArray(nextValues) && nextValues.length) {
    return arrayPublisher.call(this, {
      configs,
      creator,
      virtualModel,
      possibleNextValues: nextValues,
    });
  } else if (isObject(nextValues) && Object.keys(nextValues).length) {
    return objectPublisher.call(this, {
      configs,
      creator,
      virtualModel,
      possibleNextValues: nextValues,
    });
  } else {
    this.models[0].publish(nextValues, configs);
  }
}

export {
  valuePublisher,
  arrayPublisher,
  objectPublisher,
  createValueHandler,
  createArrayHandler,
  createObjectHandler,
};
