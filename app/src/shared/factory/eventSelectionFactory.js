(function(angular) {
    'use strict';
    angular.module('BrickSlopesShared').factory('EventSelectionFactory', [ 
        function() {
            var eventSelectionFactory = {};
            var selectedEvent = 3;
            return {
                getSelectedEvent: function(){
                    return selectedEvent;
                }
            };
        }
    ]);
})(angular);
