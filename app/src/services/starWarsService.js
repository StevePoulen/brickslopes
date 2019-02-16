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

                getList: function() {
                    if (starWarsList) {
                        return $q.when(starWarsList);
                    } else {
                        starWarsList = [];
                        return $q.when($http (
                            {
                                method: 'GET',
                                url: '/controllers/paid/starWars.php'
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
                    }
                }
            }
        }
    ]);
})(angular);
