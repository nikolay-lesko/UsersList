(function (angular) {
    'use strict';

    angular.module('Directives')
        .directive('sortField', function () {
            return {
                restrict: 'E',
                transclude: true,
                scope: {
                    for: '@',
                    current: '=',
                    desc: '='
                },
                templateUrl: 'views/sortField.html',
                link: function (scope, element, attrs) {
                    if (!scope.desc)
                        scope.desc = false;

                    scope.onToggleClick = function () {
                        if (scope.current != scope.for) {
                            scope.current = scope.for;
                            scope.desc = false;
                        }
                        else
                            scope.desc = !scope.desc;
                    };
                }
            }
        });

}(window.angular));