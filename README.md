# In memory event store

A tiny(`4kb`) event store implementation with pure javascript.

## Motivation

Mainly in modern applications developer faces a problem to store data. As web-based applications are natively event based, it'll be nice
to have an event base store for the data. Inspired by (Event store)[https://en.wikipedia.org/wiki/Event_store].

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
  Example:
  `const userModel = createModel({});`
- createVirtualModel
  ```js
  const time = createModel(0);
  const velocity = createModel(10);
  const road = createVirtualModel(time, velocity)((timeValue, velocityValue) => {
    return timeValue * velocityValue;
  });
  ```
- publishModel
  ```js
  const time = createModel(0);
  publishModel(time, 10);
  ```

  Listening to changes
  ```js
  const userModel = createModel({});
  userModel.subscribe(newInfo => console.log(newInfo, 'update receives'));

  // anywhere in application
  publishModel(userModel, { name: 'new user' });
  ```
## Playground

You can play with a live example in the [codesandbox](https://codesandbox.io/s/serene-wood-cjvem)
