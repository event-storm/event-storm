import { useCallback } from 'react';

import { publishModel } from '../eventStore';
import useMount from './useMount';
import useForceUpdate from './useForceUpdate';

const useModel = model => {
  const forceUpdate = useForceUpdate();

  useMount(() => model.subscribe(() => forceUpdate()));

  const setState = useCallback(data => {
    publishModel(model, data);
  }, [model]);

  return [model.getState(), setState];
}

export default useModel;
