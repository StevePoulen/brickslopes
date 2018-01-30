(function(angular) {
    'use strict';

    angular.module('brickSlopes').run([
        '$injector',
        function(
            $injector
        ) {
            var eventSelectionFactory = $injector.get('EventSelectionFactory');
            spyOn(eventSelectionFactory, 'getSelectedEvent').and.returnValue(2);
        }
    ]);
})(angular);
