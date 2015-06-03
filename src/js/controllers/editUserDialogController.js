(function (angular) {
    'use strict';

    angular.module('Controllers')
        .controller('EditUserDialogController', function ($scope, $modalInstance, User) {
            $scope.User = User;

            $scope.onCancelClick = function () {
                $modalInstance.dismiss('cancel');
            };

            $scope.onSaveClick = function (hasValidationErrors) {
                if (hasValidationErrors) {
                    return;
                }

                $modalInstance.close(User);
            };
        });

}(window.angular));