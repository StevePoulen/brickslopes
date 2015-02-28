'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function() {
    var scope, ctrl, location;

    beforeEach (
        module (
            'brickSlopes.controllers'
        )
    );

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
            expect(scope.publicDateList).toEqual([]);
        });

        it('should have a package list variable', function() {
            expect(scope.packageList).toEqual(['Adult On-line ($7.00*)', 'Child On-line ($1.00*)', 'Adult Ticket and Fig ($12.00*)', 'Child Ticket and Fig ($6.00*)', 'Adult Ticket and Shirt ($22.00*)', 'Child Ticket and Shirt ($16.00*)', 'Adult Ticket, Fig and Shirt ($25.00*)', 'Child Ticket, Fig and Shirt ($21.00*)']);
        });
    });

    describe('bsIndex Click Handlers', function() {
        beforeEach(inject(function($controller, $rootScope, $location)  {
            scope = $rootScope.$new();
            location = $location;
            ctrl = $controller('bsIndex', { $scope: scope});
        }));

        it('should redirect to the Chowren Toys page', function() {
            spyOn(window, "open");
            scope.chowrenToys();
            expect(window.open).toHaveBeenCalledWith('http://www.chowrentoys.com/', '_blank');
        });

        it('should redirect to the Modern Brick Warfare page', function() {
            spyOn(window, "open");
            scope.modernBrickWarfare();
            expect(window.open).toHaveBeenCalledWith('http://modernbrickwarfare.com/', '_blank');
        });

        it('should redirect to the tickets page', function() {
            scope.tickets();
            expect(location.path()).toBe('/tickets.html');
        });

        it('should redirect to the Friday tickets page', function() {
            spyOn(window, "open");
            scope.purchaseFridayTickets();
            expect(window.open).toHaveBeenCalledWith('https://www.eventbrite.com/e/brickslopes-slc-2015-tickets-15387662914', '_blank');
        });

        it('should redirect to the Saturday tickets page', function() {
            spyOn(window, "open");
            scope.purchaseSaturdayTickets();
            expect(window.open).toHaveBeenCalledWith('https://www.eventbrite.com/e/brickslopes-slc-2015-saturday-tickets-15610137341', '_blank');
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

            mockBackend.expectGET('/controllers/public/eventDates.php').respond(201, eventDates);
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
