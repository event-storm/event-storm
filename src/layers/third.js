import React, { useState, useCallback, memo } from 'react';

import models from 'models';
import useSubscription from 'helpers/eventBus/useSubscription';

const { subscribeTest2, subscribeTest3 } = models;

const Third = () => {
  const [counter, setCounter] = useState(0);
  const clickHandler = useCallback(() => setCounter(prev => prev + 1), []);

  const [data, concat] = useSubscription(subscribeTest2, subscribeTest3);
  console.log(concat)

  return (
    <div style={{ background: 'blue' }}>
      Third Layer
      <button onClick={clickHandler}>
        click Third layer::: {counter}
      </button>
      data:::::{data}
      concat:::::{concat}
    </div>
  );
}

export default memo(Third);
