import { useRef } from 'react';

import useMount from './useMount';
import useForceUpdate from './useForceUpdate';

const useSubscription = (...subscribers) => {
  const model = useRef(Array(subscribers.length).fill(null));
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
