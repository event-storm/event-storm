import { useModels } from 'lib/react';

import firstPublished from 'example/models/firstPublished';

const { firstBookNameModel, booksCountModel } = firstPublished;

function FirstPublished() {

  const [firstPublishedName, booksCount] = useModels(firstBookNameModel, booksCountModel);

  return (
    <span>
      first in the order(updates only on first update): {firstPublishedName}
      <br/>{booksCount}
    </span>
  );
}

export default FirstPublished;
