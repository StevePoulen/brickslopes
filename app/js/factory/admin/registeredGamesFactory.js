(function(angular) {
    'use strict';
    angular.module('brickSlopes').factory('RegisteredGames', [
        '$q',
        '$http',
        'EventSelectionFactory',
        function(
            $q,
            $http,
            EventSelectionFactory
        ) {
            var gamesList = undefined;

            //This is for the one time there is an event with no registered Games
            function getGamesCount() {
                if (Object.keys(gamesList).length) {
                    var afolCount = 0;
                    _.each(gamesList, function(game) {
                        afolCount += game.registeredAfols.length;
                    });
                    return afolCount;
                } else {
                    return 0;
                }
            }

            return {
                getCount: function() {
                    if (gamesList) {
                        return $q.when(getGamesCount());
                    } else {
                        return $q.when(this.get().then(function(data) {
                            return getGamesCount();
                        }));
                    }
                },

                get: function() {
                    if (gamesList) {
                        return $q.when(gamesList);
                    }   else {
                        return $q.when($http (
                            {
                                method: 'GET',
                                url: '/controllers/admin/registeredGames.php',
                                params: {
                                    eventId: EventSelectionFactory.getSelectedEvent() 
                                }
                            }
                        ).then(function(data) {
                            gamesList = data.data;
                            return gamesList;
                        }));
                    }
                }
            }
        }
    ]);
})(angular);
