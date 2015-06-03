(function (angular, _) {
    'use strict';

    angular.module('Directives')
        .directive('infinitePager', function ($parse) {
            return {
                restrict: 'EA',
                controller: function ($scope, $element, $attrs) {

                    this.setPageElement = function (pageIndex, element) {
                        var page = _.findWhere(pager.Pages, {Index: pageIndex});
                        page.Element = element;
                    };

                    var minPage = undefined;
                    var maxPage = undefined;

                    var pagerAccessor = $parse($attrs.infinitePager);
                    var pager = pagerAccessor($scope);
                    if (!pager) {
                        pager = {};
                        pagerAccessor.assign($scope, pager);
                    }

                    pager.Pages = [];
                    pager.PageSize = 100;
                    pager.TotalResults = 0;
                    pager.PageIndex = 0;

                    pager.gotoPage = function (pageIndex, forceReload) {

                        pageIndex = Math.max(pageIndex, 1);

                        if (pager.TotalResults > 0) {
                            pageIndex = adjustPageIndex(pageIndex);
                        }

                        if (pageIndex >= minPage && pageIndex <= maxPage) {
                            if (!forceReload) {
                                var pageElement = _.findWhere(pager.Pages, {Index: pageIndex}).Element;
                                scrollToElement(pageElement);

                                return;
                            }
                        }

                        pager.dataSource(pageIndex, pager.PageSize)
                            .then(function (data) {
                                //pager.PageIndex = data.Pager.PageIndex;
                                pager.TotalResults = data.Pager.Total;
                                pager.PageIndex = adjustPageIndex(pager.PageIndex);

                                var page = {
                                    Index: pageIndex,// pager.PageIndex,
                                    Items: data.Items
                                };

                                if (pageIndex == minPage - 1) {
                                    pager.Pages.unshift(page);

                                    setTimeout(function () {
                                        scrollToElement(pager.Pages[1].Element)
                                    }, 0);

                                    minPage--;
                                }
                                else if (pageIndex == maxPage + 1) {
                                    pager.Pages.push(page);
                                    maxPage++;
                                }
                                else { //if (!minPage || !maxPage || pager.PageIndex < minPage || pager.PageIndex > maxPage) {
                                    pager.Pages = [page];
                                    minPage = pageIndex;
                                    maxPage = pageIndex;

                                    setTimeout(function () {
                                        scrollToElement(page.Element);
                                    }, 0);
                                }
                            });
                    };

                    $scope.$watch(function () {
                        return pager.PageSize;
                    }, function (newValue, oldValue) {
                        if (newValue == oldValue) {
                            return;
                        }

                        pager.Pages = [];
                        pager.TotalResults = 0;
                        minPage = undefined;
                        maxPage = undefined;

                        pager.gotoPage(1);
                    });

                    pager.gotoPage(1);

                    $element.scroll(_.throttle(function () {
                        if ($element.scrollTop() == 0) {
                            pager.gotoPage(minPage - 1);
                        }
                        else if ($element.scrollTop() + $element.outerHeight() >= $element[0].scrollHeight * 0.9) {
                            var pageIndex = adjustPageIndex(maxPage + 1);

                            if (pageIndex != pager.PageIndex) {
                                pager.gotoPage(maxPage + 1);
                            }
                        }

                        trackCurrentPage();
                    }, 200));

                    function trackCurrentPage() {
                        for (var i = 0; i < pager.Pages.length; i++) {
                            var page = pager.Pages[i];

                            if (isVisible(page.Element)) {
                                $scope.$apply(function () {
                                    pager.PageIndex = page.Index;
                                });

                                return;
                            }
                        }
                    }

                    function isVisible(pageElement) {
                        var viewTop = $element.scrollTop();
                        var viewHeight = $element.outerHeight();
                        var viewMiddle = viewTop + viewHeight * 0.3;

                        var height = pageElement.outerHeight();
                        var top = pageElement.position().top + viewTop;
                        var bottom = top + height;

                        return (top <= viewMiddle && bottom >= viewMiddle);
                    }

                    function scrollToElement(pageElement) {
                        $element.scrollTop($element.scrollTop() + pageElement.position().top);
                    }

                    function adjustPageIndex(pageIndex) {
                        return Math.min(pageIndex, Math.ceil(pager.TotalResults / pager.PageSize));
                    }
                }
            };
        })
        .directive('infinitePagerPage', function ($parse) {
            return {
                restrict: 'A',
                require: '^infinitePager',
                link: function (scope, element, attrs, infinitePagerController) {
                    var pageIndex = $parse(attrs.infinitePagerPage)(scope);

                    var colors = ['red', 'green', 'blue', 'magenta', 'black'];

                    element.css('border', 'solid 1px ' + colors[pageIndex - 1 % colors.length]);

                    infinitePagerController.setPageElement(pageIndex, element);
                }
            }
        });

}(window.angular, window._));