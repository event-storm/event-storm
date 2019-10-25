import React, { useState, useCallback, memo } from 'react';

import { subscribeMainContainer } from 'models';
import { useSubscription } from 'helpers/hooks';

const Third = () => {
  const [counter, setCounter] = useState(0);
  const clickHandler = useCallback(() => setCounter(prev => prev + 1), []);

  const data = useSubscription(callback => subscribeMainContainer(callback, true));
  console.log(data,  '>>>>>Data')

  return (
    <div style={{ background: 'blue' }}>
      Third Layer
      <button onClick={clickHandler}>
        click Third layer
      </button>
      {counter}
    </div>
  );
}

export default memo(Third);
