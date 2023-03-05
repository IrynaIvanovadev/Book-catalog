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
        this.lastId = 0;
        this.genreList = [];
    }

    isEmpty() {
        return this.genreList.length === 0;
    }

    add(genre) {
        let id = this.lastId++;
        this.genreList.push(new Genre(id, genre));
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

    add(genre) {
        this.repository.add(genre);

        let repositoryGenres = this.repository.getAll();
        this.updateGenreTable(repositoryGenres);
        this.updateGenreList(repositoryGenres);
    }

    addRange(genres) {
        for (let i = 0; i < genres.length; i++) {
            this.repository.add(genres[i]);
        }

        let repositoryGenres = this.repository.getAll();
        this.updateGenreTable(repositoryGenres);
        this.updateGenreList(repositoryGenres);      
    }

    seedStartupGenres() {
        if (genreRepository.isEmpty()) {
            this.addRange([ 'Новелла', 'Роман', 'Трагедия', 'Драма', 'Комедия', 'Фарс', 'Трагикомедия' ]);
        }
    }

    updateGenreTable(genres) {
        if (!genres) {
            genres = this.repository.getAll();
        }

        let genreTableHtml = '';

        for (let i = 0; i < genres.length; i++) {
            let genre = genres[i];

            genreTableHtml += '<tr>';
            genreTableHtml += ` <td>${genre.name}</td>`;
            genreTableHtml += ` <td> <a href="#"> Редактировать </a> </td>`;
            genreTableHtml += ` <td> <a href="#"> Удалить </a> </td>`;
            genreTableHtml += '</tr>';
        }

        $('#genreTable > tbody').html(genreTableHtml);
    }

    updateGenreList(genres) {
        if (!genres) {
            genres = this.repository.getAll();
        }

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
