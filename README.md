<a href="https://www.npmjs.com/package/event-storm"><img src="https://img.shields.io/badge/npm-event--storm-brightgreen.svg"></a> <a href="https://www.npmjs.com/package/event-storm"><img src="https://img.shields.io/npm/v/event-storm.svg"></a>

# In memory event store

**A tiny(`1.8kb` :boom:) event store implementation with pure javascript. The library has no dependencies(`Zero Dependencies`). Work for Javascript's any hoist envirenment(browser, backend, desktop).**
The library has wrapper for:
- [React](https://github.com/event-storm/react-event-storm)

## Motivation :blue_book:

Mainly in modern applications developer faces a problem to store data. **As web-based applications are natively event based, it'll be nice
to have an event base store for the data**. Inspired by (Event store :bulb:)[https://en.wikipedia.org/wiki/Event_store].

<details>
  <summary>Deep look at the concept</summary>
  Conceptually, in an event store, only the events of a dossier or policy are stored. The idea behind it is that the dossier
  or policy can be derived from these events(**Mainly the same as single source of truth**).
  The events (and their corresponding data) are the only "real" facts(**name `models` will be use in the libray scope**)
  that should be stored in the database. The instantiation of all other objects can be derived from these events.
  The code instantiates these objects in memory(**name `virtual model` will be used in library scope**). In an event store
  database, this means that all objects that should be instantiated, are not stored in the database. Instead these objects are
  instantiated 'on the fly' in memory by the code based on the events. After usage of these objects, the instantiated
  objects are removed from memory.

  Another crucial part of an event store database is that events that are stored are not allowed to be changed.
  Once stored, also erroneous events are not changed anymore. The only way to change (or better: correct) these events
  is to instantiate a new event with the new values and using the double timeline(**So as we know no mutation allowed**).
</details>

## Basic concepts

The library consists of 2 parts: event store implementation and data model absraction. The event store supports:
- :star: publish/subscribe of events
- :star: log for development
  - event registration
  - publishing the same data twice
- :star: option to not propagate on duplicate changes (n.i.)
- :boom: history object (n.i.)
- :zap: time travel (n.i.)

Data model abstraction represents pubsub implementation. The data models are of 2 types, one that are attached to a single peace of information(e.g. accelaration `V`, time `T`) and one that are combined via multiple peaces of information(e.g. road `S = f(V, T)`).
This will give following benefits:
- :pill: get last state of model at any time
- :punch: creating a data on real information
- :pushpin: subscription to last event(even if it happens earlier)
- :hammer: creating a model by combining existing models(virtual model)

## API

- createModel
  **Creating a model from a real source of data(single source of truth).**
  Example:
  ```js
  const userModel = createModel();
  ````

  When defining a model it is often usefull to have a **default value**:
  ```js
  const clientModel = createModel({});
  ```
- createVirtualModel
  The example above will show how to create a new model based on existing models.
  **Creating a model from existing ones will allow you to create some shared state which you want also to
  listen**. Both functions `createModel` and `createVirtualModel` will return you same result a virtual model,
  which you can be a subject to publish and of course subscribe. NOTE, for both cases the API remains exactly the same.

  ```js
  import { createModel, createVirtualModel } from 'event-storm';
  // real models
  const time = createModel(0);
  const velocity = createModel(10);

  // virtual model
  const road = createVirtualModel(time, velocity)((timeValue, velocityValue) => {
    return timeValue * velocityValue;
  });
  ```

  <details>
    <summary>Addvanced!</summary>

    Pay attention on virtual model's declaration. It is done by 2 phases:
    1. Creating an intermediate state for virtual model. **This is a data provider,
      which can be reused with different handlers**.
    2. Passing the processor function. The function will be fired each time any of the
      models(registered in the first phase) is changed.NOTE even for multiple subscribers
      the processor(computing) function will be fired once.
  </details>

- publishModel
  You can publish updates for your model using `publishModel` function.

  ```js
  import { createModel, publishModel } from 'event-storm';

  const time = createModel(0);
  publishModel(time, 1);
  ```

  Here is an equivalent of the previous example:

  ```js
  import { createModel, publishModel } from 'event-storm';

  const time = createModel(0);
  publishModel(time, (prev) => prev + 1);
  ```

  **Whenever your next state depends on the previous one you can just pass a function to `publishModel` to get a hook with previous model**.

  <details>
    <summary>**Publishing a virtual model will do nothing**</summary>
    Its important to notice that publishing a virtual model will cause a lot of pain in your code, as you need to
    describe the value-model map. As the virtual model is something relaying on real data,
    the best approach is to update the real data itself.
    Allowing otherwise will end up in wishes to reuse the processor function, additional descriptor for publishment,
    also syncronization issues.
  </details>

- Listening to changes
  As all applications are trying to have loose coupled modules and in many cases this modules are loading asynchronous,
  this can add additional overhead with event-based architecture. The module can regiister a subscription before/after
  the event change propagates. To see how the issue is solved lets look into the examples:

  ```js
  import { createModel } from 'event-storm';

  const userModel = createModel({});

  userModel.subscribe(newInfo => console.log(newInfo, 'update receives'));
  ```

  This example will receive changes that will be published after the subscription has been registered.

  **If you "come later" than the event has been published, pass an extra argument to the `subscribe` method**.

  ```js
  import { createModel } from 'event-storm';

  const userModel = createModel({});

  const getTheLastState = true;

  userModel.subscribe(newInfo => console.log(newInfo, 'update receives'), getTheLastState);
  ```

## Playground

You can play with a live example in the [codesandbox](https://codesandbox.io/s/serene-wood-cjvem)
