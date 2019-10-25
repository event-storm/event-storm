class EventBus {

  static needLogs = process.env.NODE_ENV === 'development';

  events = new Map();

  publish(event, data) {
    this.initEvent(event);

    const neededEvent = this.events.get(event);

    if (!Object.is(data, neededEvent.lastState)) {      

      if (data === undefined && !neededEvent.lastState) {
        this.log(`There is no passed data for published event named ${event}. Use "null" instead of "undefined"`);
      }

      neededEvent.lastState = data;
      neededEvent.subscribers.forEach(callback => callback(neededEvent.lastState));
    } else {
      this.log(`There is no need for update. Unnecassary event publishment ${event}`);
    }
  }

  subscribe(event, callback, needPrevious) {
    this.initEvent(event);

    const neededEvent = this.events.get(event);

    needPrevious && callback(neededEvent.lastState);
    neededEvent.subscribers.push(callback);

    return () => {
      neededEvent.subscribers = neededEvent.subscribers.filter(subscription => subscription !== callback);
    }
  }

  initEvent(event) {
    if (!this.events.has(event)) {
      this.events.set(event, {
        subscribers: [],
        lastState: null,
      });
    }
  }

  log(message) {
    EventBus.needLogs && console.trace(message);
  }
};

const eventBus = new EventBus();

export default eventBus;
