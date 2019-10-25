import { useReducer } from 'react';

const useFrorceUpdate = () => {
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
  return forceUpdate;
}

export default useFrorceUpdate;
