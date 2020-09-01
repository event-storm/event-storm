import { useCallback } from 'react';

import { useMount, useForceUpdate } from 'helpers/hooks';

const useModel = model => {
  const forceUpdate = useForceUpdate();

  useMount(() => model.subscribe(() => forceUpdate()));

  return model.getState();
}

export default useModel;
