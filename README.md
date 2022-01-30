<a href="https://www.npmjs.com/package/event-storm"><img src="https://img.shields.io/badge/npm-event--storm-brightgreen.svg"></a> <a href="https://www.npmjs.com/package/event-storm"><img src="https://img.shields.io/npm/v/event-storm.svg"></a> [![Publish](https://github.com/event-storm/event-storm/actions/workflows/publish.yml/badge.svg?branch=master)](https://github.com/event-storm/event-storm/actions/workflows/publish.yml) <a href="https://www.npmjs.com/package/event-storm"><img src="https://img.shields.io/bundlephobia/minzip/event-storm?style=plastic"> </a>

# In memory event store

**A tiny event store implementation with pure javascript. The library has no dependencies(`Zero Dependencies`).**
The library has a wrapper for:
- [React](https://github.com/event-storm/react-event-storm)

## Motivation :blue_book:

Mainly in modern applications, developers are facing problems to store data. Currently the community is using [Redux](https://redux.js.org/), [MobX](https://mobx.js.org/README.html), [overmind](https://overmindjs.org/), etc for this purpose. **As web-based applications are natively event-based, it'll be nice
to have an event-based store for the data**. This library is an implementation of event-based data storage inspired by [Event store](https://en.wikipedia.org/wiki/Event_store) :bulb:.
It is called to create an in-memory event sourcing storage.

## What is the library focus?

The main focus areas of the library are
- performance
- runtime optimizations
- simple API
- better development experience

### Performance (TODO:: state management ownership, Context.Provider)
The above-mentioned libraries(and not only them) are using a **centralized concept of keeping the information**.
What does this mean?
When creating a store it is described as an object and also it corresponds to a single tree in the memory.
The main way to achieve an update is by changing a reference in the in-memory tree. For listening to the events you need to
subscribe to some node(which is not a subscription). You can take a look at this [simple example](https://codesandbox.io/s/redux-update-81zjv?file=/src/store/index.js). "anyway updated" is logging at any time something in the store changes. The main problem here is the centralized data store. To determine whether the change is needed for one or another consumer a centralized store needs to calculate the exact usage, then prevent the update.
The library is suggesting a decentralized store with a single user interface as before. This means you will describe and act with the store like usual. Under the hood, it will keep each node separate. This will allow us to not calculate each time whether or not to prevent the update.

<details>
  <summary>Deep look at the concept</summary>
  Conceptually, in an event store, only the events of a dossier or policy are stored. The idea behind it is that the dossier or policy can be derived from these events(**Mainly the same as the single source of truth**).
  The events (and their corresponding data) are the only "real fact"s(**name `model` will be used in the library scope**)
  that should be stored in the database. The instantiation of all other objects can be derived from these events.
  The derived data will be instantiated in memory(**name `virtual model` will be used in library scope**). In an event store database, this means that all objects that should be derived, are not stored in the database. Instead, these objects are instantiated 'on the fly' in memory by the code based on the events. After usage of these objects, the instantiated
  objects are removed from memory.

  Another crucial part of an event store database is that events that are stored are not allowed to be changed.
  The only way to change (or better: correct) these events is to instantiate a new event with the new values(**So as we know no mutation allowed**).
</details>

## Basic concepts

The library consists of 2 parts: event store implementation and data model abstraction. The event store supports:
- :star: publish/subscribe of models
- :star: not propagates on duplicate changes(configurable)
- :boom: middlewares support
- :zap: store persistence

With the store you can:
- :pill: get the last state of the store at any time
- :punch: creating data on real information
- :pushpin: subscription to last event(even if it happens earlier)
- :hammer: combine the existing information to derive(compute) some information

## API (TODO:: update the API section)

- Store
  **Creating a store**

  ```js
  import { createStore } from 'event-storm';

  const store = createStore({
    taxes: 20,
    grossSalary: 100_000,
  });

  console.log(store.getState()) // { taxes: 20, grossSalary: 100_000 }

  ```
  **Updating the store information**
  ```js
  import { createStore } from 'event-storm';

  const store = createStore({
    taxes: 20,
    grossSalary: 100_000,
  });
  store.publish({ taxes: 100 });
  console.log(store.getState()); // { taxes: 100, grossSalary: 200_000 }

  store.publish({ taxes: 150, grossSalary: 300_000 });
  console.log(store.getState()); // { taxes: 150, grossSalary: 300_000 }
  ```
  **Subscribe/unsubscribe to store changes**
  ```js
  import { createStore } from 'event-storm';

  const store = createStore({
    taxes: 20,
    grossSalary: 100_000,
  });
  // the third argument will be discussed earlier
  const subscription = store.subscribe((key, nextValue, model) => {
    console.log(key, nextValue, model); // "taxes" "100" ModelObject
  });

  store.publish({ taxes: 100 });

  subscription();

  store.publish({ taxes: 70 }); // the handler will not be fired
  ```

  **Deriving a state in the store**
  ```js
  import { createStore } from 'event-storm';

  const store = createStore({
    taxes: 20,
    grossSalary: 100_000,
    netSalary: ({ taxes, grossSalary }) => grossSalary * (100 - taxes) / 100,
  });

  console.log(store.getState().netSalary); // 80_000

  store.publish({ taxes: 40 });

  console.log(store.getState().netSalary); // 60_000
  ```

  **Advanced store usage**
  As mentioned above the store is decentralized. Any piece of information can be also used independently from the store. The peace of information is called the "model". When creating a store, under the hood it creates "models".

  **Accessing the models**
  ```js
  import { createStore } from 'event-storm';

  const store = createStore({
    taxes: 20,
    grossSalary: 100_000,
  });

  const {
    taxes: taxesModel,
    grossSalary: grossSalaryModel,
  } = store.models;
  ```

  As mentioned above you can use the models independently. Each model will give:
  - an access to last state
  - a subscription
  - own publishment method
  ```js
  import { createStore } from 'event-storm';

  const store = createStore({
    taxes: 20,
    grossSalary: 100_000,
  });

  const { taxes: taxesModel } = store.models;

  console.log(taxes.getState()); // 20;

  taxes.publish(40);

  taxes.subscribe(nextValue => {
    console.log(nextValue); // 40
  });

  console.log(taxes.getState()); // 40;
  ```

  **Functional publish**.
  Updating the store may require having the store's previous state. For that purpose you can use the following:
  ```js
  import { createStore } from 'event-storm';

  const store = createStore({
    taxes: 20,
    grossSalary: 100_000,
  });

  store.publish(prevState => ({
    ...prevState
    taxes: prevState.taxes + 10,
  }));

  console.log(store.getState()); // { taxes: 30, grossSalary: 100_000 }
  ```

  **Asynchronous publish**
  For asynchronous events, it's also possible to `await` the publish process
  ```js
  import { createStore } from 'event-storm';

  const store = createStore({
    taxes: 20,
    grossSalary: 100_000,
  });

  await store.publish(async prevState => {
    const promise = Promise.resolve().then(() => ({
      ...prevState
      taxes: prevState.taxes + 10,
    }));
    const result = await promise;
    // Some stuff after async operation is done;
    return result;
  });

  // some stuff after the store publish is done on async operation
  console.log(store.getState()); // { taxes: 30, grossSalary: 100_000 }
  ```
- Creating a model manually(source of truth)
  **createModel**
  ```js
  import { createModel } from 'event-storm';

  const userModel = createModel();
  // When defining a model it is often usefull to have a **default value**:
  const clientModel = createModel({});

  /* NOT RECOMMENDED!
   You can also pass the second parameter to `createModel`, which will make the model propagate on duplicate changes. Most likely if the code depends on the duplicated event it needs to be refactored,
   instead of firing the same event twice.
  */

  const anyModel = createModel({}, { fireDuplicates: true });
  ```
  **Model API**
  ```js
  const popupModel = createModel(true);

  const subscription = popupModel.subscribe(nextValue => {
    console.log(nextValue); // false
  });


  /* As mentioned above the API is the same.
   It's possible to make a functional and asynchronous publish process for a single model.
   */
  popupModel.publish(false);

  console.log(popupModel.getState()); // false

  subscription();

  popupModel.publish(false); // the callback will not be fired
  ```
- Model API with state derivation
  **createVirtualModel**
  The example above will show how to create a new model based on existing models.
  **Creating a model from existing ones will allow you to create some shared state which you want also to
  listen**. Both functions `createModel` and `createVirtualModel` will return you the same result(a model),
  which will be a subject to subscribe. NOTE, for both cases the API remains exactly the same.
  ```js
  import { createModel, createVirtualModel } from 'event-storm';
  // real models
  const time = createModel(0);
  const velocity = createModel(10);

  // virtual model
  const road = createVirtualModel(() => {
    return time.getState() * velocity.getState();
  }, { models: [time, velocity] });

  road.subscribe(nextValue => {
    console.log(nextValue); // 10
  });

  time.publish(1);
  ```
  The second argument is responsible for updates. Whenever any provided model is updated, the handler function will be triggered.
  This will also cause the subscribers update.
  <details>
    <summary>Advanced!</summary>

    Pay attention to the virtual model's declaration. The 2nd argument is the configuration,
    which can be skipped initially.
    This is done for cases when you want to propagate changes depend on some condition.
    You can always change the models which you want to listen. Just call:
    <code>virtualModel.setOptions({ models: [/* any models here */] })</code>
  </details>
- Middlewares
  **Middlewares are needed to intercept to publishing process, to capture some values**
    ```js
    import { addMiddlewares, createStore } from 'event-storm';

    const store = createStore({
      taxes: 20,
      grossSalary: 100_000,
    });

    addMiddlewares(store.models)((prevValue, nextValue) => {
      // some stuff
    });
    /* Also, the method supports multiples middlewares addition at once.
      addMiddlewares(store)(handler1, handler2, ..., handlerN);
    */
    ```
- Store Persistence
You can easly make your store any segment to be persisted by `persisted` function.
```js
import { createStore, persisted } from 'event-storm';

const createPersistedStore = persisted(createStore)({
  storageKey: 'some_store_key',
  beforeunload: state => ({
    users: state.users,
  }),
});

const defaultState = {
  users: [],
  age: 15,
  loading: false,
};

const store = createPersistedStore(defaultState);
```

`storageKey` is **required property**. It will specify where to keep the persisted data in the storage.
`beforeunload` method is called right before the browser unload event. It will receive the current store state as an argument.
It can return any store fragment as a return value. The return value will be persisted.

By default the `sessionStorage` is used to store the persisted data. To change the storage to `localStorage` you can set the
`permanent` property to `true`:

```js
import { createStore, persisted } from 'event-storm';

const createPersistedStore = persisted(createStore)({
  permanent: true,
  storageKey: 'some_store_key',
  beforeunload: state => ({
    users: state.users,
  }),
});

const defaultState = {
  users: [],
  age: 15,
  loading: false,
};

const store = createPersistedStore(defaultState);
```

- Log for development
The library is outputing logs when **NODE_ENV** is set to `'development'`. To disable this log you can simply do this:
```js
import { configure } from 'event-storm';

configure({ needLogs: false });
```

## Playground

Examples:
 - [**Typescript**](https://codesandbox.io/s/beautiful-currying-bl9dv)
 - [**React**](https://codesandbox.io/s/intelligent-http-iupz5)
