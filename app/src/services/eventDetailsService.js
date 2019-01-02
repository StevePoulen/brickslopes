(function(angular) {
    'use strict';
    angular.module('brickSlopes')
    .factory('EventDetailsService', [
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

        function parseEventDetailsDataV2(data) {
            data.formattedDiscountDate = moment(data.discountDate).format('MMMM Do, YYYY');
            data.isDiscount = new Date(data.discountDate) > new Date();

            data.costs = {
                'vibPass': undefined,
                'vibMasterPass': undefined,
                'starWarsPass': undefined
            };
            _.each(data.lineItems, function(lineItem, key) {
                if (key === '10014') {
                    data.costs.vibPass = data.isDiscount ? lineItem.discount : lineItem.cost;
                } else if (key === '10015') {
                    data.costs.vibMasterPass = data.isDiscount ? lineItem.discount : lineItem.cost;
                } else if (key === '10013') {
                    data.costs.starWarsPass = data.isDiscount ? lineItem.discount : lineItem.cost;
                } else if (key === '10007') {
                    data.costs.draftOneDescription = lineItem.lineItem;
                    data.draftOneId = lineItem.gameId;
                } else if (key === '10008') {
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
                ).success(function(data) {
                    delay.resolve(parseEventDetailsData(data));
                }).error(function(data) {
                    delay.reject(data);
                });

                return delay.promise;
            },

            getV2: function() {
                var delay= $q.defer();
                $http (
                    {
                        method: 'GET',
                        url: '/controllers/public/event.php',
                        params: {
                            eventId: EventSelectionFactory.getSelectedEvent()
                        }
                    }
                ).success(function(data) {
                    delay.resolve(parseEventDetailsDataV2(data));
                }).error(function(data) {
                    delay.reject(data);
                });

                return delay.promise;
            }
        }
    }]);
})(angular);
