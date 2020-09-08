import React from 'react';

import { useModel } from 'lib/react';

import booksModel from 'example/models/books';
import Button from 'example/components/button';

import BookItem from './item';

function Books() {
  const [books, updateBooks] = useModel(booksModel);
  const removeBook = book => updateBooks(prevBooks => prevBooks.filter(({ id }) => id !== book.id));

  return books.map(book => (
    <div key={book.id} className="book-container-wrapper">
      <BookItem {...book} />
      <Button onClick={() => removeBook(book)}>
        remove
      </Button>
    </div>
  ));
}

export default Books;
