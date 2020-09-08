import { createVirtualModel } from 'lib/eventStore';

import books from './books';

const firstBookName = createVirtualModel(books)(([booksData]) => booksData[0]?.name);

export default firstBookName;
