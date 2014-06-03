// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('brickSlopes.services', [])
.factory('BrickSlopesText', [ function() {
    var __fontSize = undefined;
    var __fontColor = undefined;
    var __eventImageText = undefined;

    return {
        __setFontSize: function(fontSize) {
            __fontSize = (fontSize) ? fontSize : 1;
        },

        __setFontColor: function(fontColor) {
            __fontColor = (fontColor) ? fontColor + "Font" : "blueFont";
        },

        createText: function(text, fontSize, fontColor) {
            if (! text) {
                return text;
            }
            this.__setFontSize(fontSize);
            this.__setFontColor(fontColor);

            var capsFont = "font-size: " + __fontSize + "em;";
            var smallFontNumber = __fontSize * .8;
            var smallFont = "font-size: " + smallFontNumber + "em;";
            var outputWord = "";
            text = text.replace(/\-/g, ' - ');
            text = text.replace(/\*/g, '* ');
            text = text.replace(/\>/g, '> ');
            var wordArray = text.split(/\s/g);

            _.each(wordArray, function(word) {
                var firstLetter = word[0].toUpperCase();
                var remainder = word.slice(1).toUpperCase();
                outputWord += '<span style="' + capsFont + '">' + firstLetter + '</span>';
                if (remainder != "*" && remainder != '') {
                    outputWord += '<span style="' + smallFont + '">' + remainder + '</span>';
                    outputWord += '&nbsp;';
                }
            });

            outputWord = outputWord.replace(/\*<\/span>&nbsp;/g, '</span>');
            outputWord = outputWord.replace(/\&nbsp;$/, '');

            return '<span class="' + __fontColor + ' bold">' + outputWord +  '</span>';
        }
    }
}])
.factory('EventDetails', ['$q', '$http', function($q, $http) {
    return {
        get: function(eventId) {
            var delay= $q.defer();
            $http (
                {
                    method: 'GET',
                    url: '/controllers/event.php',
                    params: {'eventId': eventId}
                }
            ).success(function(data, status, headers, config) {
                delay.resolve(data);
            }).error(function(data, status, headers, config) {
                delay.reject(data);
            });

            return delay.promise;
        },
    }
}])
.factory('EventRegistration', ['$q', '$http', function($q, $http) {
    return {
        create: function(eventRegistrationDTO) {
            var delay= $q.defer();
            $http (
                {
                    method: 'POST',
                    url: '/controllers/eventRegistration.php',
                    data: eventRegistrationDTO,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }
            ).success(function(data, status, headers, config) {
                delay.resolve(data);
            }).error(function(data, status, headers, config) {
                delay.reject(data);
            });

            return delay.promise;
        },
    }
}])
.factory('Auth', ['$q', '$http', function($q, $http) {
    return {
        login: function(credentials) {
            var delay= $q.defer();
            $http (
                {
                    method: 'GET',
                    url: '/controllers/authentication.php',
                    params: credentials,
                }
            ).success(function(data, status, headers, config) {
                delay.resolve(data);
            }).error(function(data, status, headers, config) {
                delay.reject('Unable to authenticate');
            });

            return delay.promise;
        },

        register: function(userDTO) {
            var delay= $q.defer();
            $http (
                {
                    method: 'POST',
                    url: '/controllers/authentication.php',
                    data: userDTO,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }
            ).success(function(data, status, headers, config) {
                delay.resolve(data);
            }).error(function(data, status, headers, config) {
                delay.reject(data);
            });

            return delay.promise;
        },

        reset: function(userDTO) {
            var delay= $q.defer();
            $http (
                {
                    method: 'PUT',
                    url: '/controllers/authentication.php',
                    data: userDTO
                }
            ).success(function(data, status, headers, config) {
                delay.resolve(data);
            }).error(function(data, status, headers, config) {
                delay.reject(data);
            });

            return delay.promise;
        },

        update: function(passwordDTO) {
            var delay= $q.defer();
            $http (
                {
                    method: 'PATCH',
                    url: '/controllers/authentication.php',
                    data: passwordDTO
                }
            ).success(function(data, status, headers, config) {
                delay.resolve(data);
            }).error(function(data, status, headers, config) {
                delay.reject(data);
            });

            return delay.promise;
        }
    }
}])
.factory('GetAfolMocList', ['$q', '$http', function($q, $http) {
    var mocList = undefined;

    return {
        getCount: function() {
            if (mocList) {
                return $q.when(mocList.afolMocCount);
            } else {
                return $q.when(this.getList().then(function(data) {
                    return mocList.afolMocCount;
                }));
            }
        },

        getList: function() {
            if (mocList) {
                return $q.when(mocList);
            } else {
                return $q.when($http.get('/controllers/mocs/getRegisteredMocList.php').then(function(data) {
                    mocList = data.data;
                    return mocList.mocs;
                }));
            }
        }
    };
}])
.factory('authInterceptor', ['$rootScope', '$q', '$window', '$location', function($rootScope, $q, $window, $location) {
    return {
        request: function(config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = $window.sessionStorage.token;
            }
            return config;
        },
        responseError: function(rejection) {
            if (rejection.status === 401 || rejection.status === 403) {
                $location.path('/afol/login.html');
            } else if (rejection.status >= 500) {
                $location.path('/error.html');
            }
            return $q.reject(rejection);
        },
        response: function(response) {
            if (response.status < 200 || response.status > 299) {
                $location.path('/error.html');
            }
            return response || $q.when(response);
        }
    };
}]);
