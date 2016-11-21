(function(angular) {
    'use strict';
    angular.module('brickSlopes')
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
                        outputWord += '<span style="' + capsFont + '">' + letter + '</span>';
                        nextCapitalize = false;
                    } else if (letter.match(/\s/)) {
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
                    } else if (letter.match(/\)/)) {
                        outputWord += self.__styleRemainder(smallFont, remainder);
                        remainder = "";
                        outputWord += '<span style="' + capsFont + '">)</span>';
                        nextCapitalize = true;
                    } else if (letter.match(/[A-Z]/)) {
                        outputWord += self.__styleRemainder(smallFont, remainder);
                        remainder = "";
                        outputWord += '<span style="' + capsFont + '">' + letter.toUpperCase() + '</span>';
                        nextCapitalize = false;
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
    .factory('Games', [
        '$q',
        '$http',
        '$sce',
        'EventSelectionFactory',
        function(
            $q,
            $http,
            $sce,
            EventSelectionFactory
        ) {
        var gameList = undefined;

        return {
            getCount: function() {
                if (gameList) {
                    return $q.when(gameList.length);
                } else {
                    return $q.when(this.getList().then(function(data) {
                        return gameList.length;
                    }));
                }
            },

            getList: function() {
                if (gameList) {
                    return $q.when(gameList);
                } else {
                    return $q.when($http (
                        {
                            method: 'get',
                            url: '/controllers/paid/games.php',
                            params: {
                                eventId: EventSelectionFactory.getSelectedEvent()
                            }
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
                        url: '/controllers/paid/gameUser.php',
                        data: gameDTO
                    }
                ).success(function(data, status, headers, config) {
                    delay.resolve(status);
                }).error(function(data, status, headers, config) {
                    delay.reject(status);
                });

                return delay.promise;
            },

            getUserGameList: function() {
                var delay= $q.defer();
                $http (
                    {
                        method: 'GET',
                        url: '/controllers/paid/gameUser.php',
                        params: {
                            eventId: EventSelectionFactory.getSelectedEvent()
                        }
                    }
                ).success(function(data, status, headers, config) {
                    delay.resolve(data);
                }).error(function(data, status, headers, config) {
                    delay.reject(data);
                });

                return delay.promise;
            },

            gameDeletion: function(gameId) {
                var delay= $q.defer();
                $http (
                    {
                        method: 'DELETE',
                        url: '/controllers/paid/gameUser.php',
                        params: {
                            eventId: EventSelectionFactory.getSelectedEvent(),
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
    .factory('Themes', [
        '$q',
        '$http',
        'EventSelectionFactory',
        function(
            $q,
            $http,
            EventSelectionFactory
        ) {
            var themeList = undefined;

            function filterByTheme(themeName) {
                var singleTheme  = undefined;
                _.each(themeList, function(theme, index) {
                    if (theme.theme === themeName) {
                        singleTheme = theme;
                    }
                });
                return singleTheme;
            }

            return {
                getThemeObject: function(themeName) {
                    if (themeList) {
                        return $q.when(filterByTheme(themeName));
                    } else {
                        return $q.when(this.getList().then(function(data) {
                            return filterByTheme(themeName);
                        }));
                    }
                },

                getCount: function() {
                    if (themeList) {
                        return $q.when(themeList.length);
                    } else {
                        return $q.when(this.getList().then(function(data) {
                            return themeList.length;
                        }));
                    }
                },

                getList: function() {
                    if (themeList) {
                        return $q.when(themeList);
                    } else {
                        return $q.when($http (
                            {
                                method: 'GET',
                                url: '/controllers/paid/themes.php',
                                params: {
                                    eventId: EventSelectionFactory.getSelectedEvent()
                                }
                            }
                        ).then(function(data) {
                            themeList = data.data;
                            return themeList;
                        }));
                    }
                }
            }
        }
    ])
    .factory('EventDetails', [
        '$q',
        '$http',
        'EventSelectionFactory',
        function(
            $q,
            $http,
            EventSelectionFactory
        ) {
        function parseEventDetailsData(data) {
            data.formattedDiscountDate = moment(data.discountDate).format('MMMM Do, YYYY');
            data.costs = {
                'eventCost': undefined,
                'eventDiscount': undefined,
                'tShirtCost': undefined,
                'tShirtDiscount': undefined,
                'meetAndGreetCost': undefined,
                'meetAndGreetDiscount': undefined
            };
            _.each(data.lineItems, function(lineItem, key) {
                if (key === '10000') {
                    data.costs.eventCost = lineItem.cost;
                    data.costs.eventDiscount = lineItem.discount;
                } else if (key === '10001') {
                    data.costs.tShirtCost = lineItem.cost;
                    data.costs.tShirtDiscount = lineItem.discount;
                } else if (key === '10002') {
                    data.costs.meetAndGreetCost = lineItem.cost;
                    data.costs.meetAndGreetDiscount = lineItem.discount;
                } else if (key === '10003') {
                    data.costs.completeNameBadgeCost = lineItem.cost;
                    data.costs.completeNameBadgeDiscount = lineItem.discount;
                } else if (key === '10007') {
                    data.costs.draftOneCost = lineItem.cost;
                    data.costs.draftOneDiscount = lineItem.discount;
                    data.costs.draftOneDescription = lineItem.lineItem;
                    data.draftOneId = lineItem.gameId;
                } else if (key === '10008') {
                    data.costs.draftTwoCost = lineItem.cost;
                    data.costs.draftTwoDiscount = lineItem.discount;
                    data.costs.draftTwoDescription = lineItem.lineItem;
                    data.draftTwoId = lineItem.gameId;
                }
            });

            return data;
        }
        return {
            get: function() {
                var delay= $q.defer();
                $http (
                    {
                        method: 'GET',
                        url: '/controllers/public/event.php',
                        params: {
                            eventId: EventSelectionFactory.getSelectedEvent()
                        }
                    }
                ).success(function(data, status, headers, config) {
                    delay.resolve(parseEventDetailsData(data));
                }).error(function(data, status, headers, config) {
                    delay.reject(data);
                });

                return delay.promise;
            }
        }
    }])
    .factory('EmailUs', ['$q', '$http', function($q, $http) {
        return {
            create: function(emailDTO) {
                var delay= $q.defer();
                $http (
                    {
                        method: 'POST',
                        url: '/controllers/public/emailUs.php',
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
    .factory('RegistrationLineItems', [
        '$q',
        '$http',
        'EventSelectionFactory',
        function(
            $q,
            $http,
            EventSelectionFactory
        ) {
            return {
                get: function() {
                    var delay= $q.defer();
                    $http (
                        {
                            method: 'GET',
                            url: '/controllers/registered/registrationLineItems.php',
                            params: {
                                eventId: EventSelectionFactory.getSelectedEvent()
                            }
                        }
                    ).success(function(data, status, headers, config) {
                        _.each(data[EventSelectionFactory.getSelectedEvent()].lineItems, function(lineItem) {
                            if (
                                lineItem.lineItemCode === '10000' ||
                                lineItem.lineItemCode === '10010' ||
                                lineItem.lineItemCode === '10012' ||
                                lineItem.lineItemCode === '10006'
                            ) {
                                lineItem.lineItem = lineItem.lineItem + ' - ' + lineItem.description;
                            }
                        });
                        delay.resolve(data);
                    }).error(function(data, status, headers, config) {
                        delay.reject(data);
                    });

                    return delay.promise;
                },

                revokePayment: function(dto) {
                    var delay= $q.defer();
                    $http (
                        {
                            method: 'PATCH',
                            url: '/controllers/admin/payment.php',
                            data: {
                                registrationLineItemId: dto.registrationLineItemId,
                                registrationId: dto.registrationId,
                                userId: dto.userId,
                                revoke: 'yes',
                                eventId: EventSelectionFactory.getSelectedEvent()
                            }
                        }
                    ).success(function(data, status, headers, config) {
                        delay.resolve(data);
                    }).error(function(data, status, headers, config) {
                        delay.reject(data);
                    });

                    return delay.promise;
                },

                confirmPayment: function(dto) {
                    var delay= $q.defer();
                    $http (
                        {
                            method: 'PATCH',
                            url: '/controllers/admin/payment.php',
                            data: {
                                registrationLineItemId: dto.registrationLineItemId,
                                registrationId: dto.registrationId,
                                userId: dto.userId,
                                revoke: 'no',
                                eventId: EventSelectionFactory.getSelectedEvent()
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
        }
    ])
    .factory('VendorDetails', [
        '$q',
        '$http',
        '$sce',
        'EventSelectionFactory',
        function(
            $q,
            $http,
            $sce,
            EventSelectionFactory
        ) {
            var vendorList = undefined;

            function hasLogo(vendor) {
                if (
                    vendor.logo === '' ||
                    vendor.url === undefined ||
                    vendor.logo === 'https://<your_logo_url>'
                ) {
                    return false;
                } else {
                    return true;
                }
            }

            function hasUrl(vendor) {
                if (
                    vendor.url === '' ||
                    vendor.url === undefined ||
                    vendor.url === 'https://<your_store_url>'
                ) {
                    return false;
                } else {
                    return true;
                }
            }

            function parseVendorDetails(vendor) {
                vendor.description = $sce.trustAsHtml(vendor.description);
                vendor.hasLogo = hasLogo(vendor);
                vendor.hasUrl = hasUrl(vendor);

                return vendor;
            }

            function parseAssociateDetails(associate) {
                associate.fullName = associate.firstName + ' ' + associate.lastName;
            }

            return {
                getCount: function() {
                    if (vendorList) {
                        return $q.when(vendorList.length);
                    } else {
                        return $q.when(this.getList().then(function(data) {
                            return vendorList.length;
                        }));
                    }
                },

                getList: function() {
                    if (vendorList) {
                        return $q.when(vendorList);
                    }   else {
                        return $q.when($http (
                            {
                                method: 'GET',
                                url: '/controllers/registered/vendors/vendors.php',
                                params: {
                                    eventId: EventSelectionFactory.getSelectedEvent() 
                                }
                            }
                        ).then(function(data) {
                            vendorList = data.data;
                            _.each(vendorList, function(vendor, index) {
                                parseVendorDetails(vendor);
                            })
                            return vendorList;
                        }));
                    }
                },

                updateStore: function(vendorDTO) {
                    var delay= $q.defer();
                    $http (
                        {
                            method: 'PATCH',
                            url: '/controllers/registered/vendors/vendorRegistration.php',
                            data: vendorDTO,
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        }
                    ).success(function(data, status, headers, config) {
                        delay.resolve(status);
                    }).error(function(data, status, headers, config) {
                        delay.reject(status);
                    });

                    return delay.promise;
                },

                createStore: function(vendorDTO) {
                    var delay= $q.defer();
                    $http (
                        {
                            method: 'POST',
                            url: '/controllers/registered/vendors/vendorRegistration.php',
                            data: vendorDTO,
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        }
                    ).success(function(data, status, headers, config) {
                        delay.resolve(data);
                    }).error(function(data, status, headers, config) {
                        delay.reject(status);
                    });

                    return delay.promise;
                },

                createTableOrder: function(tableDTO) {
                    var delay= $q.defer();
                    $http (
                        {
                            method: 'POST',
                            url: '/controllers/registered/vendors/tableRegistration.php',
                            data: tableDTO,
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        }
                    ).success(function(data, status, headers, config) {
                        delay.resolve(data);
                    }).error(function(data, status, headers, config) {
                        delay.reject(status);
                    });

                    return delay.promise;
                },

                updateTableOrder: function(tableDTO) {
                    var delay= $q.defer();
                    $http (
                        {
                            method: 'PATCH',
                            url: '/controllers/registered/vendors/tableRegistration.php',
                            data: tableDTO,
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        }
                    ).success(function(data, status, headers, config) {
                        delay.resolve(status);
                    }).error(function(data, status, headers, config) {
                        delay.reject(status);
                    });

                    return delay.promise;
                },

                getAssociates: function(storeId) {
                    var delay= $q.defer();
                    $http (
                        {
                            method: 'GET',
                            url: '/controllers/registered/vendors/vendorAssociates.php',
                            params: {
                                storeId: storeId,
                                eventId: EventSelectionFactory.getSelectedEvent() 
                            }
                        }
                    ).success(function(data, status, headers, config) {
                        delay.resolve(data);
                    }).error(function(data, status, headers, config) {
                        delay.reject(status);
                    });

                    return delay.promise;
                },

                createAssociate: function(associateDTO) {
                    var delay= $q.defer();
                    $http (
                        {
                            method: 'POST',
                            url: '/controllers/registered/vendors/vendorAssociates.php',
                            data: associateDTO,
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        }
                    ).success(function(data, status, headers, config) {
                        delay.resolve(data);
                    }).error(function(data, status, headers, config) {
                        delay.reject(data);
                    });

                    return delay.promise;
                },

                deleteAssociate: function(associateDTO) {
                    associateDTO.eventId = EventSelectionFactory.getSelectedEvent();
                    var delay= $q.defer();
                    $http (
                        {
                            method: 'DELETE',
                            url: '/controllers/registered/vendors/vendorAssociates.php',
                            params: associateDTO,
                        }
                    ).success(function(data, status, headers, config) {
                        delay.resolve(status);
                    }).error(function(data, status, headers, config) {
                        delay.reject(status);
                    });

                    return delay.promise;
                },

                getEventMeVendorInformation: function() {
                    var delay= $q.defer();
                    $http (
                        {
                            method: 'GET',
                            url: '/controllers/registered/vendors/vendorMeInformation.php',
                            params: {
                                eventId: EventSelectionFactory.getSelectedEvent() 
                            },
                        }
                    ).success(function(data, status, headers, config) {
                        data.hasAssociates = (data.associates.length ? true : false);
                        data.hasTables = (Object.keys(data.tables).length ? true : false);
                        _.each(data.associates, function(associate) {
                            parseAssociateDetails(associate);
                        });
                        delay.resolve(data);
                    }).error(function(data, status, headers, config) {
                        delay.reject(status);
                    });

                    return delay.promise;
                },

                getTableById: function(tableId) {
                    var delay= $q.defer();
                    $http (
                        {
                            method: 'GET',
                            url: '/controllers/registered/vendors/tableRegistration.php',
                            params: {
                                tableId: tableId
                            }
                        }
                    ).success(function(data, status, headers, config) {
                        delay.resolve(data);
                    }).error(function(data, status, headers, config) {
                        delay.reject(status);
                    });

                    return delay.promise;
                },

                getStore: function(storeId) {
                    var delay= $q.defer();
                    $http (
                        {
                            method: 'GET',
                            url: '/controllers/registered/vendors/vendorRegistration.php',
                            params: {
                                storeId: storeId
                            }
                        }
                    ).success(function(data, status, headers, config) {
                        delay.resolve(parseVendorDetails(data));
                    }).error(function(data, status, headers, config) {
                        delay.reject(status);
                    });

                    return delay.promise;
                },
            }
        }
    ])
    .factory('UserDetails', ['$q', '$http', '$window', function($q, $http, $window) {
        var userList = undefined;
        var userDetails = undefined;

        function memberSince(data) {
            data.memberSince = moment(data.joined).format('MMMM Do, YYYY');
            return data;
        }

        function determineHideTour(user) {
            return (user.showTour === 'YES' ? false : true);
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

            hideTour: function() {
                if (userDetails) {
                    return $q.when(determineHideTour(userDetails));
                } else {
                    return $q.when(this.getUser().then(function(user) {
                        return determineHideTour(user);
                    }));
                }
            },

            getUser: function() {
                if (userDetails) {
                    return $q.when(userDetails);
                }   else {
                    return $q.when($http (
                        {
                            method: 'GET',
                            url: '/controllers/public/user.php'
                        }
                    ).then(function(data) {
                        userDetails = memberSince(data.data);
                        return userDetails;
                    }));
                }
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
                        url: '/controllers/public/user.php',
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

            tourStarted: function() {
                if (userDetails.tourStarted) {
                    return false;
                } else {
                    userDetails.tourStarted = true;
                    return true;
                }
            },

            updateTour: function(tourOption) {
                var delay= $q.defer();
                $http (
                    {
                        method: 'PATCH',
                        url: '/controllers/registered/tour.php',
                        data: {
                            'tourOption': tourOption
                        },
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }
                ).success(function(data, status, headers, config) {
                    userDetails.showTour = 'NO';
                    delay.resolve(status);
                }).error(function(data, status, headers, config) {
                    delay.reject(status);
                });

                return delay.promise;
            },

            update: function(userDTO) {
                var delay= $q.defer();
                $http (
                    {
                        method: 'PATCH',
                        url: '/controllers/public/user.php',
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
    .factory('RegisteredAfols', [
        '$q',
        '$http',
        'EventSelectionFactory',
        function(
            $q,
            $http,
            EventSelectionFactory
        ) {
            var afolList = undefined;

            //This is for the one time there is an event with no registered AFOLs
            function getAfolCount() {
                if (Object.keys(afolList).length) {
                    return afolList[EventSelectionFactory.getSelectedEvent()].registeredAfols.length;
                } else {
                    return 0;
                }
            }

            return {
                getCount: function() {
                    if (afolList) {
                        return $q.when(getAfolCount());
                    } else {
                        return $q.when(this.get().then(function() {
                            return getAfolCount();
                        }));
                    }
                },

                get: function() {
                    if (afolList) {
                        return $q.when(afolList);
                    }   else {
                        return $q.when($http (
                            {
                                method: 'GET',
                                url: '/controllers/registered/registeredAfols.php',
                                params: {
                                    eventId: EventSelectionFactory.getSelectedEvent() 
                                }
                            }
                        ).then(function(data) {
                            afolList = data.data;
                            return afolList;
                        }));
                    }
                },

                sendPaymentEmail: function(userId) {
                    var delay= $q.defer();
                    $http (
                        {
                            method: 'GET',
                            url: '/controllers/admin/sendEmail.php',
                            params: {
                                userId: userId,
                                eventId: EventSelectionFactory.getSelectedEvent(),
                                type: 'registrationPaid'
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
        }
    ])
    .factory('EventRegistration', ['$q', '$http', function($q, $http) {
        function parseEventRegistrationData(data) {
            data = _.each(data, function(eventObj, key) {
                eventObj.total = eventObj.lineItems.total;
                eventObj.tShirtSize = 'No Thanks';
                eventObj.type = (eventObj.ageVerification == 'YES' ? 'AFOL' : 'TFOL');
                eventObj.meetAndGreet = 'NO';
                eventObj.draftOne = 'NO';
                eventObj.draftTwo = 'NO';
                eventObj.paidCTA = (eventObj.paid === 'YES');
                eventObj.nameBadge = 'NO';
                eventObj.showBadgeLine1 = false;
                eventObj.badgeLine1 = undefined;
                eventObj.showBadgeLine2 = false;
                eventObj.badgeLine2 = undefined;
                eventObj.showBadgeLine3 = false;
                eventObj.badgeLine3 = undefined;
                _.each(eventObj.lineItems.lineItems, function(lineItemObj) {
                    if (
                        lineItemObj.active === 'YES' &&
                        lineItemObj.isOwner === 'YES'
                    ) {
                        if (lineItemObj.lineItemCode === '10001') {
                            eventObj.tShirtSize = lineItemObj.size;
                        } else if (lineItemObj.lineItemCode === '10002') {
                            eventObj.meetAndGreet = 'YES'
                        } else if (lineItemObj.lineItemCode === '10007') {
                            eventObj.draftOne = 'YES'
                        } else if (lineItemObj.lineItemCode === '10008') {
                            eventObj.draftTwo = 'YES'
                        } else if (lineItemObj.lineItemCode === '10006') {
                            eventObj.badgeLine1 = lineItemObj.description;
                            eventObj.showBadgeLine1 = true;
                        } else if (lineItemObj.lineItemCode === '10003') {
                            eventObj.nameBadge = 'YES';
                        } else if (lineItemObj.lineItemCode === '10004') {
                            eventObj.badgeLine2 = lineItemObj.description;
                            eventObj.showBadgeLine2 = true;
                        } else if (lineItemObj.lineItemCode === '10005') {
                            eventObj.badgeLine3 = lineItemObj.description;
                            eventObj.showBadgeLine3 = true;
                        }
                    }
                });
                return eventObj;
            });

            return data;
        }
        return {
            get: function() {
                var delay= $q.defer();
                $http (
                    {
                        method: 'GET',
                        url: '/controllers/registered/eventRegistration.php'
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
                        url: '/controllers/registered/eventRegistration.php',
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
                        url: '/controllers/registered/eventRegistration.php',
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
    .factory('MocDetails', [
        '$q',
        '$http',
        '$window',
        'EventSelectionFactory',
        function(
            $q,
            $http,
            $window,
            EventSelectionFactory
        ) {
            var mocList = undefined;
            var individualMocList = undefined;
            function filterMocsByUsers() {
                individualMocList = [];
                _.each(mocList, function(moc, index) {
                    if (moc.userId == $window.sessionStorage.userId) {
                        individualMocList.push(moc);
                    }
                });
                return individualMocList;
            }

            function filterMocById(mocId) {
                var singleMoc = undefined;
                _.each(individualMocList, function(moc, index) {
                    if (moc.mocId === mocId) {
                        singleMoc = moc;
                    }
                });
                return singleMoc;
            }


            return {
                expireCache: function() {
                    mocList = undefined;
                    individualMocList = undefined;
                    this.getList();
                },

                getCount: function() {
                    if (mocList) {
                        return $q.when(mocList.length);
                    } else {
                        return $q.when(this.getList().then(function(data) {
                            return mocList.length;
                        }));
                    }
                },

                getCountByUser: function() {
                    if (individualMocList) {
                        return $q.when(individualMocList.length);
                    } else {
                        return $q.when(this.getListByUserId().then(function(data) {
                            return individualMocList.length;
                        }));
                    }
                },

                getMocById: function(mocId) {
                    if (individualMocList) {
                        return $q.when(filterMocById(mocId));
                    } else {
                        return $q.when(this.getListByUserId().then(function(data) {
                            return filterMocById(mocId);
                        }));
                    }
                },

                getListByUserId: function() {
                    if (individualMocList) {
                        return $q.when(individualMocList);
                    } else {
                        return $q.when(this.getList().then(function(data) {
                            return filterMocsByUsers();
                        }));
                    }
                },

                getList: function() {
                    if (mocList) {
                        return $q.when(mocList);
                    } else {
                        return $q.when($http (
                            {
                                method: 'GET',
                                url: '/controllers/paid/mocs.php',
                                params: {
                                    eventId: EventSelectionFactory.getSelectedEvent()
                                }
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
                            url: '/controllers/paid/mocs.php',
                            data: mocDTO
                        }
                    ).success(function(data, status, headers, config) {
                        delay.resolve(status);
                    }).error(function(data, status, headers, config) {
                        delay.reject(status);
                    });

                    return delay.promise;
                },

                update: function(mocDTO) {
                    var delay= $q.defer();
                    $http (
                        {
                            method: 'PATCH',
                            url: '/controllers/paid/mocs.php',
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
        }
    ])
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
    .factory('GetEmailHtml', [
        '$q',
        '$http',
        'EventSelectionFactory',
        function(
            $q,
            $http,
            EventSelectionFactory
        ) {
            return {
                getEventRegistration: function() {
                    var delay= $q.defer();
                    $http (
                        {
                            method: 'GET',
                            url: '/controllers/admin/sendEmail.php',
                            params: {
                                type: 'eventRegistrationMessage',
                                userId: 'not_needed',
                                eventId: EventSelectionFactory.getSelectedEvent()
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
        }
    ])
    .factory('authInterceptor', ['$rootScope', '$q', '$window', '$location', function($rootScope, $q, $window, $location) {
        return {
            request: function(config) {
                config.headers = config.headers || {};
                if ($window.sessionStorage.token) {
                    config.headers['Auth-Token'] = $window.sessionStorage.token;
                }

                if (! $location.host().match(/mybrickslopes.com/)) {
                    //https://developers.google.com/analytics/devguides/collection/gajs/
                    //This should only run on the live server
                    if ( ! (
                        config.url.match(/^\/controllers/) ||
                        config.url.match(/footer.html$/) ||
                        config.url.match(/header.html$/) ||
                        config.url.match(/feedback.html$/) ||
                        config.url.match(/directives/)
                    )) {
                        if (typeof $window._gaq !== 'undefined') {
                            $window._gaq.push(['_trackPageview', config.url]);
                        }
                    }
                }

                return config;
            },
            responseError: function(rejection) {
                if (rejection.status === 401 || rejection.status === 403) {
                    $window.sessionStorage.redirectUrl=rejection.config.url;
                    $location.path('/registered/login.html');
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
})(angular);
