(function(angular) {
    'use strict';
    angular.module('brickSlopes').factory('EventSelectionFactory', [
        'Environment',
        function(
            Environment
        ) {
            return {
                getSelectedEvent: function(){
                    return Environment.currentEvent;
                }
            };
        }
    ]);
})(angular);
