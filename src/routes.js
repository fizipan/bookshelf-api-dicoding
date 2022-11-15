const {
  addBookHandler,
  getAllBooksHandler,
  deleteBookByIdHandler,
  getBookByIdHandler,
  editBookByIdHandler,
} = require('./handler');

// Endpoint API
const routes = [
  // Menyimpan Buku
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },

  // Menampilkan semua buku
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  },

  // Menampilkan detail buku
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookByIdHandler,
  },

  // Ubah detail buku
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookByIdHandler,
  },

  // Menghapus data book
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookByIdHandler,
  },
];

module.exports = routes;
