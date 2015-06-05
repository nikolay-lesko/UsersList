(function (angular) {
    'use strict';

    angular.module('Services')
        .factory('DialogsService', function ($modal) {
            return {
                confirmDelete: function () {
                    return openDialog({
                        templateUrl: 'views/confirmDeleteDialog.html',
                        controller: 'ConfirmationDialogController'
                    });
                },

                editUser: function (user) {
                    return openDialog(
                        {
                            templateUrl: 'views/editDialog.html',
                            controller: 'EditUserDialogController',
                            resolve: {
                                User: function () {
                                    return angular.copy(user);
                                }
                            }
                        });
                }
            };

            function openDialog(dialogOptions) {
                return $modal.open(dialogOptions).result;
            }
        });

}(window.angular));