(function(angular) {
    'use strict';
    angular.module('brickSlopes').factory('EventDates', [
        '$q',
        '$http',
        'EventSelectionFactory',
        function(
            $q,
            $http,
            EventSelectionFactory
        ) {
            var __eventDates = queryEventDates();
            var __eventDatesCached = {};

            function getCurrentEvent(allEvents) {
                return allEvents[EventSelectionFactory.getSelectedEvent()];
            }

            function queryEventDates() {
                var deferred= $q.defer();
                $http ({
                    method: 'GET',
                    url: '/controllers/public/eventDates.php'
                }).success(function(data, status, headers, config) {
                    __eventDates = data;
                    deferred.resolve(data);
                });

                return deferred.promise;
            }

            return {
                setCache: function(key, value) {
                    var eventId = EventSelectionFactory.getSelectedEvent();
                    if (! __eventDatesCached[eventId]) {
                        __eventDatesCached[eventId] = {};
                    }
                    __eventDatesCached[eventId][key] = value;

                    return value;
                },

                getCache: function(key) {
                    try {
                        return __eventDatesCached[EventSelectionFactory.getSelectedEvent()][key];
                    } catch (error) {
                        return false;
                    }
                },

                getAllEvents: function() {
                    return $q.when(__eventDates);
                },

                __getAfolTimestamps: function() {
                    var afolTimestamps = this.getCache('afolTimestamps');
                    if (afolTimestamps) {
                        return $q.when(afolTimestamps);
                    } else {
                        var afolStartTimestamps = [];
                        var afolEndTimestamps = [];
                        var self = this;

                        return this.getAllEvents().then(function(allEvents) {
                            _.each(getCurrentEvent(allEvents), function(eventObj) {
                                if (eventObj.type === "AFOL") {
                                    afolStartTimestamps.push(moment(eventObj.startDate));
                                    afolEndTimestamps.push(moment(eventObj.endDate));
                                }
                            });

                            return self.setCache (
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

                __getPublicTimestamps: function() {
                    var publicTimestamps = this.getCache('publicTimestamps');
                    if (publicTimestamps) {
                        return $q.when(publicTimestamps);
                    } else {
                        var publicStartTimestamps = [];
                        var publicEndTimestamps = [];
                        var self = this;

                        return this.getAllEvents().then(function(allEvents) {
                            _.each(getCurrentEvent(allEvents), function(eventObj) {
                                if (eventObj.type === "PUBLIC") {
                                    publicStartTimestamps.push(moment(eventObj.startDate));
                                    publicEndTimestamps.push(moment(eventObj.endDate));
                                }
                            });

                            return self.setCache (
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

                getPublicDates: function() {
                    var publicDates = this.getCache('publicDates');
                    if (publicDates) {
                        return $q.when(publicDates);
                    } else {
                        var self = this;
                        return this.__getPublicTimestamps().then(function(publicTimestamps) {
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
                                'publicDates',
                                publicDates
                            )
                        });
                    }
                },

                getPublicDatesTogether: function() {
                    var publicDates = this.getCache('publicDatesTogether');
                    if (publicDates) {
                        return $q.when(publicDates);
                    } else {
                        var self = this;
                        return this.__getPublicTimestamps().then(function(publicTimestamps) {
                            var publicDates = moment(publicTimestamps.start[0]).format('MMM D');
                            publicDates += moment(publicTimestamps.end[publicTimestamps.last]).format(' & D, YYYY');

                            return self.setCache (
                                'publicDatesTogether',
                                publicDates
                            )
                        });
                    }
                },

                getEventMonthYear: function() {
                    var self = this;
                    var eventMonthYear = this.getCache('monthYear');
                    if (eventMonthYear) {
                        return $q.when(eventMonthYear);
                    } else {
                        return this.getAllEvents().then(function(allEvents) {
                            return self.setCache (
                                'monthYear',
                                moment(getCurrentEvent(allEvents)[0].startDate).format('MMMM, YYYY')
                            )
                        });
                    }
                },

                getPassDates: function() {
                    var self = this;
                    var passDates = this.getCache('passDates');
                    if (passDates) {
                        return $q.when(passDates);
                    } else {
                        return this.__getAfolTimestamps().then(function(afolTimestamps) {
                            return self.setCache (
                                'passDates',
                                moment(afolTimestamps.start[0]).format('MMMM Do') +
                                ' thru ' +
                                moment(afolTimestamps.end[afolTimestamps.last]).format('Do')
                            )
                        });
                    }
                },

                getMeetAndGreetDinnerDate: function() {
                    var self = this;
                    var meetAndGreetDinnerDate = this.getCache('meetAndGreetDinnerDate');
                    if (meetAndGreetDinnerDate) {
                        return $q.when(meetAndGreetDinnerDate);
                    } else {
                        return this.__getAfolTimestamps().then(function(afolTimestamps) {
                            return self.setCache (
                                'meetAndGreetDinnerDate',
                                moment(afolTimestamps.start[0]).format('dddd, MMMM Do')
                            )
                        });
                    }
                },

                getPassType: function() {
                    var self = this;
                    var passType = this.getCache('passType');
                    if (passType) {
                        return $q.when(passType);
                    } else {
                        return this.__getAfolTimestamps().then(function(afolTimestamps) {
                            return self.setCache (
                                'passType',
                                afolTimestamps.size + '-Day'
                            )
                        });
                    }
                },

                getEventYear: function() {
                    var self = this;
                    var eventYear = this.getCache('year');
                    if (eventYear) {
                        return $q.when(eventYear);
                    } else {
                        return this.getAllEvents().then(function(allEvents) {
                            return self.setCache (
                                'year',
                                moment(getCurrentEvent(allEvents)[0].startDate).format('YYYY')
                            )
                        });
                    }
                }
            }
        }])
})(angular);
