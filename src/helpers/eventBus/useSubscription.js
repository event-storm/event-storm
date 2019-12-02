import { useRef } from 'react';

import { useMount, useForceUpdate } from 'helpers/hooks';

import EventBus from './eventBus';

const useSubscription = (...subscribers) => {
  // default state of the ref is changing over the model life time
  const model = useRef(subscribers.map(subscribe => EventBus.events.get(subscribe.event).lastState));
  const forceUpdate = useForceUpdate();

  useMount(() => {
    const unsubscriptions = subscribers.map((subscribe, index) =>
      subscribe(data => {
        model.current[index] = data;
        // triggering update mechanism(React) to run again
        forceUpdate();
      })
    );
    return () => unsubscriptions.map(unsubscribe => unsubscribe());
  });

  return model.current;
};

export default useSubscription;
