class Author 
{
    constructor (id, firstName, lastName, surName, birthday, numberBook) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.surName = surName;
        this.birthday = birthday;
        this.numberBook = numberBook;
    }
}

class AuthorRepository 
{
    constructor() {
        this.nextId = 1;
        this.authorList = [];
    }

    isEmpty() {
        return this.authorList.length === 0;
    }

    add(lastName, firstName, surName, birthday, numberBook) {
        let id = this.nextId++;
        this.authorList.push(new Author(id, firstName, lastName, surName, birthday, numberBook));
        return id;
    }

    update(id, firstName, lastName, surName, birthday, numberBook) {
        let author = this.authorList
            .find(x => x.id === id);

        author.firstName = firstName;
        author.lastName = lastName;
        author.surName = surName;
        author.birthday = birthday;
        author.numberBook = numberBook;
    }

    delete(id) {
        let index = this.authorList.findIndex(x => x.id == id);

        if (index >= 0) {
            this.authorList.splice(index, 1);
        }
    }

    getAll() {
        return this.authorList;
    }

    getAuthorById(id) {
        return this.authorList.find(x => x.id === id);
    }
}

class AuthorService
{
    constructor(authorRepository, genreRepository) {
        this.authorRepository = authorRepository;
        this.genreRepository = genreRepository;
    }

    add(lastName, firstName, surName, birthday, numberBook) {
        let authorId = this.authorRepository.add(lastName, firstName, surName, birthday, numberBook);

        let repositoryAuthor = this.authorRepository.getAll();
        this.updateHtmlAuthorTable(repositoryAuthor);

        return authorId;
    }

    getAuthorById(id) {
        return this.authorRepository.getAuthorById(id);
        
    }

    delete(id) {
        this.authorRepository.delete(id);

        let repositoryAuthor = this.authorRepository.getAll();
        this.updateHtmlAuthorTable(repositoryAuthor);
    }

    seedStartupAuthors() {
        this.add('Иванова', 'Катя','Владимировна','20.06.1996','0');
        this.add('Иванова', 'Катя','Владимировна','20.06.1996','0');
        this.add('Иванова', 'Катя','Владимировна','20.06.1996','0');
        this.add('Иванова', 'Катя','Владимировна','20.06.1996','0');
        this.add('Иванова', 'Катя','Владимировна','20.06.1996','0');
        this.add('Иванова', 'Катя','Владимировна','20.06.1996','0');
    }

    updateHtmlAuthorTable(authors) {
        if (!authors) {
            authors = this.authorRepository.getAll();
        }

        let authorTableHtml = '';

        for (let i = 0; i < authors.length; i++) {
            let author = authors[i];

            authorTableHtml += `<tr data-id="${author.id}" data-name="${author.firstName}, ${author.lastName}, ${author.surName}">`;
            authorTableHtml += `<td>${author.firstName + ' ' + author.lastName[0] + '.' + author.surName[0] + '.'}</td>`;
            authorTableHtml += `<td>${author.numberBook}</td>`;
            authorTableHtml += `<td> <a href="#" data-bs-toggle="modal"> Редактировать </a> </td>`;
            authorTableHtml += `<td> <a href="#" onclick="click_deleteAuthor(this)"> Удалить </a> </td>`;
            authorTableHtml += `<td> <a href="#" onclick="click_detailsAuthor(this)"> Детали </a> </td>`;
            authorTableHtml += '</tr>';
        }

        $('#authorTable > tbody').html(authorTableHtml);
    }
}

let authorRepository = new AuthorRepository();
let authorService = new AuthorService(authorRepository, genreRepository);

authorService.seedStartupAuthors();

function click_addAuthor() {
    $('#authorModalFirstNameInput').val('');
    $('#authorModalLastNameInput').val('');
    $('#authorModalsurNameInput').val('');
    $('#authorModalBirthdayInput').val('');
    $('#authorModalNumberBookInput').val('');
    $('#authorModalNameInput').data('authorId', '');

    bookService.clearTemporaryBookList();

    $('#authorModal').modal('show');
}

$('#addAuthorBookButton').click(function() {
    let name = $('#authorBookName').val();
    let genreId = $('#authorBookGenreId').val();
    let pageCount = $('#authorBookPageCount').val();

    bookService.addTemporaryBook(name, genreId, null, pageCount);
});

$('#saveAuthorButton').click(function() {
    let firstName = $('#authorModalFirstNameInput').val();
    let lastName = $('#authorModalLastNameInput').val();
    let surName = $('#authorModalsurNameInput').val();
    let birthday = $('#authorModalBirthdayInput').val();

    let temporaryBooks = bookService.getTemporaryBooks();
    let authorId = authorService.add(firstName, lastName, surName, birthday, temporaryBooks.length);

    for (let i = 0; i < temporaryBooks.length; i++) {
        let book = temporaryBooks[i]
        book.authorId = authorId

        bookService.add(book.name, book.genreId, book.authorId, book.pageCount);
    }
    
    $('#authorModal').modal('hide');
});

function click_deleteAuthor(button) {
    let authorRow = $(button).closest('tr');
    let authorId = authorRow.data('id');
    authorService.delete(authorId);
}

function click_detailsAuthor(button) {
    let authorRow = $(button).closest('tr');
    let authorId = authorRow.data('id');
    showAuthorDetails(authorId);
    $('#detailsModal').modal('show');
}

function showAuthorDetails(authorId) {
    let author = authorService.getAuthorById(authorId);
    let authorDetailsHtml = '';

    authorDetailsHtml += `<h6 class="m-0">Автор:</h6>`;
    authorDetailsHtml += '<tr class="frame-book d-flex flex-row mb-1 p-0">';
    authorDetailsHtml += `<td class="p-1 ps-2">${author.firstName}</td>`;
    authorDetailsHtml += `<td class="p-1">${author.lastName}</td>`;
    authorDetailsHtml += `<td class="p-1">${author.surName}</td>`;
    authorDetailsHtml += `<td class="p-1">${author.birthday}</td>`;
    authorDetailsHtml += '</tr>';
    authorDetailsHtml += `<h6>Книги:</h6>`;

    $('#detailsAuthorModal > tbody').html(authorDetailsHtml);

    let authorBooks =  bookService.getBooksByAuthorId(authorId);
    let authorBooksDetailsHtml = '';

    for (let i = 0; i < authorBooks.length; i++) {
      let authorBook = authorBooks[i];
      let genreName = genreService.getGenreNameById(+authorBook.genreId);

      authorBooksDetailsHtml += '<tr class="frame-book d-flex flex-row mb-1 p-0">';
      authorBooksDetailsHtml += `<td class="p-1 ps-2">${authorBook.name}</td>`;
      authorBooksDetailsHtml += `<td class="p-1">${genreName}</td>`;
      authorBooksDetailsHtml += `<td class="p-1">${authorBook.pageCount}</td>`;
      authorBooksDetailsHtml += '</tr>';
    }
  
    $('#detailsModal > tbody').html(authorBooksDetailsHtml);
}


