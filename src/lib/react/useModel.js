import { useCallback } from 'react';

import useMount from './useMount';
import useForceUpdate from './useForceUpdate';

const useModel = model => {
  const forceUpdate = useForceUpdate();

  useMount(() => model.subscribe(() => forceUpdate()));

  return model.getState();
}

export default useModel;
