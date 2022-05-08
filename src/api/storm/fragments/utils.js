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

  // unsubscribe to not propagate on each key change
  virtualModel.setOptions({
    freeze: true,
    // NOTE::: update this case too if needed
    models: nextModelEntries.map(([, value]) => value),
    ...((
      hasNewKey || nextModelEntries.length !== this.models.length
    ) && { handler: createObjectHandler(nextModelEntries) }),
  });

  // publishing models
  this.models = {};
  for (let index = 0; index < nextModelEntries.length; index++) {
    const key = nextModelEntries[index][0];
    this.models[key] = nextModelEntries[index][1];
    this.models[key].publish(nextValues[key], configs);
  }

  // unfreeze all the models
  virtualModel.setOptions({
    freeze: false,
  });
}

const arrayPublisher = async function({
  configs,
  creator,
  virtualModel,
  possibleNextValues,
}) {
  const possiblePromiseValues = isFunction(possibleNextValues) ? possibleNextValues(this.getState()) : possibleNextValues;
  const nextValues = isPromise(possiblePromiseValues) ? await possiblePromiseValues : possiblePromiseValues;
  // unsubscribe to not propagate on each key change
  let areModelsTheSame = true;

  if (nextValues.length < this.models.length) {
    const nextModels = this.models.filter((_, index) => index < nextValues.length);
    virtualModel.setOptions({
      handler: createArrayHandler(nextModels),
    });
    this.models = nextModels;
    areModelsTheSame = false;
  }
  if (nextValues.length > this.models.length) {
    const newModelsData = nextValues.filter((_, index) => index >= this.models.length);
    const nextModels = [...this.models, ...newModelsData.map(newModel => creator(newModel))];
    virtualModel.setOptions({
      handler: createArrayHandler(nextModels),
    });
    this.models = nextModels;
    areModelsTheSame = false;
  }

  // unsubscribe to not propagate on each key change
  virtualModel.setOptions({
    freeze: true,
    models: this.models,
    ...(!areModelsTheSame && { handler: createArrayHandler(this.models) }),
  });

  for (let index = 0; index < nextValues.length; index++) {
    this.models[index].publish(nextValues[index], configs);
  }

  // unfreeze all the models
  virtualModel.setOptions({
    freeze: false,
  });
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
