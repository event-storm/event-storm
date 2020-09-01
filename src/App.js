import React, { useCallback } from 'react';

import nameModel from 'models/name';
import fullnameModel from 'models/fullname';
import combinedModel from 'models/combined';
import useModel from 'helpers/eventBus/useModel';
import useVirtualModel from 'helpers/eventBus/useVirtualModel';

const App = () => {
  const [name, setName] = useModel(nameModel);
  const fullname = useVirtualModel(fullnameModel);
  const combined = useVirtualModel(combinedModel);

  const onChange = useCallback(event => {
    setName(event.target.value);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div>
        {fullname}
      </div>
      <div>
        <input onChange={onChange} value={name} />
      </div>
      <div>
        {combined}
      </div>
    </div>
  );
}

export default App;
