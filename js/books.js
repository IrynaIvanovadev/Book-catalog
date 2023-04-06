class Book
{
    constructor(id, name, genreId, authorId, pageCount) {
        this.id = id;
        this.name = name;
        this.genreId = genreId;
        this.authorId = authorId;
        this.pageCount = pageCount;
    }
}

class BookRepository
{
    constructor() {
        this.nextId = 1;
        this.bookList = [];
    }

    add(name, genreId, authorId, pageCount) {
        let id = this.nextId++;
        this.bookList.push( new Book(id, name, genreId, authorId, pageCount));
    }

    getByAuthor(authorId){
      return this.bookList.filter(book => book.authorId === authorId);
    }

    getBook(id) {
        return this.bookList.find(book => book.id === id);
    }

    update(id, name, genreId, authorId, pageCount) {
        let book = this.bookList.find(x => x.id === id);

        book.name = name;
        book.genreId = genreId;
        book.authorId = authorId;
        book.pageCount = pageCount;
    }

    getAll() {
        return this.bookList;
    }
}

class BookService
{
    constructor(bookRepository, genreRepository) {
        this.bookRepository = bookRepository;
        this.genreRepository = genreRepository;
        this.temporaryBookList = [];
    }

    getTemporaryBooks() {
        return this.temporaryBookList;
    }

    addTemporaryBook(name, genreId, authorId, pageCount) {
        let book = new Book(null, name, genreId, authorId, pageCount);
        this.temporaryBookList.push(book);

        this.updateHtmlBookList(this.temporaryBookList);
    }

    update(id, name, genreId, authorId, pageCount) {
        this.bookRepository.update(id, name, genreId, authorId, pageCount);
        let repositoryBook = this.bookRepository.getAll();
        this.updateHtmlBookList(repositoryBook);
    }

    setTemporaryBook(books) {
        this.temporaryBookList = books;
        this.updateHtmlBookList(this.temporaryBookList);
    }

    deleteTemporaryBookByIndex(index) {
        this.temporaryBookList.splice(index, 1);
        this.updateHtmlBookList(this.temporaryBookList);
    }

    clearTemporaryBookList() {
        this.temporaryBookList = [];
        this.updateHtmlBookList(this.temporaryBookList);
    }

    add(name, genreId, authorId, pageCount) {
        this.bookRepository.add(name, genreId, authorId, pageCount);
    }

    getBooksByAuthorId(id) {
        return this.bookRepository.getByAuthor(id);
    }

    getBookById(id) {
        return this.bookRepository.getBook(id);
    }

    updateHtmlBookList(books) {
        if (!books) {
            books = this.temporaryBookList;
        }

        let bookTableHtml = '';

        for(let i = 0; i < books.length; i++) {
            let book = books[i];
            let genreName = this.genreRepository.getGenreNameById(+book.genreId);

            bookTableHtml += `<div class="frame-book d-flex justify-content-between align-self-center border border-secondary p-1">`;
            bookTableHtml += `<div class="frame-book d-flex justify-content-between align-self-center">${book.name} ${genreName} ${book.pageCount} стр.</div>`;

            bookTableHtml += `<div data-index="${i}">`;
            bookTableHtml += `<button type="button" class="btn btn-link p-0" onclick="click_editTemporaryBook(this)"> Редактировать </button> <br>`;
            bookTableHtml += `<button type="button" onclick="click_deleteBook(${i})" class="btn btn-link p-0"> Удалить </button>`;
            bookTableHtml += `</div>`;

            bookTableHtml += `</div>`;
        }
        
        $('#bookTable').html(bookTableHtml);
    }
}

let bookRepository = new BookRepository();
let bookService = new BookService(bookRepository, genreRepository);

function click_deleteBook(index) {
    bookService.deleteTemporaryBookByIndex(index);
}

function click_editTemporaryBook(button) {
    let bookRow = $(button).closest('div');
    let index = bookRow.data('index');
    let book = bookService.getTemporaryBooks()[index];
    $('#editTemporaryBookModal').data('index', index);
    
    $('#authorBookNameIndex').val(book.name);
    $('#authorBookPageCountIndex').val(book.pageCount);
    $('#authorBookGenreIndex').val(book.genreId);

    $('#authorModal').modal('hide');
    $('#editTemporaryBookModal').modal('show');
}

$('#saveTemporaryBookButton').click(function() {

    let name = $('#authorBookNameIndex').val();
    let pageCount = $('#authorBookPageCountIndex').val();
    let genreId = $('#authorBookGenreIndex').val();

    let indexBook = $('#editTemporaryBookModal').data('index');
    let book = bookService.getTemporaryBooks()[indexBook];

    let id = book.id;
    let authorId = book.authorId;

    if (id) {
        bookService.update(id, name, genreId, authorId, pageCount);
    } else {
        book.name = name;
        book.pageCount = pageCount;
        book.genreId = genreId;

        bookService.updateHtmlBookList();
    }

    $('#editTemporaryBookModal').modal('hide'); 
    $('#authorModal').modal('show');
});

$('#closeTemporaryBookModalButton').click(function(){
    $('#editTemporaryBookModal').modal('hide'); 
    $('#authorModal').modal('show');
})
