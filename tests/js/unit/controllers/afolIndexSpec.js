'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function() {
    var scope, ctrl, location;

    beforeEach (
        module (
            'brickSlopes.controllers',
            'brickSlopes.services'
        )
    );

    beforeEach(function() {
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    describe('afolIndex Controller', function() {
        beforeEach(inject(function($controller, $rootScope, $location) {
            scope = $rootScope.$new();
            ctrl = $controller('afolIndex', { $scope: scope});
            location = $location;
        }));


        describe('Default Variables', function() {
            it('should have a mocCount variable', function() {
                expect(scope.mocCount).toBe(0);
            });

            it('should have an afolCount variable', function() {
                expect(scope.afolCount).toBe(0);
            });

            it('should have a vendorCount variable', function() {
                expect(scope.vendorCount).toBe(0);
            });

            it('should have a mocList variable', function() {
                expect(scope.mocList).toEqualData([]);
            });

            it('should have a userName variable', function() {
                expect(scope.userName).toEqualData("undefined's Site");
            });

            it('should have a isRegistered variable', function() {
                expect(scope.isRegistered).toBe(false);
            });

            it('should have an eventId variable', function() {
                expect(scope.eventId).toBe(2);
            });
        });

        describe('Actions', function() {
            it('should redirect to eventRegistration', function() {
                scope.isRegistered = false;
                scope.clickRegistration();
                expect(location.path()).toBe('/afol/2/eventRegistration.html');
            });

            it('should redirect to eventMe if already registered', function() {
                scope.isRegistered = true;
                scope.clickRegistration();
                expect(location.path()).toBe('/afol/eventMe.html');
            });

            it('should redirect to eventMe', function() {
                scope.clickMe();
                expect(location.path()).toBe('/afol/eventMe.html');
            });

            it('should redirect to eventAfols', function() {
                scope.clickAfols();
                expect(location.path()).toBe('/afol/eventAfols.html');
            });

            it('should redirect to eventThemes', function() {
                scope.clickThemes();
                expect(location.path()).toBe('/afol/eventThemes.html');
            });

            it('should redirect to eventGames', function() {
                scope.clickGames();
                //expect(location.path()).toBe('/afol/eventGames.html');
                expect(location.path()).toBe('/afol/comingSoon.html');
            });

            it('should redirect to eventVenue', function() {
                scope.clickVenue();
                expect(location.path()).toBe('/afol/eventVenue.html');
            });

            it('should redirect to eventHotel', function() {
                scope.clickHotel();
                expect(location.path()).toBe('/afol/eventHotel.html');
            });

            it('should redirect to the index on close', function() {
                scope.closeDialog();
                expect(location.path()).toBe('/afol/index.html');
            });
        });
    });

    describe('afolIndex Controller', function() {
        var mockBackend, loader;
        beforeEach(inject(function($controller, $rootScope, $location, _$httpBackend_, GetAfolMocList) {
            scope = $rootScope.$new();
            ctrl = $controller('afolIndex', { $scope: scope});
            location = $location;
            mockBackend = _$httpBackend_;
            loader = GetAfolMocList;

            var returnList = {'afolMocCount': 22, 'mocs': {'firstName': 'Steve'}};
            mockBackend.expectGET('/controllers/eventDates.php').respond(201, eventDates);
            mockBackend.expectGET('/controllers/eventRegistration.php').respond(201, eventRegistration);
            mockBackend.expectGET('/controllers/mocs/getRegisteredMocList.php').respond(returnList);
            mockBackend.expectGET('/controllers/registeredAfols.php?eventId=2').respond(201, registeredAfols);

            mockBackend.flush();
        }));

        it('should set the mocCount variable', function() {
            expect(scope.mocCount).toBe(22);
        });

        it('should set the mocListvariable', function() {
            expect(scope.mocList).toEqual({'firstName': 'Steve'});
        });

        it('should set the mocListvariable', function() {
            expect(scope.isRegistered).toEqual(true);
        });

        it('should set the eventYear', function() {
            expect(scope.eventYear).toEqual('2015');
        });

        it('should set the eventMonthYear', function() {
            expect(scope.eventMonthYear).toEqual('May, 2015');
        });

        it('should set the afolCount variable', function() {
            expect(scope.afolCount).toBe(2);
        });
    });
});
