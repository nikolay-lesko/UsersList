(function (angular) {
    'use strict';

    angular.module('Directives')
        .directive('inlineUserEditor', function () {
            return {
                restrict: 'E',
                scope: {
                    OriginalUser: '=user',
                    onSave: '&',
                    onCancel: '&'
                },
                templateUrl: 'views/inlineUserEditor.html',
                link: function (scope, element, attrs) {
                    scope.onSave = scope.onSave(); // unwrap callback

                    scope.EditingUser = angular.copy(scope.OriginalUser);

                    scope.onSaveClick = function (isFormValid) {
                        if (!isFormValid) {
                            return;
                        }

                        scope.onSave(scope.EditingUser, scope.OriginalUser);
                    };
                }
            }
        });

}(window.angular));