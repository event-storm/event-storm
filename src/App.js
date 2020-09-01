import React, { useCallback } from 'react';

import nameModel from 'models/name';
import fullnameModel from 'models/fullname';
import combinedModel from 'models/combined';
import useModel from 'helpers/eventBus/useModel';

const App = () => {
  const [name, setName] = useModel(nameModel);
  const [fullname] = useModel(fullnameModel);
  const [combined] = useModel(combinedModel);

  const onChange = useCallback(event => {
    setName(event.target.value);
  }, []);

  return (
    <div style={{ background: 'red' }}>
      {fullname}
      <input onChange={onChange} value={name} />
      {combined}
    </div>
  );
}

export default App;
