app.service("mainSrvc", function($http) {
    this.popMovies = [];
    this.getPopMovies = function() {
        return $http({
            method: "Get",
            url: "https://api.themoviedb.org/3/movie/popular?api_key=" + apiKey + "&language=en-US&page=1",
        })
    }

    this.searchMovie = function(input) {
        return $http({
            method: "Get",
            url: "https://api.themoviedb.org/3/search/movie?api_key=" + apiKey + "&query=" + input + "&page=1",
        })
    }

    this.getCast = function(movieId) {
        return $http({
            method: "Get",
            url: "https://api.themoviedb.org/3/movie/" + movieId + "/credits?api_key=" + apiKey
        })
    }

    this.getPerson = function(castId) {
        return $http({
            method: "Get",
            url: "https://api.themoviedb.org/3/person/" + castId + "?api_key=" + apiKey
        })
    }
});