import React from 'react';

import { useVirtualModel } from 'lib/react';

import firstPublishedModel from 'example/models/firstPublished';

function FirstPublished() {

  const firstPublishedName = useVirtualModel(firstPublishedModel);

  return (
    <span>
      first in the order(updates only on first update): {firstPublishedName}
    </span>
  );
}

export default FirstPublished;
