# In memory event store

A tiny(`4kb`) event store implementation with pure javascript.

## Motivation

Mainly in modern applications developer faces a problem to store data. As web-based applications are natively event based, it'll be nice
to have an event base store for the data. Inspired by (Event store)[https://en.wikipedia.org/wiki/Event_store].

Conceptually, in an event store, only the events of a dossier or policy are stored. The idea behind it is that the dossier
or policy can be derived from these events(*Mainly the same as single source of truth*).
The events (and their corresponding data) are the only "real" facts(*name `models` will be use in the libray scope*)
that should be stored in the database. The instantiation of all other objects can be derived from these events.
The code instantiates these objects in memory(*name `virtual model` will be used in library scope*). In an event store
database, this means that all objects that should be instantiated, are not stored in the database. Instead these objects are
instantiated 'on the fly' in memory by the code based on the events. After usage of these objects, the instantiated
objects are removed from memory.

Another crucial part of an event store database is that events that are stored are not allowed to be changed.
Once stored, also erroneous events are not changed anymore. The only way to change (or better: correct) these events
is to instantiate a new event with the new values and using the double timeline(*So as we know no mutation allowed*).

## Basic concepts

The library consists of 2 parts: event store implementation and data model absraction. The event store supports:
- publish/subscribe of events
- log for development
  - event registration
  - publishing the same data twice
- option to not propagate on duplicate changes (n.i.)
- history object (n.i.)
- time travel (n.i.)

Data model abstraction represents pubsub implementation. The data models are of 2 types, one that are attached to a single peace of information(e.g. accelaration `V`, time `T`) and one that are combined via multiple peaces of information(e.g. road `S = f(V, T)`). This will give following benefits:
- creating a data on real information
- get last state of model at any time
- subscription to last event(even if it happens earlier)
- creating a model by combining existing models(virtual model)

## API

- createModel
  Creating a model from a real source of data(single source of truth).
  Example:
  `const userModel = createModel();`

  When defining a model it is often usefull to have a default value:
  `const clientModel = createModel({});`
- createVirtualModel
  The example above will show how to create a new model based on existing models.
  Creating a model from existing ones will allow you to create some shared state which you want also to
  listen. Both functions `createModel` and `createVirtualModel` will return you same result a virtual model,
  which you can be a subject to publish and of course subscribe. NOTE, for both cases the API you will use remains exactly the same, the only difference is in declaration of the models.

  <details>
    <summary>Addvanced!</summary>

    Pay attention on virtual model's declaration. It is done by 2 phases:
    1. Creating an intermediate state for virtual model. This is a data provider,
      which can be reused with different handlers.
    2. Passing the processor function. The function will be fired each time any of the
      models(registered in the first phase) is changed.NOTE even for multiple subscribers
      the processor(computing) function will be fired once.
  </details>

  ```js
  // real models
  const time = createModel(0);
  const velocity = createModel(10);

  // virtual model
  const road = createVirtualModel(time, velocity)((timeValue, velocityValue) => {
    return timeValue * velocityValue;
  });
  ```
- publishModel
  You can publish updates for your model using `publishModel` function.
  ```js
  const time = createModel(0);
  publishModel(time, 1);
  ```

  Here is an eqvivalent of the previous example:
  ```js
  const time = createModel(0);
  publishModel(time, (prev) => prev + 1);
  ```
  Whenever your next state depends on the previous one you can just pass a function to `publishModel` to get a hook with previous model.

  NOTE: Its important to notice that publishin a virtual model will cause a lot of pain in your code, as you need to describe the value-model map. As the virtual model is something relaying on real data, the best approach is to update the real data itself.
  Allowing otherwise will end up in wishes to reuse the processor function, additional descriptor for publishment, also syncronization issues. That far publish a `virtual model will do nothing`.

- Listening to changes
  ```js
  const userModel = createModel({});

  userModel.subscribe(newInfo => console.log(newInfo, 'update receives'));
  ```
## Playground

You can play with a live example in the [codesandbox](https://codesandbox.io/s/serene-wood-cjvem)
