(function (angular) {
    'use strict';

    angular.module('Controllers')
        .controller('UsersListController', function ($scope, UsersService, DialogsService) {
            $scope.Users = [];

            $scope.Pager = {
                PageSize: 25,
                dataSource: function (pageIndex, pageSize) {
                    return UsersService.list(pageIndex, pageSize, $scope.Search, $scope.Sort);
                },
                gotoPage: function (pageIndex) {
                    // will be replaced by infinitePager
                }
            };

            $scope.PageSizes = [25, 50, 100, 200];

            $scope.Sort = {
                Field: 'Id',
                Desc: false
            };

            $scope.$watch('Sort.Field+Sort.Desc', function () {
                $scope.Pager.gotoPage($scope.Pager.PageIndex, true);
            });

            $scope.AgeSearches = [
                {From: 0, To: 0, Title: 'All'},
                {From: 0, To: 10, Title: '0 - 10'},
                {From: 11, To: 20, Title: '11 - 20'},
                {From: 21, To: 40, Title: '21 - 40'},
                {From: 41, To: 60, Title: '41 - 60'},
                {From: 61, To: 100, Title: '61+'}
            ];

            $scope.Search = {
                Id: '',
                FirstName: '',
                LastName: '',
                Email: '',
                Age: $scope.AgeSearches[0]
            };

            $scope.onSearchChanged = function () {
                $scope.Pager.gotoPage(1, true);
            };

            $scope.isDeleteVisible = function () {
                return getSelectedUsers().length > 0;
            };

            $scope.onToggleSelectUserClick = function (user) {
                user.IsSelected = !user.IsSelected;
            };

            $scope.onDeleteClick = function () {
                DialogsService
                    .confirmDelete()
                    .then(function () {
                        var ids = _.map(getSelectedUsers(), function (user) {
                            return user.Id;
                        });

                        UsersService.delete(ids);

                        $scope.Pager.gotoPage($scope.Pager.PageIndex, true);
                    });
            };

            $scope.editModal = function (originalUser) {
                DialogsService.editUser(originalUser)
                    .then(function (user) {
                       var i = 0;
                    });
            };

            $scope.editInline = function (user) {

            };

            function getSelectedUsers() {
                return _.flatten(_.map($scope.Pager.Pages, function (page) {
                    return _.filter(page.Items, function (user) {
                        return user.IsSelected;
                    });
                }));
            }
        });

}(window.angular));