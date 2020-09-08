import React from 'react';

function BookItem({ name }) {
  console.log('>>>>>render')
  return (
    <span className="book-starter">
      {name}
    </span>
  );
}

export default BookItem;
