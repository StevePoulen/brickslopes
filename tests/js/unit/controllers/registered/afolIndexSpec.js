describe('controllers', function() {
    'use strict';
    var scope, location, window;

    beforeEach(module('brickSlopes'));

    describe('afolIndex Controller', function() {
        beforeEach(inject(function(_$controller_, _$rootScope_, $location, _$window_) {
            window = _$window_;
            storeSession(window, sessionData);
            scope = _$rootScope_.$new();
            _$controller_('afolIndex', {
                $scope: scope
            });
            location = $location;
        }));

        describe('Default Variables', function() {
            it('should set the gameCount variable', function() {
                expect(scope.gameCount).toBe(0);
            });

            it('should have a mocCount variable', function() {
                expect(scope.mocCount).toBe(0);
            });

            it('should have a mocList variable', function() {
                expect(scope.mocList).toEqual([]);
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
                expect(scope.userName).toEqual("Ember's Site");
            });

            it('should have a isRegistered variable', function() {
                expect(scope.isRegistered).toBe(false);
            });

            it('should have an eventId variable', function() {
                expect(scope.eventId).toBe(2);
            });
        });

        describe('Actions', function() {
            beforeEach(inject(function($window) {
                deleteSession($window);
            }));

            it('should redirect to eventRegistration', function() {
                scope.isRegistered = false;
                scope.clickRegistration();
                expect(location.path()).toBe('/registered/2/eventRegistration.html');
            });

            it('should redirect to eventMe if already registered', function() {
                scope.isRegistered = true;
                scope.clickRegistration();
                expect(location.path()).toBe('/registered/eventMe.html');
            });

            it('should redirect to eventMe', function() {
                scope.clickMe();
                expect(location.path()).toBe('/registered/eventMe.html');
            });

            describe('Click Moc Registration', function() {
                it('should redirect to the moc registration page', function() {
                    window.sessionStorage.registered = 'YES';
                    window.sessionStorage.paid = 'YES';
                    scope.clickMocRegistration();
                    expect(location.path()).toBe('/paid/2/eventMocRegistration.html');
                });

                it('should not redirect to the registration page', function() {
                    window.sessionStorage.registered = 'YES';
                    scope.clickMocRegistration();
                    expect(location.path()).toBe('/registered/eventPayment.html');
                });

                it('should not redirect to the payment page', function() {
                    scope.clickMocRegistration();
                    expect(location.path()).toBe('/registered/2/eventRegistration.html');
                });
            });

            describe('Click Moc List Registration', function() {
                it('should redirect to the moc list page', function() {
                    window.sessionStorage.registered = 'YES';
                    window.sessionStorage.paid = 'YES';
                    scope.clickMocList();
                    expect(location.path()).toBe('/paid/eventMocList.html');
                });

                it('should not redirect to the registration page', function() {
                    window.sessionStorage.registered = 'YES';
                    scope.clickMocList();
                    expect(location.path()).toBe('/registered/eventPayment.html');
                });

                it('should not redirect to the payment page', function() {
                    scope.clickMocList();
                    expect(location.path()).toBe('/registered/2/eventRegistration.html');
                });
            });

            it('should redirect to eventAfols', function() {
                scope.clickAfols();
                expect(location.path()).toBe('/registered/eventAfols.html');
            });

            describe('Click Theme Registration', function() {
                it('should redirect to the game registration page', function() {
                    window.sessionStorage.registered = 'YES';
                    window.sessionStorage.paid = 'YES';
                    scope.clickThemes();
                    expect(location.path()).toBe('/paid/eventThemes.html');
                });

                it('should not redirect to the registration page', function() {
                    window.sessionStorage.registered = 'YES';
                    scope.clickThemes();
                    expect(location.path()).toBe('/registered/eventPayment.html');
                });

                it('should not redirect to the payment page', function() {
                    scope.clickThemes();
                    expect(location.path()).toBe('/registered/2/eventRegistration.html');
                });
            });

            describe('Click Games Registration', function() {
                it('should redirect to the game registration page', function() {
                    window.sessionStorage.registered = 'YES';
                    window.sessionStorage.paid = 'YES';
                    scope.clickGames();
                    expect(location.path()).toBe('/paid/eventGames.html');
                });

                it('should not redirect to the registration page', function() {
                    window.sessionStorage.registered = 'YES';
                    scope.clickGames();
                    expect(location.path()).toBe('/registered/eventPayment.html');
                });

                it('should not redirect to the payment page', function() {
                    scope.clickGames();
                    expect(location.path()).toBe('/registered/2/eventRegistration.html');
                });
            });

            it('should redirect to eventVenue', function() {
                scope.clickVenue();
                expect(location.path()).toBe('/registered/eventVenue.html');
            });

            it('should redirect to eventKeynote', function() {
                scope.clickKeynote();
                expect(location.path()).toBe('/registered/eventKeynote.html');
            });

            it('should redirect to eventSchedule', function() {
                scope.clickSchedule();
                expect(location.path()).toBe('/registered/eventSchedule.html');
            });

            it('should redirect to eventVendors', function() {
                scope.clickVendors();
                expect(location.path()).toBe('/registered/2/eventVendors.html');
            });

            it('should redirect to eventFAQ', function() {
                scope.clickFAQ();
                expect(location.path()).toBe('/registered/eventFAQ.html');
            });

            it('should redirect to eventHotel', function() {
                scope.clickHotel();
                expect(location.path()).toBe('/registered/eventHotel.html');
            });

            it('should redirect to the index on close', function() {
                scope.closeDialog();
                expect(location.path()).toBe('/registered/index.html');
            });
        });
    });

    describe('afolIndex Controller', function() {
        var mockBackend, service, rootScope, userDetails;
        beforeEach(inject(function(_$controller_, _$rootScope_, $location, _$httpBackend_, MocDetails, _UserDetails_) {
            rootScope = _$rootScope_;
            userDetails = _UserDetails_;
            scope = rootScope.$new();
            spyOn(_$rootScope_, "$emit");
            _$controller_('afolIndex', {
                $scope: scope,
                rootScope: _$rootScope_,
                UserDetails: userDetails
            });
            location = $location;
            mockBackend = _$httpBackend_;
            service = MocDetails;

            mockBackend.expectGET('/controllers/public/eventDates.php').respond(201, eventDates);
            mockBackend.expectGET('/controllers/registered/eventRegistration.php').respond(201, eventRegistration);
            mockBackend.expectGET('/controllers/public/user.php').respond(singleUser);
            mockBackend.expectGET('/controllers/paid/mocs.php?eventId=2').respond(mocs);
            mockBackend.expectGET('/controllers/registered/vendors/vendors.php?eventId=2').respond(201, vendors);

            mockBackend.expectGET('/controllers/paid/themes.php?eventId=2').respond(themes);
            mockBackend.expectGET('/controllers/paid/games.php?eventId=2').respond(games);
            mockBackend.expectGET('/controllers/registered/registeredAfols.php?eventId=2').respond(201, registeredAfols);

            mockBackend.flush();
        }));

        it('should set the gameCount variable', function() {
            expect(scope.gameCount).toBe(4);
        });

        it('should have a themeCount variable', function() {
            expect(scope.themeCount).toBe(5);
        });

        it('should set the mocCount variable', function() {
            expect(scope.mocCount).toBe(3);
        });

        it('should set the vendorCount variable', function() {
            expect(scope.vendorCount).toBe(5);
        });

        it('should set the mocList variable', function() {
            expect(scope.mocList).toEqual(mocs);
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

        it('should set the UserDetails.tourStarted to false', function() {
            expect(userDetails.tourStarted()).toBe(false);
        });

        it('should send a show-tour event', function() {
            expect(rootScope.$emit).toHaveBeenCalledWith('show-tour');
            rootScope.$emit = function() {};
            spyOn(rootScope, "$emit");
            scope.$digest();
            expect(rootScope.$emit).not.toHaveBeenCalled();
        });
    });
});
