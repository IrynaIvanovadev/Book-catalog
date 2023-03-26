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

    getByAuthor(authorId){
        bookList.filter(book => book.authorId === authorId);
    }

}

class BookService
{
    constructor(bookRepository, genreRepository) {
        this.bookRepository = bookRepository;
        this.genreRepository = genreRepository;
        this.temporaryBookList = [];
    }

    addTemporaryBook(name, genreId, authorId, pageCount) {
        let book = new Book(null, name, genreId, authorId, pageCount);
        this.temporaryBookList.push(book);

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

    updateHtmlBookList(books) {
        let bookTableHtml = '';

        for(let i = 0; i < books.length; i++) {
            let book = books[i];
            let genreName = this.genreRepository.getGenreNameById(+book.genreId);

            bookTableHtml += `<div class="frame-book d-flex justify-content-between align-self-center border border-secondary p-1">`;
            bookTableHtml += `<div class="frame-book d-flex justify-content-between align-self-center">${book.name} ${genreName} ${book.pageCount} стр.</div>`;

            bookTableHtml += `<div>`;
            bookTableHtml += `<button type="button" class="btn btn-link p-0"> Редактировать </button> <br>`;
            bookTableHtml += `<button type="button" onclick="click_deleteBook(${i})" class="btn btn-link p-0"> Удалить </button>`;
            bookTableHtml += `</div>`;

            bookTableHtml += `</div>`;
        }
        
        $('#bookTable').html(bookTableHtml);
    }
}

let bookRepository = new BookRepository();
let bookService = new BookService(bookRepository, genreRepository);

function click_deleteBook (index) {
    bookService.deleteTemporaryBookByIndex(index);
}
