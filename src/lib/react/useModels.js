import useMount from './useMount';
import useForceUpdate from './useForceUpdate';

const useModels = (...models) => {
  const forceUpdate = useForceUpdate();

  useMount(() => {
    const subscriptions = models.map(model => model.subscribe(() => forceUpdate()));
    return () => subscriptions.map(unsubscribe => unsubscribe());
  });

  return models.map(model => model.getState());
}

export default useModels;
