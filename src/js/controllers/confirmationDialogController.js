(function (angular) {
    'use strict';

    angular.module('Controllers')
        .controller('ConfirmationDialogController', function ($scope, $modalInstance) {
            $scope.onYesClick = function () {
                $modalInstance.close(true);
            };
            $scope.onNoClick = function () {
                $modalInstance.dismiss('cancel')
            };
        });

}(window.angular));