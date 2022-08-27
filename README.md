<a href="https://www.npmjs.com/package/event-storm"><img src="https://img.shields.io/badge/npm-event--storm-brightgreen.svg"></a> <a href="https://www.npmjs.com/package/event-storm"><img src="https://img.shields.io/npm/v/event-storm.svg"></a> [![publish](https://github.com/event-storm/event-storm/actions/workflows/publish.yml/badge.svg?branch=master)](https://github.com/event-storm/event-storm/actions/workflows/dispatch.yml) <a href="https://www.npmjs.com/package/event-storm"><img src="https://img.shields.io/bundlephobia/minzip/event-storm?style=plastic"> </a>
[![codecov](https://codecov.io/gh/event-storm/event-storm/branch/dev/graph/badge.svg?token=1AT35BHEIC)](https://codecov.io/gh/event-storm/event-storm)


# Introduction to Event Storm

**The Event Storm is a tiny store implementation with pure javascript.**
Event Storm will help to organize and manage your application's state. The library is deigned to be framework and platform agnotics, which empowers an ability to use it, in **any Javascript runtime**.

There is an official **[React wrapper](https://github.com/event-storm/react-event-storm)** of the Event Storm.

### When to use Event Storm? 

- Large scale application with a lot of data consumers(1K+)
- The application is doing a lot of CPU intensive computations
- The bundle size limited applications(library size 2kb)
- Microservice applications(no matter using the same technology for microservices or not)

## Installation

To install the library run:
```bash
# npm
npm i event-storm

# yarn
yarn add event-storm
```

### Simple example

```typescript
import { createStorm } from 'event-storm';

const defaultState = {
  name: 'Event Storm',
  isActive: false,
}

const storm = createStorm(defaultState);

// subscribing to listen all the changes
store.subscribe((state, access) => console.log(access(store)));

// subscribing to listen only partial changes
store.subscribe((state, access) => console.log(access(store.name)));

// update the state
store.dispatch({ name: 'Event Storm - manage your state effectively' });

// use previous state to make the updates
store.dispatch(prev => ({ isActive: !prev.isActive }));
```

### See it in action

Examples:
 - [**Typescript**](https://codesandbox.io/s/beautiful-currying-bl9dv)
 - [**React**](https://codesandbox.io/s/intelligent-http-iupz5)

## [Documentation](https://eventstorm.tech/)
