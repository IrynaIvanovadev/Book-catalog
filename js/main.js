genreService.seedStartupGenres();

$('#addGenreButton').click(function() {
    let value = $('#newGenreInput').val();
    genreService.add(value);
});
