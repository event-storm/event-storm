import { useRef } from 'react';

import useMount from './useMount';
import useForceUpdate from './useForceUpdate';

const useSubscription = subscribe => {
  const model = useRef(null);
  const forceUpdate = useForceUpdate();

  useMount(() => subscribe(data => {
    model.current = data;
    // triggering update mechanism(React) to run again
    forceUpdate();
  }));

  return model.current;
};

export default useSubscription;