(function(angular) {
    'use strict';
    angular.module('brickSlopes')
    .factory('StarWars', [
        'EventSelectionFactory',
        '$http',
        '$q',
        '$timeout',
        '$window',
        function(
            EventSelectionFactory,
            $http,
            $q,
            $timeout,
            $window
        ) {
            var starWarsList = undefined;
            return {
                getCount: function() {
                    if (starWarsList) {
                        return $q.when(starWarsList.length);
                    } else {
                        return $q.when(this.getList().then(function() {
                            return starWarsList.length;
                        }));
                    }
                },

                claim: function(setId) {
                    return $q.when($http (
                        {
                            method: 'POST',
                            url: '/controllers/paid/starWars.php',
                            data: {
                                setId: setId,
                                eventId: EventSelectionFactory.getSelectedEvent()
                            }
                        }
                    ));
                },

                unclaim: function(setId) {
                    return $q.when($http (
                        {
                            method: 'PATCH',
                            url: '/controllers/paid/starWars.php',
                            data: {
                                setId: setId,
                                eventId: EventSelectionFactory.getSelectedEvent()
                            }
                        }
                    ));
                },

                $$queryByPage: function(page)  {
                    return $q.when($http (
                        {
                            method: 'GET',
                            url: '/controllers/paid/starWars.php?page=' + page
                        }
                    ).then(function(sets) {
                        var localStarWarsList = [];
                        if (sets.data) {
                            sets.data.map(function(set) {
                                set.claimed = false;
                                set.claim = true;
                                set.unclaim = false;

                                if (set.userId) {
                                    set.claimed = true;
                                    set.claim = false;
                                }

                                if (set.userId === $window.sessionStorage.userId) {
                                    set.unclaim = true;
                                }

                                if (set.setId === '0') {
                                    set.setId = 'No Set Number';
                                }
                                localStarWarsList.push(set);
                            });
                        }
                        return localStarWarsList;
                    }));
                },

                $$queryByPageTimeout: function(page)  {
                    return $timeout(this.$$queryByPage, 1000, true, [page]).then(function(sets) {
                        return sets;
                    });
                },

                getList: function() {
                    if (starWarsList) {
                        return $q.when(starWarsList);
                    } else {
                        starWarsList = [];
                        return $q.all([
                            this.$$queryByPageTimeout(0),
                            this.$$queryByPageTimeout(1),
                            this.$$queryByPageTimeout(2),
                            this.$$queryByPageTimeout(3),
                            this.$$queryByPageTimeout(4),
                            this.$$queryByPageTimeout(5),
                            this.$$queryByPageTimeout(6),
                            this.$$queryByPageTimeout(7)
                        ]).then(function(data) {
                            data.map(function(group) {
                                group.map(function(set) {
                                    starWarsList.push(set);
                                })
                            })
                            return starWarsList;
                        })
                    }
                }
            }
        }
    ]);
})(angular);
