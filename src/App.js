import React, { useState, useCallback, useEffect } from 'react';

import First from './layers/first'
import Second from './layers/second';

import model from 'models/event1';
import useModel from 'helpers/eventBus/useModel';

const App = () => {
  const [counter, setCounter] = useState(0);
  const [event, publishEvent] = useModel(model);

  const clickHandler = useCallback(() => {
    publishEvent(prev => prev + 1);
  }, []);

  console.log('>>> render')

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
