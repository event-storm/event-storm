import { useCallback } from 'react';

import { useMount, useForceUpdate } from 'helpers/hooks';
import { publish } from './eventBus';

const useModel = model => {
  const forceUpdate = useForceUpdate();

  useMount(() => model.subscribe(() => forceUpdate()));

  const setState = useCallback(data => {
    publish(model.event, data);
  }, [model.event]);

  return [model.getState(), setState];
}

export default useModel;
