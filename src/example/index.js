import React from 'react';

import Books from './components/books';
import AddBook from './components/addBook';
import FirstPublished from './components/firstPublished';

import './index.css';

function Example() {

  return (
    <>
      <FirstPublished />
      <AddBook />
      <Books />
    </>
  );
}

export default Example;
