var app = angular.module('movieSite', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: './views/home.html'
            })
            .state('details', {
                url: '/movie',
                templateUrl: './views/details.html'
            })
            .state('about', {
                url: '/about',
                templateUrl: './views/about.html'
            })
            .state('search', {
                url: '/search',
                templateUrl: './views/search.html'
            })
        $urlRouterProvider.otherwise('/')
    });