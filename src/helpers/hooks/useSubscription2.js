import { useState } from 'react';

import useMount from './useMount';

const useSubscription = subscribe => {

  const [state, setState] = useState(null);

  useMount(() => subscribe(setState));

  return state;
};

export default useSubscription;
