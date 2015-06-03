(function (angular, _) {
    'use strict';

    angular.module('Services')
        .factory('UsersService', function ($q, FakeDataService) {

            return {
                list: function (pageIndex, pageSize, search, sort) {

                    if (pageIndex == undefined || pageSize == undefined || pageIndex < 1 || pageSize <= 0) {
                        return defer.reject('Invalid pager parameters');
                    }

                    var users = _.map(FakeDataService.Users, _.clone);

                    if (!sort) {
                        sort = {
                            Field: 'Id',
                            Desc: false
                        };
                    }

                    if (search && _.isObject(search)) {
                        users = _.filter(users, createSearchPredicate(search));
                    }

                    users = _.sortBy(users, sort.Field);
                    if (sort.Desc) {
                        users.reverse();
                    }

                    //pageIndex = Math.min(pageIndex, Math.max((users.length / pageSize) - 1, 0));
                    pageIndex = Math.min(Math.max(pageIndex, 1), Math.ceil(users.length / pageSize));

                    var start = (pageIndex - 1) * pageSize;
                    var end = start + pageSize;

                    var result = {
                        Items: users.slice(start, end),
                        Pager: {
                            PageIndex: pageIndex,
                            PageSize: pageSize,
                            Total: users.length
                        }
                    };

                    return $q.when(result);
                },
                delete: function (ids) {
                    _.each(ids, function (id) {
                        var index = _.findIndex(FakeDataService.Users, function (user) {
                            return user.Id == id;
                        });
                        if (index != -1) {
                            FakeDataService.Users.splice(index, 1);
                        }
                    })
                }
            }

            function createSearchPredicate(search) {
                return function (user) {
                    if (search.Id && user.Id.toString().indexOf(search.Id) == -1) {
                        return false;
                    }

                    if (search.FirstName && user.FirstName.indexOf(search.FirstName) == -1) {
                        return false;
                    }

                    if (search.LastName && user.LastName.indexOf(search.LastName) == -1) {
                        return false;
                    }

                    if (search.Email && user.Email.indexOf(search.Email) == -1) {
                        return false;
                    }

                    if (search.Age && search.Age.From >= 0 && search.Age.To > 0) {
                        if (user.Age < search.Age.From || user.Age > search.Age.To) {
                            return false;
                        }
                    }

                    return true;
                };
            }
        });

}(window.angular, window._));