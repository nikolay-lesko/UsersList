(function (angular) {
    'use strict';

    function restrictInput(modelCtrl, parseFn) {

        modelCtrl.$parsers.push(function (inputValue) {
            var transformedInput = parseFn(inputValue);

            if (transformedInput !== inputValue) {
                modelCtrl.$setViewValue(transformedInput);
                modelCtrl.$render();
            }

            return transformedInput;
        });
    }

    angular.module('Directives')
        .directive('numericOnly', function () {
            return {
                require: 'ngModel',
                link: function (scope, element, attrs, modelCtrl) {

                    var regex = new RegExp('[^0-9]', 'g');

                    restrictInput(modelCtrl, function (inputValue) {
                        var parsed = (inputValue || '').replace(regex, '');

                        parsed = parseInt(parsed, 10);

                        return isNaN(parsed) ? 0 : (parsed + '');
                    });
                }
            };
        })
        .directive('alphabetOnly', function () {
            return {
                require: 'ngModel',
                link: function (scope, element, attrs, modelCtrl) {
                    var regex = new RegExp('[^a-zA-Z]', 'g');

                    restrictInput(modelCtrl, function (inputValue) {
                        return (inputValue || '').replace(regex, '');
                    });
                }
            };
        });

}(window.angular));