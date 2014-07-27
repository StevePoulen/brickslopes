// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('brickSlopes.services', ['ngResource'])
.factory('BrickSlopesText', [ function() {
    var __fontSize = undefined;
    var __fontColor = undefined;
    var __maxSize = undefined;

    return {
        __setFontSize: function(fontSize) {
            __fontSize = (fontSize) ? fontSize : 1;
        },

        __setFontColor: function(fontColor) {
            __fontColor = (fontColor) ? fontColor + "Font" : "blueFont";
        },

        __setMaxSize: function(text, maxSize) {
            if(maxSize) {
                if (text.length>maxSize) {
                    text = text.substr(0,maxSize-4);
                    text += ' ...';
                };
            }

            return text;
        },

        __styleRemainder: function(smallFont, remainder) {
            if (remainder) {
                return '<span style="' + smallFont + '">' + remainder + '</span>';
            } else {
                return "";
            }
        },

        createText: function(text, fontSize, fontColor, maxSize) {
            var self = this;
            if (! text) {
                return text;
            }
            this.__setFontSize(fontSize);
            this.__setFontColor(fontColor);
            text = this.__setMaxSize(text, maxSize);

            var capsFont = "font-size: " + __fontSize + "em;";
            var smallFontNumber = __fontSize * .8;
            var smallFont = "font-size: " + smallFontNumber + "em;";
            var outputWord = "";
            var remainder = "";
            var nextCapitalize = false;

            _.each(text, function(letter, index) {
                if (letter.match(/\d+/)) {
                    outputWord += self.__styleRemainder(smallFont, remainder);
                    remainder = "";
                    nextCapitalize = true;
                }

                if (letter.match(/\s/)) {
                    outputWord += self.__styleRemainder(smallFont, remainder);
                    remainder = "";
                    outputWord += "&nbsp;";
                    nextCapitalize = true;
                } else if (letter.match(/-/)) {
                    outputWord += self.__styleRemainder(smallFont, remainder);
                    remainder = "";
                    outputWord += "-";
                    nextCapitalize = true;
                } else if (letter.match(/>/)) {
                    outputWord += self.__styleRemainder(smallFont, remainder);
                    remainder = "";
                    outputWord += ">";
                    nextCapitalize = true;
                } else {
                    if (
                        index === 0 ||
                        nextCapitalize
                    ) {
                        outputWord += '<span style="' + capsFont + '">' + letter.toUpperCase() + '</span>';
                        nextCapitalize = false;
                    } else {
                        remainder += letter.toUpperCase();
                    }
                }
            });

            outputWord += this.__styleRemainder(smallFont, remainder);
            return '<span class="' + __fontColor + ' bold">' + outputWord +  '</span>';
        }
    }
}])
.factory('Games', ['$q', '$http', '$sce', function($q, $http, $sce) {
    var gameList = undefined;

    return {
        getCount: function(eventId) {
            if (gameList) {
                return $q.when(gameList.length);
            } else {
                return $q.when(this.getList(eventId).then(function(data) {
                    return gameList.length;
                }));
            }
        },

        getList: function(eventId) {
            if (gameList) {
                return $q.when(gameList);
            } else {
                return $q.when($http (
                    {
                        method: 'get',
                        url: '/controllers/registered/games.php',
                        params: {eventId: eventId}
                    }
                ).then(function(data) {
                    gameList = data.data;
                    _.each(gameList, function(game, index) {
                        game.description = $sce.trustAsHtml(game.description);
                        game.registration = (game.openRegistration === 'YES' ? 'Open' : 'Closed');
                        game.showCTAButton = (game.openRegistration === 'YES');
                        game.isAwards = (game.awards ? (game.awards.length ? true : false) : false);
                    })
                    return gameList;
                }));
            }
        },

        gameRegistration: function(gameDTO) {
            var delay= $q.defer();
            $http (
                {
                    method: 'POST',
                    url: '/controllers/registered/gameUser.php',
                    data: gameDTO
                }
            ).success(function(data, status, headers, config) {
                delay.resolve(status);
            }).error(function(data, status, headers, config) {
                delay.reject(status);
            });

            return delay.promise;
        },

        getUserGameList: function(eventId) {
            var delay= $q.defer();
            $http (
                {
                    method: 'GET',
                    url: '/controllers/registered/gameUser.php',
                    params: {
                        eventId: eventId
                    }
                }
            ).success(function(data, status, headers, config) {
                delay.resolve(data);
            }).error(function(data, status, headers, config) {
                delay.reject(data);
            });

            return delay.promise;
        },

        gameDeletion: function(eventId, gameId) {
            var delay= $q.defer();
            $http (
                {
                    method: 'DELETE',
                    url: '/controllers/registered/gameUser.php',
                    params: {
                        eventId: eventId,
                        gameId: gameId
                    }
                }
            ).success(function(data, status, headers, config) {
                delay.resolve(status);
            }).error(function(data, status, headers, config) {
                delay.reject(status);
            });

            return delay.promise;
        }
    };
}])
.factory('Themes', ['$q', '$http', function($q, $http) {
    var themeList = undefined;

    return {
        getCount: function(eventId) {
            if (themeList) {
                return $q.when(themeList.length);
            } else {
                return $q.when(this.getList(eventId).then(function(data) {
                    return themeList.length;
                }));
            }
        },

        getList: function(eventId) {
            if (themeList) {
                return $q.when(themeList);
            } else {
                return $q.when($http (
                    {
                        method: 'GET',
                        url: '/controllers/registered/themes.php',
                        params: {eventId: eventId}
                    }
                ).then(function(data) {
                    themeList = data.data;
                    return themeList;
                }));
            }
        }
    }
}])
.factory('EventDetails', ['$resource', function($resource) {
    return $resource('/controllers/event.php', { eventId: '@eventId' });
}])
.factory('EmailUs', ['$q', '$http', function($q, $http) {
    return {
        create: function(emailDTO) {
            var delay= $q.defer();
            $http (
                {
                    method: 'POST',
                    url: '/controllers/emailUs.php',
                    data: emailDTO,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
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
.factory('RegistrationLineItems', ['$q', '$http', function($q, $http) {
    return {
        get: function(eventId) {
            var delay= $q.defer();
            $http (
                {
                    method: 'GET',
                    url: '/controllers/registrationLineItems.php',
                    params: {'eventId': eventId}
                }
            ).success(function(data, status, headers, config) {
                delay.resolve(data);
            }).error(function(data, status, headers, config) {
                delay.reject(data);
            });

            return delay.promise;
        },

        revokePayment: function(registrationLineItemId, registrationId) {
            var delay= $q.defer();
            $http (
                {
                    method: 'PATCH',
                    url: '/controllers/admin/payment.php',
                    data: {
                        'registrationLineItemId': registrationLineItemId,
                        'registrationId': registrationId,
                        'revoke': 'yes'
                    }
                }
            ).success(function(data, status, headers, config) {
                delay.resolve(data);
            }).error(function(data, status, headers, config) {
                delay.reject(data);
            });

            return delay.promise;
        },

        confirmPayment: function(registrationLineItemId, registrationId) {
            var delay= $q.defer();
            $http (
                {
                    method: 'PATCH',
                    url: '/controllers/admin/payment.php',
                    data: {
                        'registrationLineItemId': registrationLineItemId,
                        'registrationId': registrationId,
                        'revoke': 'no'
                    }
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
.factory('UserDetails', ['$q', '$http', '$window', function($q, $http, $window) {
    userList = undefined;

    function memberSince(data) {
        data.memberSince = moment(data.joined).format('MMMM Do, YYYY');
        return data;
    }
    return {
        isUserRegistered: function() {
            return ($window.sessionStorage.registered == 'YES');
        },

        isUserPaid: function() {
            return ($window.sessionStorage.paid == 'YES');
        },

        getCount: function() {
            if (userList) {
                return $q.when(userList.length);
            } else {
                return $q.when(this.getAll().then(function(data) {
                    return userList.length;
                }));
            }
        },
        get: function() {
            var delay= $q.defer();
            $http (
                {
                    method: 'GET',
                    url: '/controllers/user.php'
                }
            ).success(function(data, status, headers, config) {
                delay.resolve(memberSince(data));
            }).error(function(data, status, headers, config) {
                delay.reject(data);
            });

            return delay.promise;
        },

        getAll: function() {
            if (userList) {
                return $q.when(userList);
            }   else {
                return $q.when($http (
                    {
                        method: 'GET',
                        url: '/controllers/admin/registeredUsers.php'
                    }
                ).then(function(data) {
                    userList = data.data;
                    _.each(userList, function(user) {
                        memberSince(user);
                    });
                    return userList;
                }));
            }
        },

        register: function(userDTO) {
            var delay= $q.defer();
            $http (
                {
                    method: 'POST',
                    url: '/controllers/user.php',
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

        update: function(userDTO) {
            var delay= $q.defer();
            $http (
                {
                    method: 'PATCH',
                    url: '/controllers/user.php',
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
    }
}])
.factory('EventDates', ['EventDatesAPI', '$q', function(EventDatesAPI, $q) {
    var __eventDates = queryEventDates();
    var __eventDatesCached = {};

    function queryEventDates() {
        return EventDatesAPI.get().then(function(data) {
            __eventDates = data;
            return __eventDates;
        })
    }

    return {
        setCache: function(eventId, key, value) {
            if (! __eventDatesCached[eventId]) {
                __eventDatesCached[eventId] = {};
            }
            __eventDatesCached[eventId][key] = value;

            return value;
        },

        getCache: function(eventId, key) {
            try {
                return __eventDatesCached[eventId][key];
            } catch (error) {
                return false;
            }
        },

        getAllEvents: function() {
            return $q.when(__eventDates);
        },

        __getAfolTimestamps: function(eventId) {
            var afolTimestamps = this.getCache(eventId, 'afolTimestamps');
            if (afolTimestamps) {
                return $q.when(afolTimestamps);
            } else {
                var afolStartTimestamps = [];
                var afolEndTimestamps = [];
                var self = this;

                return this.getAllEvents().then(function(allEvents) {
                    _.each(allEvents[eventId], function(eventObj) {
                        if (eventObj.type === "AFOL") {
                            afolStartTimestamps.push(moment(eventObj.startDate));
                            afolEndTimestamps.push(moment(eventObj.endDate));
                        }
                    });

                    return self.setCache (
                        eventId,
                        'afolTimestamps',
                        {
                            'start': afolStartTimestamps,
                            'end': afolEndTimestamps,
                            'last': afolEndTimestamps.length - 1,
                            'size': afolEndTimestamps.length
                        }
                    )
                });
            }
        },

        __getPublicTimestamps: function(eventId) {
            var publicTimestamps = this.getCache(eventId, 'publicTimestamps');
            if (publicTimestamps) {
                return $q.when(publicTimestamps);
            } else {
                var publicStartTimestamps = [];
                var publicEndTimestamps = [];
                var self = this;

                return this.getAllEvents().then(function(allEvents) {
                    _.each(allEvents[eventId], function(eventObj) {
                        if (eventObj.type === "PUBLIC") {
                            publicStartTimestamps.push(moment(eventObj.startDate));
                            publicEndTimestamps.push(moment(eventObj.endDate));
                        }
                    });

                    return self.setCache (
                        eventId,
                        'publicTimestamps',
                        {
                            'start': publicStartTimestamps,
                            'end': publicEndTimestamps,
                            'last': publicEndTimestamps.length - 1,
                            'size': publicEndTimestamps.length
                        }
                    )

                });

            }
        },

        getPublicDates: function(eventId) {
            var publicDates = this.getCache(eventId, 'publicDates');
            if (publicDates) {
                return $q.when(publicDates);
            } else {
                var self = this;
                return this.__getPublicTimestamps(eventId).then(function(publicTimestamps) {
                    var publicDates = [];
                    for(var index=0; index<publicTimestamps.size; index++) {
                        publicDates.push(
                            {
                                'date': moment(publicTimestamps.start[index]).format('dddd, MMMM Do'),
                                'hours': moment(publicTimestamps.start[index]).format('h a to ') + moment(publicTimestamps.end[index]).format('h a')
                            }
                        );
                    }

                    return self.setCache (
                        eventId,
                        'publicDates',
                        publicDates
                    )
                });
            }
        },

        getPublicDatesTogether: function(eventId) {
            var publicDates = this.getCache(eventId, 'publicDatesTogether');
            if (publicDates) {
                return $q.when(publicDates);
            } else {
                var self = this;
                return this.__getPublicTimestamps(eventId).then(function(publicTimestamps) {
                    var publicDates = moment(publicTimestamps.start[0]).format('MMM D');
                    publicDates += moment(publicTimestamps.end[publicTimestamps.last]).format(' & D, YYYY');

                    return self.setCache (
                        eventId,
                        'publicDatesTogether',
                        publicDates
                    )
                });
            }
        },

        getEventMonthYear: function(eventId) {
            var self = this;
            var eventMonthYear = this.getCache(eventId, 'monthYear');
            if (eventMonthYear) {
                return $q.when(eventMonthYear);
            } else {
                return this.getAllEvents().then(function(allEvents) {
                    return self.setCache (
                        eventId,
                        'monthYear',
                        moment(allEvents[eventId][0].startDate).format('MMMM, YYYY')
                    )
                });
            }
        },

        getPassDates: function(eventId) {
            var self = this;
            var passDates = this.getCache(eventId, 'passDates');
            if (passDates) {
                return $q.when(passDates);
            } else {
                return this.__getAfolTimestamps(eventId).then(function(afolTimestamps) {
                    return self.setCache (
                        eventId,
                        'passDates',
                        moment(afolTimestamps.start[0]).format('MMMM Do') +
                        ' thru ' +
                        moment(afolTimestamps.end[afolTimestamps.last]).format('Do')
                    )
                });
            }
        },

        getMeetAndGreetDinnerDate: function(eventId) {
            var self = this;
            var meetAndGreetDinnerDate = this.getCache(eventId, 'meetAndGreetDinnerDate');
            if (meetAndGreetDinnerDate) {
                return $q.when(meetAndGreetDinnerDate);
            } else {
                return this.__getAfolTimestamps(eventId).then(function(afolTimestamps) {
                    return self.setCache (
                        eventId,
                        'meetAndGreetDinnerDate',
                        moment(afolTimestamps.start[0]).format('dddd, MMMM Do')
                    )
                });
            }
        },

        getPassType: function(eventId) {
            var self = this;
            var passType = this.getCache(eventId, 'passType');
            if (passType) {
                return $q.when(passType);
            } else {
                return this.__getAfolTimestamps(eventId).then(function(afolTimestamps) {
                    return self.setCache (
                        eventId,
                        'passType',
                        afolTimestamps.size + '-Day'
                    )
                });
            }
        },

        getEventYear: function(eventId) {
            var self = this;
            var eventYear = this.getCache(eventId, 'year');
            if (eventYear) {
                return $q.when(eventYear);
            } else {
                return this.getAllEvents().then(function(allEvents) {
                    return self.setCache (
                        eventId,
                        'year',
                        moment(allEvents[eventId][0].startDate).format('YYYY')
                    )
                });
            }
        }
    }
}])
.factory('RegisteredAfols', ['$q', '$http', function($q, $http) {
    afolList = undefined;

    return {
        getCount: function($eventId) {
            if (afolList) {
                return $q.when(afolList[$eventId].registeredAfols.length);
            } else {
                return $q.when(this.get($eventId).then(function(data) {
                    return afolList[$eventId].registeredAfols.length;
                }));
            }
        },

        get: function(eventId) {
            if (afolList) {
                return $q.when(afolList);
            }   else {
                return $q.when($http (
                    {
                        method: 'GET',
                        url: '/controllers/registeredAfols.php',
                        params: {'eventId': eventId}
                    }
                ).then(function(data) {
                    afolList = data.data;
                    return afolList;
                }));
            }
        },

        sendPaymentEmail: function(userId, eventId) {
            var delay= $q.defer();
            $http (
                {
                    method: 'GET',
                    url: '/controllers/admin/sendEmail.php',
                    params: {
                        'userId': userId,
                        'eventId': eventId,
                        'type': 'registrationPaid'
                    }
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
.factory('EventDatesAPI', ['$q', '$http', function($q, $http) {
    return {
        get: function() {
            var delay= $q.defer();
            $http (
                {
                    method: 'GET',
                    url: '/controllers/public/eventDates.php'
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
.factory('EventRegistration', ['$q', '$http', function($q, $http) {
    function parseEventRegistrationData(data) {
        _.each(data, function(eventObj, key) {
            eventObj.total = eventObj.lineItems.total;
            eventObj.tShirtSize = 'No Thanks';
            eventObj.type = (eventObj.ageVerification == 'YES' ? 'AFOL' : 'TFOL');
            eventObj.meetAndGreet = 'NO';
            eventObj.paidCTA = (eventObj.paid == 'YES');
            eventObj.nameBadge = 'NO';
            eventObj.showBadgeLine1 = false;
            eventObj.badgeLine1 = undefined;
            eventObj.showBadgeLine2 = false;
            eventObj.badgeLine2 = undefined;
            eventObj.showBadgeLine3 = false;
            eventObj.badgeLine3 = undefined;
            _.each(eventObj.lineItems.lineItems, function(lineItemObj) {
                if (lineItemObj.active === 'YES') {
                    if (lineItemObj.lineItem === 'T-Shirt') {
                        eventObj.tShirtSize = lineItemObj.size;
                    } else if (lineItemObj.lineItem === 'Meet and Greet') {
                        eventObj.meetAndGreet = 'YES'
                    } else if (lineItemObj.lineItem === 'Event Badge Brick') {
                        eventObj.badgeLine1 = lineItemObj.description;
                        eventObj.showBadgeLine1 = true;
                    } else if (lineItemObj.lineItem === 'Complete Name Badge') {
                        eventObj.nameBadge = 'YES';
                    } else if (lineItemObj.lineItem === '1st Badge Brick') {
                        eventObj.badgeLine2 = lineItemObj.description;
                        eventObj.showBadgeLine2 = true;
                    } else if (lineItemObj.lineItem === '2nd Badge Brick') {
                        eventObj.badgeLine3 = lineItemObj.description;
                        eventObj.showBadgeLine3 = true;
                    }
                }
            });
        });

        return data;
    }
    return {
        get: function() {
            var delay= $q.defer();
            $http (
                {
                    method: 'GET',
                    url: '/controllers/eventRegistration.php'
                }
            ).success(function(data, status, headers, config) {
                delay.resolve(parseEventRegistrationData(data));
            }).error(function(data, status, headers, config) {
                delay.reject(data);
            });

            return delay.promise;
        },

        submitRegistration: function(isCreate, dto) {
            return (isCreate ? this.create(dto) : this.patch(dto));
        },

        patch: function(eventRegistrationDTO) {
            var delay= $q.defer();
            $http (
                {
                    method: 'PATCH',
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
        }
    }
}])
.factory('Auth', ['$q', '$http', function($q, $http) {
    return {
        login: function(credentials) {
            var delay= $q.defer();
            $http (
                {
                    method: 'POST',
                    url: '/controllers/public/authentication.php',
                    data: credentials
                }
            ).success(function(data, status, headers, config) {
                delay.resolve(data);
            }).error(function(data, status, headers, config) {
                delay.reject('Unable to authenticate');
            });

            return delay.promise;
        },

        reset: function(userDTO) {
            var delay= $q.defer();
            $http (
                {
                    method: 'PUT',
                    url: '/controllers/public/authentication.php',
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
                    url: '/controllers/public/authentication.php',
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
.factory('MocDetails', ['$q', '$http', function($q, $http) {
    var mocList = undefined;

    return {
        getCount: function(eventId) {
            if (mocList) {
                return $q.when(mocList.length);
            } else {
                return $q.when(this.getList(eventId).then(function(data) {
                    return mocList.length;
                }));
            }
        },

        getList: function(eventId) {
            if (mocList) {
                return $q.when(mocList);
            } else {
                return $q.when($http (
                    {
                        method: 'GET',
                        url: '/controllers/registered/mocs.php',
                        params: {eventId: eventId}
                    }
                ).then(function(data) {
                    mocList = data.data;
                    return mocList;
                }));
            }
        },

        create: function(mocDTO) {
            var delay= $q.defer();
            $http (
                {
                    method: 'POST',
                    url: '/controllers/registered/mocs.php',
                    data: mocDTO
                }
            ).success(function(data, status, headers, config) {
                delay.resolve(status);
            }).error(function(data, status, headers, config) {
                delay.reject(status);
            });

            return delay.promise;
        }
    };
}])
.factory('Feedback', ['$q', '$http', function($q, $http) {
    return {
        get: function() {
            var delay= $q.defer();
            $http (
                {
                    method: 'GET',
                    url: '/controllers/public/feedback.php'
                }
            ).success(function(data, status, headers, config) {
                delay.resolve(data);
            }).error(function(data, status, headers, config) {
                delay.reject(data);
            });

            return delay.promise;
        },
        create: function(feedbackDTO) {
            var delay= $q.defer();
            $http (
                {
                    method: 'POST',
                    url: '/controllers/public/feedback.php',
                    data: feedbackDTO
                }
            ).success(function(data, status, headers, config) {
                delay.resolve(status);
            }).error(function(data, status, headers, config) {
                delay.reject(data);
            });

            return delay.promise;
        }
    };
}])
.factory('GetEmailHtml', ['$q', '$http', function($q, $http) {
    return {
        getEventRegistration: function() {
            var delay= $q.defer();
            $http (
                {
                    method: 'GET',
                    url: '/controllers/admin/sendEmail.php',
                    params: {
                        type: 'eventRegistrationMessage',
                        userId: 'not_needed'
                    }
                }
            ).success(function(data, status, headers, config) {
                delay.resolve(data);
            }).error(function(data, status, headers, config) {
                delay.reject(data);
            });

            return delay.promise;
        }
    };
}])
.factory('authInterceptor', ['$rootScope', '$q', '$window', '$location', function($rootScope, $q, $window, $location) {
    return {
        request: function(config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authtoken = $window.sessionStorage.token;
            }

            return config;
        },
        responseError: function(rejection) {
            if (rejection.status === 401 || rejection.status === 403) {
                $window.sessionStorage.redirectUrl=rejection.config.url;
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
