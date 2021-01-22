import { useState } from 'react';

import { publishModel } from 'lib/eventStore';

import Button from 'example/components/button';
import booksModel from 'example/models/books';

function AddBook() {
  const [state, setState] = useState('');

  const addBook = () => {
    publishModel(booksModel, prevBooks => [...prevBooks, { name: state, id: Date.now() }]);
    setState('');
  }

  return <div className="book-container-wrapper">
    <input className="book-starter" value={state} onChange={event => setState(event.target.value)} />
    <Button onClick={addBook}>
      add
    </Button>
  </div>
};

export default AddBook;
