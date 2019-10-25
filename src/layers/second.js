import React, { useState, useCallback } from 'react';

const Second = () => {
  const [counter, setCounter] = useState(0);
  const clickHandler = useCallback(() => setCounter(prev => prev + 1), []);
  return (
    <div style={{ background: 'grey' }}>
      Second Layer
      <button onClick={clickHandler}>
        click Second layer
      </button>
      {counter}
    </div>
  );
}

export default Second;
