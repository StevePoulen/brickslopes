
angular.module('Admin').factory('RegisteredGames', ['$q', '$http', function($q, $http) {
    gamesList = undefined;

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
        getCount: function(eventId) {
            if (gamesList) {
                return $q.when(getGamesCount());
            } else {
                return $q.when(this.get(eventId).then(function(data) {
                    return getGamesCount();
                }));
            }
        },

        get: function(eventId) {
            if (gamesList) {
                return $q.when(gamesList);
            }   else {
                return $q.when($http (
                    {
                        method: 'GET',
                        url: '/controllers/admin/registeredGames.php',
                        params: {'eventId': eventId}
                    }
                ).then(function(data) {
                    gamesList = data.data;
                    return gamesList;
                }));
            }
        }
    }
}]);
