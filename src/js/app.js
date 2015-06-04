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
                });

            $urlRouterProvider.otherwise('/');
        })

}(window.angular));