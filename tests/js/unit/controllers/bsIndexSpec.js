'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function() {
    var scope, ctrl, location;

    beforeEach (
        module (
            'brickSlopes.controllers'
        )
    );

    beforeEach(function() {
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    describe('bsIndex Default Variables', function() {
        beforeEach(inject(function($controller, $rootScope) {
            scope = $rootScope.$new();
            ctrl = $controller('bsIndex', { $scope: scope});
        }));

        it('should have a eventYear variable', function() {
            expect(scope.eventYear).toBe('2014');
        });

        it('should have a publicEventDates variable', function() {
            expect(scope.publicEventDates).toBeUndefined();
        });

        it('should have a publicDateList variable', function() {
            expect(scope.publicDateList).toEqualData([]);
        });
    });

    describe('bsIndex Click Handlers', function() {
        beforeEach(inject(function($controller, $rootScope, $location)  {
            scope = $rootScope.$new();
            location = $location;
            ctrl = $controller('bsIndex', { $scope: scope});
        }));

        it('should redirect to the tickets page', function() {
            scope.tickets();
            expect(location.path()).toBe('/tickets.html');
        });

        it('should redirect to the packages page', function() {
            scope.packages();
            expect(location.path()).toBe('/packages.html');
        });
    });

    describe('bsIndex Flush', function() {
        var mockBackend;
        beforeEach(inject(function($controller, $rootScope, _$httpBackend_) {
            scope = $rootScope.$new();
            ctrl = $controller('bsIndex', { $scope: scope});
            mockBackend = _$httpBackend_;

            mockBackend.expectGET('/controllers/eventDates.php').respond(201, eventDates);
            mockBackend.flush();
        }));

        it('should set the eventYear variable', function() {
            expect(scope.eventYear).toBe('2015');
        });

        it('should set the publicEventDates variable', function() {
            expect(scope.publicEventDates).toBe('May 15 & 16, 2015');
        });

        it('should set the publicDateList variable', function() {
            expect(scope.publicDateList[0].hours).toBe('9 am to 8 pm');
        });
    });
});
