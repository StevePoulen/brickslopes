(function(angular) {
    'use strict';
    angular.module('brickSlopes')
    .factory('StarWars', [
        '$q',
        '$http',
        function(
            $q,
            $http
        ) {
            var starWarsList = undefined;
            return {
                getCount: function() {
                    if (starWarsList) {
                        return $q.when(starWarsList.length);
                    } else {
                        return $q.when(this.getList().then(() => {
                            return starWarsList.length;
                        }));
                    }
                },

                getList: function() {
                    if (starWarsList) {
                        return $q.when(starWarsList);
                    } else {
                        return $q.when($http (
                            {
                                method: 'GET',
                                url: '/controllers/paid/starWars.php'
                            }
                        ).then(function(sets) {
                            if (sets.data) {
                                starWarsList = sets.data.map(set => {
                                    if (set.setId === '0') {
                                        set.setId = 'No Set Number';
                                    }
                                    return set;
                                });
                            }
                            return starWarsList;
                        }));
                    }
                }
            }
        }
    ]);
})(angular);
