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
                    var noScrollTrack = false;

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
                        loadPage(pageIndex, forceReload, false);
                    };

                    function loadPage(pageIndex, forceReload, doNotScroll) {

                        pageIndex = Math.max(pageIndex, 1);

                        if (pager.TotalResults > 0) {
                            pageIndex = adjustPageIndex(pageIndex);
                        }

                        if (pageIndex >= minPage && pageIndex <= maxPage) {
                            if (!forceReload) {
                                scrollToPage(pageIndex);
                                return;
                            }
                        }

                        pager.dataSource(pageIndex, pager.PageSize)
                            .then(function (data) {
                                pager.TotalResults = data.Pager.Total;
                                pager.PageIndex = adjustPageIndex(pager.PageIndex);

                                var page = {
                                    Index: pageIndex,
                                    Items: data.Items
                                };

                                if (pageIndex == minPage - 1) {
                                    pager.Pages.unshift(page);
                                    minPage--;

                                    doScroll(pageIndex + 1);
                                }
                                else if (pageIndex == maxPage + 1) {
                                    pager.Pages.push(page);
                                    maxPage++;

                                    doScroll(pageIndex);
                                }
                                else {
                                    pager.Pages = [page];
                                    minPage = pageIndex;
                                    maxPage = pageIndex;

                                    doScroll(pageIndex);
                                }
                            });

                        function doScroll(index) {
                            if (!doNotScroll) {
                                scrollToPage(index);
                            }
                        }
                    };

                    watchPageSize();
                    watchScroll();
                    loadPage(1);

                    function watchPageSize() {
                        $scope.$watch(function () {
                            return pager.PageSize;
                        }, function (newValue, oldValue) {
                            if (angular.equals(newValue, oldValue)) {
                                return;
                            }

                            pager.Pages = [];
                            pager.TotalResults = 0;
                            minPage = undefined;
                            maxPage = undefined;

                            loadPage(1, true, true);
                        });
                    }

                    function watchScroll() {
                        $element.scroll(_.throttle(function () {
                            if (noScrollTrack) {
                                noScrollTrack = false;
                                return;
                            }

                            if ($element.scrollTop() == 0) {
                                loadPage(minPage - 1, false);
                            }
                            else if ($element.scrollTop() + $element.outerHeight() >= $element[0].scrollHeight * 0.9) {
                                var pageIndex = adjustPageIndex(maxPage + 1);

                                if (pageIndex != pager.PageIndex) {
                                    loadPage(maxPage + 1, false, true);
                                }
                            }

                            trackCurrentPage();
                        }, 200));
                    }

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
                        var viewMiddle = viewTop + viewHeight * 0.45;

                        var height = pageElement.outerHeight();
                        var top = pageElement.position().top + viewTop;
                        var bottom = top + height;

                        return (top <= viewMiddle && bottom >= viewMiddle);
                    }

                    function scrollToPage(pageIndex) {
                        setTimeout(function () {
                            var page = _.findWhere(pager.Pages, {Index: pageIndex});
                            var pageElement = page.Element;

                            noScrollTrack = true;
                            $element.scrollTop($element.scrollTop() + pageElement.position().top);
                        }, 0);
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

                    //var colors = ['red', 'green', 'blue', 'magenta', 'black'];
                    //
                    //element.css('border', 'solid 1px ' + colors[pageIndex - 1 % colors.length]);

                    infinitePagerController.setPageElement(pageIndex, element);
                }
            }
        });

}(window.angular, window._));