import { createVirtualModel } from 'lib/eventStore';

import books from './books';

const virtualBooks = createVirtualModel(books);

const handlerForFirstPublished = booksData => booksData[0]?.name;
const handlerForCount = booksData => booksData.length;

const firstBookNameModel = virtualBooks(handlerForFirstPublished);
const booksCountModel = virtualBooks(handlerForCount);

export default { firstBookNameModel, booksCountModel };
