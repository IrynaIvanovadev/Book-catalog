class Genre
{
    constructor(id, name){
        this.id = id;
        this.name = name;
    }
}                 

class GenreRepository 
{
    constructor() {
        this.nextId = 1;
        this.genreList = [];
    }

    isEmpty() {
        return this.genreList.length === 0;
    }

    add(name) {
        let id = this.nextId++;
        this.genreList.push(new Genre(id, name));
    }

    update(id, name) {
        let genre = this.genreList
            .find(x => x.id === id);

        genre.name = name;
    }

    delete(id) {
        let index = this.genreList.findIndex(x => x.id == id);

        if (index >= 0) {
            this.genreList.splice(index, 1);
        }
    }

    getAll() {
        return this.genreList;
    }
}

class GenreService 
{
    constructor(repository) {
        this.repository = repository;
    }

    add(genreName) {
        this.repository.add(genreName);

        let repositoryGenres = this.repository.getAll();
        this.updateHtmlGenreTable(repositoryGenres);
        this.updateHtmlGenreList(repositoryGenres);
    }

    addRange(genreNames) {
        for (let i = 0; i < genreNames.length; i++) {
            this.repository.add(genreNames[i]);
        }

        let repositoryGenres = this.repository.getAll();
        this.updateHtmlGenreTable(repositoryGenres);
        this.updateHtmlGenreList(repositoryGenres);      
    }

    update(id, genreName) {
        this.repository.update(id, genreName);

        let repositoryGenres = this.repository.getAll();
        this.updateHtmlGenreTable(repositoryGenres);
        this.updateHtmlGenreList(repositoryGenres);  
    }

    delete(id) {
        this.repository.delete(id);

        let repositoryGenres = this.repository.getAll();
        this.updateHtmlGenreTable(repositoryGenres);
        this.updateHtmlGenreList(repositoryGenres); 
    }

    seedStartupGenres() {
        if (genreRepository.isEmpty()) {
            this.addRange([ 'Новелла', 'Роман', 'Трагедия', 'Драма', 'Комедия', 'Фарс', 'Трагикомедия' ]);
        }
    }

    updateHtmlGenreTable(genres) {
        if (!genres) {
            genres = this.repository.getAll();
        }

        let genreTableHtml = '';

        for (let i = 0; i < genres.length; i++) {
            let genre = genres[i];

            genreTableHtml += `<tr data-id="${genre.id}" data-name="${genre.name}">`;
            genreTableHtml += ` <td>${genre.name}</td>`;
            genreTableHtml += ` <td> <a href="#" data-bs-toggle="modal" onclick="click_editGenre(this)"> Редактировать </a> </td>`;
            genreTableHtml += ` <td> <a href="#" onclick="click_deleteGenre(this)"> Удалить </a> </td>`;
            genreTableHtml += '</tr>';
        }

        $('#genreTable > tbody').html(genreTableHtml);
    }

    updateHtmlGenreList(genres) {
        let genreListHtml = '';

        for (let i = 0; i < genres.length; i++) {
            let genre = genres[i];
            genreListHtml += `<option value="${genre.id}">${genre.name}</option>`;
        }

        $('#genreList > select').html(genreListHtml);
    }
}

let genreRepository = new GenreRepository();
let genreService = new GenreService(genreRepository);

genreService.seedStartupGenres();

function click_addGenre() {
    $('#genreModalNameInput').val('');
    $('#genreModalNameInput').data('genreId', '');
    $('#genreModal').modal('show');
}

function click_editGenre(button) {
    let genreRow = $(button).closest('tr');
    
    let genreId = genreRow.data('id');
    let genreName = genreRow.data('name');

    let input = $('#genreModalNameInput');

    input.val(genreName);
    input.data('genreId', genreId);

    $('#genreModal').modal('show');
}

function click_deleteGenre(button) {
    let genreRow = $(button).closest('tr');
    let genreId = genreRow.data('id');
    genreService.delete(genreId);
}

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
