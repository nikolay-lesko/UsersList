(function (angular) {
    'use strict';

    angular.module('Directives')
        .directive('progressIndicator', function () {
            return {
                restrict: 'E',
                template: '<div class="loading">' +
                '           <div class="background"></div>' +
                '           <div class="content">' +
                '               <img src="css/img/loading.gif"/>' +
                '           </div>' +
                '</div>'
            }
        });

}(window.angular));