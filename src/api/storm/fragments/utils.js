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

  // collect new values
  const nextModelEntries = [];
  let hasNewKey = false;

  for (const key in nextValues) {
    if (!this.models.hasOwnProperty(key)) {
      hasNewKey = true;
      nextModelEntries.push([key, creator(nextValues[key])]);
    } else {
      nextModelEntries.unshift([key, this.models[key]]);
    }
  }

  const duplicateChangesNeeded = nextModelEntries.length !== Object.keys(this.models).length || hasNewKey;

  // unsubscribe to not propagate on each key change
  duplicateChangesNeeded && virtualModel.setOptions({
    models: [],
    handler: createObjectHandler(nextModelEntries),
  });

  // publishing models expect the last one
  this.models = {};
  for (let index = 0; index < nextModelEntries.length - 1; index++) {
    const key = nextModelEntries[index][0];
    this.models[key] = nextModelEntries[index][1];
    this.models[key].publish(nextValues[key], configs);
  }

  if (duplicateChangesNeeded) {
    // subscribe back to all changes :)
    virtualModel.setOptions({
      // NOTE::: update this case too if needed
      models: nextModelEntries.map(([, value]) => value),
      fireDuplicates: true,
    });
  }

  // execute the last one separately to update the list even if the firing was turned off manually
  const [key, model] = nextModelEntries[nextModelEntries.length - 1];
  this.models[key] = model;
  this.models[key].publish(nextValues[key], configs);
  duplicateChangesNeeded && virtualModel.setOptions({ fireDuplicates: false });
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
  duplicateChangesNeeded && virtualModel.setOptions({ freeze: true });

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

  for (let index = 0; index < nextValues.length - 1; index++) {
    this.models[index].publish(nextValues[index], configs);
  }

  if (duplicateChangesNeeded) {
    // subscribe back to all changes :)
    virtualModel.setOptions({
      models: this.models,
      freeze: false,
      fireDuplicates: true,
    });
  }

  // execute the last one separately to update the list even if the firing was turned off manually
  const lastIndex = this.models.length - 1;
  this.models[lastIndex].publish(nextValues[lastIndex], configs);
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
