import { useRef, useCallback } from 'react';

import { useMount, useForceUpdate } from 'helpers/hooks';

const useModel = model => {
  const state = useRef(model.getState());
  const forceUpdate = useForceUpdate();

  useMount(() => {
    return model.subscribe(data => {
      state.current = data;
      forceUpdate();
    });
  });

  const setState = useCallback(data => {
    model.publish(data);
  }, [model.publish]);

  return [state.current, setState];
}

export default useModel;
