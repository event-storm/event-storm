import React, { useState, useCallback } from 'react';

import First from './layers/first'
import Second from './layers/second';

import { publishMainContainer } from 'models';

const App = () => {
  const [counter, setCounter] = useState(0);
  const clickHandler = useCallback(() => {
    setCounter(prev => {
      publishMainContainer(prev + 1);
      return prev + 1;
    });
  }, []);
  return (
    <div style={{ background: 'red' }}>
      Main fragment
      <button onClick={clickHandler}>
        click main counter
      </button>
      {counter}
      <First />
      <Second />
    </div>
  );
}

export default App;
