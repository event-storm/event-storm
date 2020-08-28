import React, { useState, useCallback } from 'react';

import model2 from 'models/event2';
import model3 from 'models/event3';
import useModel from 'helpers/eventBus/useModel';

const Second = () => {
  const [counter, setCounter] = useState(0);
  const [_, publishModel2] = useModel(model2);
  const clickHandler = useCallback(() => setCounter(prev => {
    publishModel2(prev + 1);
    return prev + 1;
  }), []);

  const [combined] = useModel(model3);

  return (
    <div style={{ background: 'grey' }}>
      Second Layer
      <button onClick={clickHandler}>
        click Second layer ::: {combined}
      </button>
      {counter}
    </div>
  );
}

export default Second;
