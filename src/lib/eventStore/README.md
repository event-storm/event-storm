# In memory event store

A tiny(` kb`) event store implementation with pure javascript.

## Motivation

Mainly in modern applications developer faces a problem to store data. As web-based applications are natively event based, it'll be nice
to have an event base store for the data. Inspired by (Event store)[https://en.wikipedia.org/wiki/Event_store].

## Basic concepts

The library consists of 2 parts: event store implementation and data model absraction. The event store supports:
- register/publish/subscribe of events
- log for development
  - event registration
  - publishing the same data twice
- option to not propagate on duplicate changes
- history object
- time travel

Data model abstraction represents pubsub implementation. The data models are of 2 types, one that are attached to a single peace of information(e.g. accelaration `V`, time `T`) and one that are combined via multiple peaces of information(e.g. road `S = f(V, T)`):
- creating a data on real information
- get last state of model at any time
- subscription to last event(even if it happens earlier)
- creating a model by combining existing models(virtual model)

## API

## Playground