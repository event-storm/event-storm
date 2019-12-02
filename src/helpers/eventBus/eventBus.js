import { mapToObject, isEqual } from './utils';

class EventBus {

  static needLogs = process.env.NODE_ENV === 'development';

  events = new Map();

  publish(event, data) {
    const isFunction = typeof data === 'function';

    const neededEvent = this.getEvent(event);

    if (!isEqual(data, neededEvent.lastState)) {      

      if (data === undefined && !neededEvent.lastState) {
        this.log(`There is no passed data for published event named ${event}. Use "null" instead of "undefined"`);
      }

      neededEvent.lastState = isFunction ? data(neededEvent.lastState, mapToObject(this.events)) : data;
      neededEvent.subscribers.forEach(callback => callback(neededEvent.lastState));

      !neededEvent.isComposed && this.triggerComposedEvents();
    } else {
      this.log(`There is no need for update. Unnecassary event publishment ${event}`);
    }
  }

  subscribe(event, callback, needPrevious) {
    const neededEvent = this.getEvent(event);

    needPrevious && callback(neededEvent.lastState);
    neededEvent.subscribers.push(callback);

    return () => {
      neededEvent.subscribers = neededEvent.subscribers.filter(subscription => subscription !== callback);
    }
  }

  triggerComposedEvents() {
    this.events.forEach((value, event) => {
      if (value.isComposed) {
        const nextState = value.handler(mapToObject(this.events));
        if (!isEqual(nextState, value.lastState)) {
          this.publish(event, nextState);
        }
      }
    });
  }

  register(event, initial) {
    const neededEvent = this.getEvent(event);
    if (typeof initial === 'function') {
      neededEvent.isComposed = true;
      neededEvent.handler = initial;
      neededEvent.lastState = neededEvent.handler(mapToObject(this.events));
    } else {
      neededEvent.isComposed = false;
      neededEvent.handler = null;
      neededEvent.lastState = initial;
    }
  }

  getEvent(event) {
    if (!this.events.has(event)) {
      this.events.set(event, {
        handler: null,
        lastState: null,
        subscribers: [],
        isComposed: false,
      });
    }

    return this.events.get(event);
  }

  log(message) {
    EventBus.needLogs && console.trace(message);
  }
};

const eventBus = new EventBus();

export default eventBus;
