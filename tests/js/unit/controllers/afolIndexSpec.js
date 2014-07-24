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
            it('should set the gameCount variable', function() {
                expect(scope.gameCount).toBe(0);
            });

            it('should have a mocCount variable', function() {
                expect(scope.mocCount).toBe(0);
            });

            it('should have a themeCount variable', function() {
                expect(scope.themeCount).toBe(0);
            });

            it('should have an afolCount variable', function() {
                expect(scope.afolCount).toBe(0);
            });

            it('should have a vendorCount variable', function() {
                expect(scope.vendorCount).toBe(0);
            });

            it('should have a userName variable', function() {
                expect(scope.userName).toEqualData("Cody's Site");
            });

            it('should have a isRegistered variable', function() {
                expect(scope.isRegistered).toBe(false);
            });

            it('should have an eventId variable', function() {
                expect(scope.eventId).toBe(2);
            });
        });

        describe('Actions', function() {
            var window;
            beforeEach(inject(function(_$window_) {
                window = _$window_;
            }));

            afterEach(function() {
                deleteSession(window);
            });

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

            it('should redirect to eventMocRegistration Registered', function() {
                window.sessionStorage.registered = 'YES';
                scope.clickMocRegistration();
                expect(location.path()).toBe('/registered/2/eventMocRegistration.html');
            });

            it('should redirect to eventMocRegistration Not Registered', function() {
                scope.clickMocRegistration();
                expect(location.path()).toBe('');
            });

            it('should redirect to eventMocList Registered', function() {
                window.sessionStorage.registered = 'YES';
                scope.clickMocList();
                expect(location.path()).toBe('/registered/eventMocList.html');
            });

            it('should redirect to eventMocList Not Registered', function() {
                scope.clickMocList();
                expect(location.path()).toBe('');
            });

            it('should redirect to eventAfols', function() {
                scope.clickAfols();
                expect(location.path()).toBe('/afol/eventAfols.html');
            });

            it('should redirect to eventThemes Registered', function() {
                window.sessionStorage.registered = 'YES';
                scope.clickThemes();
                expect(location.path()).toBe('/registered/eventThemes.html');
            });

            it('should redirect to eventThemes Not Registered', function() {
                scope.clickThemes();
                expect(location.path()).toBe('');
            });

            it('should redirect to eventGames Registered', function() {
                window.sessionStorage.registered = 'YES';
                scope.clickGames();
                expect(location.path()).toBe('/registered/eventGames.html');
            });

            it('should redirect to eventGames Not Registered', function() {
                scope.clickGames();
                expect(location.path()).toBe('');
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
        var mockBackend, service;
        beforeEach(inject(function($controller, $rootScope, $location, _$httpBackend_, MocDetails) {
            scope = $rootScope.$new();
            ctrl = $controller('afolIndex', { $scope: scope});
            location = $location;
            mockBackend = _$httpBackend_;
            service = MocDetails;

            mockBackend.expectGET('/controllers/public/eventDates.php').respond(201, eventDates);
            mockBackend.expectGET('/controllers/eventRegistration.php').respond(201, eventRegistration);
            mockBackend.expectGET('/controllers/registered/mocs.php?eventId=2').respond(mocs);
            mockBackend.expectGET('/controllers/registered/themes.php?eventId=2').respond(themes);
            mockBackend.expectGET('/controllers/registered/games.php?eventId=2').respond(games);
            mockBackend.expectGET('/controllers/registeredAfols.php?eventId=2').respond(201, registeredAfols);

            mockBackend.flush();
        }));

        it('should set the gameCount variable', function() {
            expect(scope.gameCount).toBe(4);
        });

        it('should have a themeCount variable', function() {
            expect(scope.themeCount).toBe(3);
        });

        it('should set the mocCount variable', function() {
            expect(scope.mocCount).toBe(3);
        });

        it('should set the isRegistered variable', function() {
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
