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
                template: '' +
                '<span class="sort-field" ng-click="onToggleClick()" ng-class="{ active: current == for }" style="cursor:pointer">' +
                '   <span ng-transclude ></span> ' +
                '   <button class="btn btn-default glyphicon "' +
                '           ng-class="getButtonClass()" ' +
                '           ng-style="getButtonStyle()"></button>' +
                '</span>',
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

                    scope.getButtonStyle = function () {
                        var style = {
                            visibility: scope.current == scope.for ? 'visible' : 'collapse'
                        };

                        return style;
                    };

                    scope.getButtonClass = function () {
                        return scope.desc
                            ? 'glyphicon-sort-by-attributes-alt'
                            : 'glyphicon-sort-by-attributes';
                    };

                    scope.getContentStyle = function () {
                        var style = {
                            cursor: scope.for != scope.current ? 'pointer' : ''
                        }
                        return style;
                    };
                }
            }
        });

}(window.angular));