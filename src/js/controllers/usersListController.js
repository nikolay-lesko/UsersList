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
                $scope.cancelEdit();

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
                $scope.cancelEdit();

                $scope.Pager.gotoPage(1, true);
            };

            var selectedIds = [];

            $scope.isSelected = function (user) {
                return _.contains(selectedIds, user.Id);
            };

            $scope.isDeleteVisible = function () {
                return selectedIds.length > 0;
            };

            $scope.onToggleSelectUserClick = function (user) {
                var index = _.indexOf(selectedIds, user.Id);
                if (index != -1) {
                    selectedIds.splice(index, 1);
                }
                else {
                    selectedIds.push(user.Id);
                }
            };

            $scope.onDeleteClick = function () {
                DialogsService
                    .confirmDelete()
                    .then(function () {
                        var ids = _.map(getSelectedUsers(), function (user) {
                            return user.Id;
                        });

                        UsersService
                            .delete(ids)
                            .then(function () {
                                $scope.Pager.gotoPage($scope.Pager.PageIndex, true);
                            });
                    });
            };

            $scope.onEditModalClick = function (originalUser) {
                editUserModal(originalUser);
            };

            $scope.onCreateClick = function () {
                editUserModal({});
            };

            function editUserModal(user) {
                DialogsService.editUser(user)
                    .then(function (editedUser) {
                        UsersService
                            .save(editedUser)
                            .then(function (storedUser) {
                                $scope.Pager.gotoPage($scope.Pager.PageIndex, true);
                            });
                    });
            }

            var editingUserId = undefined;

            $scope.isEditing = function (user) {
                return user.Id == editingUserId;
            };

            $scope.onEditInlineClick = function (user) {
                editingUserId = user.Id;
            };

            $scope.cancelEdit = function () {
                editingUserId = undefined;
            };

            $scope.save = function (editedUser) {
                $scope.cancelEdit();

                UsersService
                    .save(editedUser)
                    .then(function (storedUser) {
                        $scope.Pager.gotoPage($scope.Pager.PageIndex, true);
                    });
            };

            function getSelectedUsers() {
                return _.flatten(_.map($scope.Pager.Pages, function (page) {
                    return _.filter(page.Items, function (user) {
                        return $scope.isSelected(user);
                    });
                }));
            }
        });

}(window.angular));