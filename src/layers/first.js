import React, { useState, useCallback } from 'react';

import Third from './third';

const Fist = () => {
  const [counter, setCounter] = useState(0);
  const clickHandler = useCallback(() => setCounter(prev => prev + 1), []);
  return (
    <div style={{ background: 'green' }}>
      Fist Layer
      <button onClick={clickHandler}>
        click First counter
      </button>
      {counter}
      <Third />
    </div>
  );
}

export default Fist;
