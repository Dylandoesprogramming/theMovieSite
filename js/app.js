var app = angular.module('movieSite', ['ui.router', 'ngSanitize'])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '../views/home.html'
            })
            .state('details', {
                url: '/movie',
                templateUrl: '../views/details.html'
            })
            .state('search', {
                url: '/search',
                templateUrl: '../views/search.html'
            })
            .state('actor', {
                url: '/actor',
                templateUrl: '../views/actor.html'
            })
        $urlRouterProvider.otherwise('/')
    });