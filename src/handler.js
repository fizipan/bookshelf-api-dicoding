const { nanoid } = require('nanoid');
const bookshelf = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (name === undefined || name === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
  };

  bookshelf.push(newBook);

  const isSuccess = bookshelf.filter((book) => book.id === id).length > 0;

  if (!isSuccess) {
    const response = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
  }

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });
  response.code(201);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  // if query name is not empty
  if (name !== undefined) {
    const books = bookshelf
      .filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
      .map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }));

    // if book not found
    if (books.length === 0) {
      const response = h.response({
        status: 'fail',
        message: `Buku dengan nama ${name} tidak ditemukan`,
      });
      response.code(404);
      return response;
    }

    // if book found
    const response = h.response({
      status: 'success',
      data: {
        books,
      },
    });
    response.code(200);
    return response;
  }

  // if query reading is not empty
  if (reading !== undefined) {
    // if reading is not 0 or 1
    if (reading !== '0' && reading !== '1') {
      const response = h.response({
        status: 'fail',
        message: 'Query reading hanya boleh bernilai 0 atau 1',
      });
      response.code(400);
      return response;
    }

    // search book by reading false
    if (reading === '0') {
      const books = bookshelf
        .filter((book) => book.reading === false)
        .map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        }));

      const response = h.response({
        status: 'success',
        data: {
          books,
        },
      });
      response.code(200);
      return response;
    }

    // search book by reading true
    if (reading === '1') {
      const books = bookshelf
        .filter((book) => book.reading === true)
        .map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        }));

      const response = h.response({
        status: 'success',
        data: {
          books,
        },
      });
      response.code(200);
      return response;
    }
  }

  if (finished !== undefined) {
    // if finished is not 0 or 1
    if (finished !== '0' && finished !== '1') {
      const response = h.response({
        status: 'fail',
        message: 'Query finished hanya boleh bernilai 0 atau 1',
      });
      response.code(400);
      return response;
    }

    // search book by finished false
    if (finished === '0') {
      const books = bookshelf
        .filter((book) => book.finished === false)
        .map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        }));

      const response = h.response({
        status: 'success',
        data: {
          books,
        },
      });
      response.code(200);
      return response;
    }

    // search book by finished true
    if (finished === '1') {
      const books = bookshelf
        .filter((book) => book.finished === true)
        .map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        }));

      const response = h.response({
        status: 'success',
        data: {
          books,
        },
      });
      response.code(200);
      return response;
    }
  }

  const books = bookshelf.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  const response = h.response({
    status: 'success',
    data: {
      books,
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = bookshelf.filter((n) => n.id === bookId)[0];

  if (book === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      book,
    },
  });
  response.code(200);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();

  if (name === undefined || name === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const index = bookshelf.findIndex((book) => book.id === bookId);

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  bookshelf[index] = {
    ...bookshelf[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  };

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  response.code(200);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = bookshelf.findIndex((book) => book.id === bookId);

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  bookshelf.splice(index, 1);

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });

  response.code(200);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
