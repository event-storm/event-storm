import React, { useState, useCallback, useEffect } from 'react';

import First from './layers/first'
import Second from './layers/second';

import models from 'models';
import useSubscription from 'helpers/eventBus/useSubscription';

const { publishEvent1, subscribeEvent1 } = models;

const App = () => {
  const [counter, setCounter] = useState(0);

  const clickHandler = useCallback(() => {
    setCounter(prev => {
      publishEvent1(prev + 1);
      return prev + 1;
    });
  }, []);

  const [event] = useSubscription(subscribeEvent1);

  return (
    <div style={{ background: 'red' }}>
      Main fragment
      <button onClick={clickHandler}>
        click main counter :::: {counter}
      </button>
      event :::: {event}
      <First />
      <Second />
    </div>
  );
}

export default App;
