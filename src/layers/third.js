import React, { useState, useCallback, memo } from 'react';

const Third = () => {
  const [counter, setCounter] = useState(0);
  const clickHandler = useCallback(() => setCounter(prev => prev + 1), []);
  return (
    <div style={{ background: 'blue' }}>
      Third Layer
      <button onClick={clickHandler}>
        click Third layer::: {counter}
      </button>
    </div>
  );
}

export default memo(Third);
