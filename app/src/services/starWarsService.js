(function(angular) {
    'use strict';
    angular.module('brickSlopes')
    .factory('StarWars', [
        'EventSelectionFactory',
        '$http',
        '$q',
        '$window',
        function(
            EventSelectionFactory,
            $http,
            $q,
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

                getList: function() {
                    if (starWarsList) {
                        return $q.when(starWarsList);
                    } else {
                        starWarsList = [];
                        return $q.all([
                            this.$$queryByPage(0),
                            this.$$queryByPage(1),
                            this.$$queryByPage(2),
                            this.$$queryByPage(3),
                            this.$$queryByPage(4),
                            this.$$queryByPage(5),
                            this.$$queryByPage(6),
                            this.$$queryByPage(7),
                            this.$$queryByPage(8),
                            this.$$queryByPage(9),
                            this.$$queryByPage(10),
                            this.$$queryByPage(11),
                            this.$$queryByPage(12),
                            this.$$queryByPage(13),
                            this.$$queryByPage(14)
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
