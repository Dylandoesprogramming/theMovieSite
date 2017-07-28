app.controller("mainCtrl", function($scope, $window, mainSrvc) {
    $scope.rating = {};
    $scope.tracker = 0;

    $scope.getPopMovies = function(popMovies) {
        if (popMovies) { //if this isnt the first time the page has loaded
            $scope.popMovies = popMovies; //keep the same carousel
            $scope.firstMov = $scope.popMovies.shift(); //make the active image on the carousel the first item from popMovies
        } else {
            mainSrvc.getPopMovies().then(function(response) { //on the first time loading 'get' top 20 movies from themoviedb
                $scope.popMovies = response.data.results; //popmovies is an array of the top 20 movies
                //origPopMov is the same but wont be manipulated by changing popMovies
                $scope.origPopMov = response.data.results.slice();
            }).then(function() {
                $scope.firstMov = $scope.popMovies.shift(); //make the active image on the carousel the first item from popMovies
                $scope.changeMovie($scope.firstMov); //change the current movie to firstMov so we have a background on load
            });
        }

    }

    $scope.getPopMovies($scope.popMovies); //get movies whether we have them already or get the http request if its first time loading

    $scope.changeMovie = function(movie) {
        $scope.curMovie = movie; //track current movie were using for a background
        //set a url for background change based on current movie
        if ($scope.curMovie.backdrop_path) {
            $scope.backdrop = "url(https://image.tmdb.org/t/p/w1280" + $scope.curMovie.backdrop_path + ")";
            $('#body').css("background-image", $scope.backdrop) //set the bodies background image to the url we get from the curMovie
        } else {
            $scope.backdrop = "url(https://image.tmdb.org/t/p/w1280" + $scope.origPopMov[0].backdrop_path + ")";
            $('#body').css("background-image", $scope.backdrop)
        }

        $scope.rating.rating = Math.round($scope.curMovie.vote_average); //get the rating for curMovie and round it to an int
        $scope.rating.stars = [false, false, false, false] //set stars 1-4 to false so they are by default empty

        //fills stars by making an ng-if true or false replacing the empty star with a full one if its true
        if ($scope.rating.rating) {
            if ($scope.rating.rating >= 3) { //if the score is higher than a 2 fill a star
                $scope.rating.stars[0] = true;
            } else {
                $scope.rating.stars[0] = false;
            }

            if ($scope.rating.rating >= 5) { //if the score is higher than 4 fill a star
                $scope.rating.stars[1] = true;
            } else {
                $scope.rating.stars[1] = false;
            }

            if ($scope.rating.rating >= 7) { //if the score is higher than 6 fill a star
                $scope.rating.stars[2] = true;
            } else {
                $scope.rating.stars[2] = false;
            }

            if ($scope.rating.rating >= 9) { //if the score is higher than 8 fill a star
                $scope.rating.stars[3] = true;
            } else {
                $scope.rating.stars[3] = false;
            }
        }

        $scope.getCredits($scope.curMovie); //get credits for the current movie everytime we change movies
    }

    $scope.changeActor = function(actor) {
        mainSrvc.getPerson(actor.id).then(function(response) { //http request to get data about an acor
            $scope.curActor = response.data; //curActor is the actor we're working with
            var tempBirth = $scope.curActor.birthday; //get actors bday
            tempBirth = tempBirth.split('-'); //split it at the -
            var newBirth = [tempBirth[1], tempBirth[2], tempBirth[0]]; //rearrange it for american format
            newBirth = newBirth.join('-') //make a new variable the birthdate that will be used
            $scope.curActor.birthday = newBirth; //set the actors birthday to that new variable
            $scope.curActor.biography = $scope.curActor.biography.split('.') //split the actors biography up for easy reading
            var newArr = []; //make a new arr for checking
            for (var i = 0; i < $scope.curActor.biography.length; i++) {
                //remove wikipedia messages that are passed with biography
                if ($scope.curActor.biography[i].toLowerCase().indexOf("wikipedia") >= 0) {} else {
                    newArr.push($scope.curActor.biography[i])
                }
            }
            $scope.curActor.biography = newArr.join('.</p><p>'); //wrap each sentence in a paragraph tag and join the split bio back
        })
    }


    $scope.findMovie = function(search) {
        $scope.searched = search; //get text that was searched and display it on screen without user input
        if (search) {
            $window.location = "#/search" //set view to /search even though theres no ui-sref on submit
        }
        search = search.split('');
        for (var i = 0; i < search.length; i++) {
            //turn all spaces into %20 for url purposes
            if (search[i] == ' ') {
                search[i] = "%20"
            }
        }
        search = search.join('');

        mainSrvc.searchMovie(search).then(function(response) { //do a search via http for what was entered into searchBox

            $scope.searchResults = response.data.results;
            $scope.popMovies = $scope.searchResults; //make the carousel rotate the search results
            $scope.firstMov = $scope.popMovies.shift(); //first item in carousel is removed from popMovies to be used as active
        })
    }

    $scope.getCredits = function(movie) {
        var movieId = movie.id;
        mainSrvc.getCast(movie.id).then(function(response) { //http request to get the cast of a movie based on its movie id
            $scope.credits = response.data.cast.slice() //get a copy of the credits
            $scope.importantPeeps = $scope.credits.slice(0, 10); //get the top 10 actors for carousel use
            //get a copy of the top 10 for tracking names since importantPeeps will be manipulated
            $scope.importantActors = $scope.importantPeeps.slice();
            //take the first actor from importantPeeps for use as the first actor on carousel
            $scope.firstPeep = $scope.importantPeeps.shift();
        })
    }

    $scope.trackActor = function(num) {
        //tracker for use with the original non shifted copy of actors so we can list their names above them
        $scope.tracker += num;
        if ($scope.tracker < 0) {
            $scope.tracker = $scope.importantActors.length - 1;
        }

        if ($scope.tracker > $scope.importantActors.length - 1) {
            $scope.tracker = 0;
        }
    }

    $scope.resetMovies = function() { //when you hit the home button we reset the popMovies variable to the top 20
        $scope.popMovies = $scope.origPopMov.slice();
        $scope.firstMov = $scope.popMovies.shift();
    }
}); //end mainCtrl