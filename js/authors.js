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
}

class AuthorService
{
    constructor(repository) {
        this.repository = repository;
    }

    add(lastName, firstName, surName, birthday, numberBook) {
        this.repository.add(lastName, firstName, surName, birthday, numberBook);

        let repositoryAuthor = this.repository.getAll();
        this.updateHtmlAuthorTable(repositoryAuthor);
    }

    delete(id) {
        this.repository.delete(id);

        let repositoryAuthor = this.getAll();
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
            authors = this.repository.getAll();
        }

        let authorTableHtml = '';

        for (let i = 0; i < authors.length; i++) {
            let author = authors[i];

            authorTableHtml += `<tr data-id="${author.id}" data-name="${author.firstName}, ${author.lastName}, ${author.surName}">`;
            authorTableHtml += `<td>${author.firstName + ' ' + author.lastName[0] + '.' + author.surName[0] + '.'}</td>`;
            authorTableHtml += `<td>${author.numberBook}</td>`;
            authorTableHtml += `<td> <a href="#" data-bs-toggle="modal"> Редактировать </a> </td>`;
            authorTableHtml += `<td> <a href="#"> Удалить </a> </td>`;
            authorTableHtml += `<td> <a href="#"> Детали </a> </td>`;
            authorTableHtml += '</tr>';
        }

        $('#authorTable > tbody').html(authorTableHtml);
    }
}

let authorRepository = new AuthorRepository();
let authorService = new AuthorService(authorRepository);

// <object>.<method>

authorService.seedStartupAuthors();

function click_addAuthor() {
    $('#authorModalFirstNameInput').val('');
    $('#authorModalLastNameInput').val('');
    $('#authorModalSureNameInput').val('');
    $('#authorModalBirthdayInput').val('');
    $('#authorModalNumberBookInput').val('');
    $('#authorModalNameInput').data('authorId', '');
    $('#authorModal').modal('show');
}

$('#saveAuthorButton').click(function() {
    let firstName = $('#authorModalFirstNameInput').val();
    let lastName = $('#authorModalLastNameInput').val();
    let sureName = $('#authorModalSureNameInput').val();
    let birthday = $('#authorModalBirthdayInput').val();
    let numberBook = $('#authorModalNumberBookInput').val();

    authorService.add(firstName, lastName, sureName, birthday, numberBook);
    $('#authorModal').modal('hide');


})





$('#saveGenreButton').click(function() {
    let input = $('#genreModalNameInput');

    let genreId = input.data('genreId');
    let genreName = input.val();

    if (genreId) {
        genreService.update(genreId, genreName);
    } else {
        genreService.add(genreName);
    }

    $('#genreModal').modal('hide');
});






// function click_editAuthor(button) {
//     let authorRow = $(button).closest('tr');

//     let authorId = authorRow.data('id');
    
//     let authorFirstName = authorRow.data('firstName');
//     $('#authorModalFirstName').val(authorFirstName);

//     let authorLastName = authorRow.data('lastName');
//     $('#authorModalLastName').val(authorLastName);

//     let authorSureName = authorRow.data('sureName');
//     $('#authorModalSureName').val(authorSureName);

//     let authorbirthday = authorRow.data('birthday');
//     $('#authorModalbirthday').val(authorbirthday);

//     let authorNameBook = authorRow.data('nameBook');
//     $('#authorModalNameBook').val(authorNameBook);

// }


    

