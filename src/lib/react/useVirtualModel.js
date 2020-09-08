import useMount from './useMount';
import useForceUpdate from './useForceUpdate';

const useVirutalModel = model => {
  const forceUpdate = useForceUpdate();

  useMount(() => model.subscribe(() => forceUpdate()));

  return model.getState();
}

export default useVirutalModel;
