app.controller("mainCtrl", function($scope, $window, mainSrvc) {
    $scope.rating = {};
    $scope.tracker = 0;

    $scope.getPopMovies = function(popMovies) {
        if (popMovies) {
            $scope.popMovies = popMovies;
            $scope.firstMov = $scope.popMovies.shift();
        } else {
            mainSrvc.getPopMovies().then(function(response) {
                $scope.popMovies = response.data.results;
                $scope.origPopMov = response.data.results.slice();
                // console.log($scope.popMovies)
            }).then(function() {
                $scope.firstMov = $scope.popMovies.shift();
                $scope.changeMovie($scope.firstMov);
                // console.log($scope.origPopMov)
            });
        }

    }

    $scope.getPopMovies($scope.popMovies);

    $scope.changeMovie = function(movie) {
        $scope.curMovie = movie;
        // console.log($scope.curMovie)
        $scope.backdrop = "url(https://image.tmdb.org/t/p/w1280" + $scope.curMovie.backdrop_path + ")";
        $('#body').css("background-image", $scope.backdrop)
        $scope.rating.rating = Math.round($scope.curMovie.vote_average);
        $scope.rating.stars = [false, false, false, false]

        if ($scope.rating.rating) {
            if ($scope.rating.rating >= 3) {
                $scope.rating.stars[0] = true;
            } else {
                $scope.rating.stars[0] = false;
            }

            if ($scope.rating.rating >= 5) {
                $scope.rating.stars[1] = true;
            } else {
                $scope.rating.stars[1] = false;
            }

            if ($scope.rating.rating >= 7) {
                $scope.rating.stars[2] = true;
            } else {
                $scope.rating.stars[2] = false;
            }

            if ($scope.rating.rating >= 9) {
                $scope.rating.stars[3] = true;
            } else {
                $scope.rating.stars[3] = false;
            }
        }

        $scope.getCredits($scope.curMovie);
    }


    $scope.findMovie = function(search) {
        $scope.searched = search;
        if (search) {
            $window.location = "#/search"
        }
        search = search.split('');
        for (var i = 0; i < search.length; i++) {
            if (search[i] == ' ') {
                search[i] = "%20"
            }
        }
        search = search.join('');
        // console.log(search)

        mainSrvc.searchMovie(search).then(function(response) {

            $scope.searchResults = response.data.results;
            $scope.popMovies = $scope.searchResults;
            $scope.firstMov = $scope.popMovies.shift();
        })
    }

    $scope.getCredits = function(movie) {
        var movieId = movie.id;
        mainSrvc.getCast(movie.id).then(function(response) {
            $scope.credits = response.data.cast.slice()
            $scope.importantPeeps = $scope.credits.slice(0, 10);
            $scope.importantActors = $scope.importantPeeps.slice();
            $scope.firstPeep = $scope.importantPeeps.shift();
            console.log($scope.credits);
        })
    }

    $scope.trackActor = function(num) {
        $scope.tracker += num;
        if ($scope.tracker < 0) {
            $scope.tracker = $scope.importantActors.length - 1;
        }

        if ($scope.tracker > $scope.importantActors.length - 1) {
            $scope.tracker = 0;
        }
    }

    $scope.resetMovies = function() {
        $scope.popMovies = $scope.origPopMov.slice();
        $scope.firstMov = $scope.popMovies.shift();
    }



    $("#myCarousel").bind('slid.bs.carousel', function(e) {
        alert('The carousel has finished sliding from one item to another!');
    });
    console.log($("#myCarousel"))
    console.log($("#body"))
}); //end mainCtrl