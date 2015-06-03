(function (angular) {
    'use strict';

    angular.module('UsersList')
        .config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('home', {
                    abstract: true,
                    templateUrl: 'views/layout.html'
                })
                .state('home.list', {
                    url: '/',
                    templateUrl: 'views/list.html',
                    controller: 'UsersListController'
                })
                .state('home.config', {
                    url: '/config',
                    templateUrl: 'views/config.html'
                });

            $urlRouterProvider.otherwise('/');
        })

}(window.angular));