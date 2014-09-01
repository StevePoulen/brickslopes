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

    describe('afolMe Controller', function() {
        var mockBackend, loader, window, location;
        beforeEach(inject(function($controller, $rootScope, _$httpBackend_, $location, _$window_) {
            window = _$window_;
            scope = $rootScope.$new();
            ctrl = $controller('afolMe', { $scope: scope});
            mockBackend = _$httpBackend_;
            location = $location
        }));

        afterEach(function() {
            deleteSession(window);
        });

        describe('Close Dialog', function() {
            it('should redirect to the index page', function() {
                scope.closeDialog();
                expect(location.path()).toBe('/registered/index.html');
            });
        });

        describe('Click Edit Profile', function() {
            it('should redirect to the profile edit page', function() {
                scope.clickEditProfile();
                expect(location.path()).toBe('/registered/editProfile.html');
            });
        });

        describe('Click Registration', function() {
            it('should redirect to the registration page', function() {
                scope.clickRegistration();
                expect(location.path()).toBe('/registered/2/eventRegistration.html');
            });
        });

        describe('Click Moc Registration', function() {
            it('should redirect to the payment page', function() {
                window.sessionStorage.registered = 'YES';
                scope.clickMocRegistration();
                expect(location.path()).toBe('');
            });

            it('should redirect to the moc registration page', function() {
                window.sessionStorage.registered = 'YES';
                window.sessionStorage.paid = 'YES';
                scope.clickMocRegistration();
                expect(location.path()).toBe('/paid/2/eventMocRegistration.html');
            });
        });

        describe('Click Update Moc Registration', function() {
            it('should redirect to the payment page', function() {
                window.sessionStorage.registered = 'YES';
                scope.clickUpdateMocRegistration();
                expect(location.path()).toBe('');
            });

            it('should redirect to the moc registration page', function() {
                window.sessionStorage.registered = 'YES';
                window.sessionStorage.paid = 'YES';
                scope.moc = {
                    mocId: 3
                }
                scope.clickUpdateMocRegistration();
                expect(location.path()).toBe('/paid/2/3/eventMocRegistration.html');
            });

        });


        describe('Pay Now', function() {
            it('should redirect to the eventPayment page', function() {
                scope.payNow();
                expect(location.path()).toBe('/registered/eventPayment.html');
            });
        });

        describe('Click Games Registration', function() {
            it('should redirect to the game registration page', function() {
                window.sessionStorage.paid = 'YES';
                scope.clickGames();
                expect(location.path()).toBe('/paid/eventGames.html');
            });

            it('should not redirect to the registration page', function() {
                scope.clickGames();
                expect(location.path()).toBe('');
            });
        });

        describe('Click Vendors Registration', function() {
            it('should redirect to the vendor registration page', function() {
                scope.clickVendors();
                expect(location.path()).toBe('/registered/2/undefined/vendorRegistration.html');
            });
        });

        describe('Default Values', function() {
            it('should have a storeId variable', function() {
                expect(scope.storeId).toBeUndefined();
            });

            it('should have a tableId variable', function() {
                expect(scope.tableId).toBeUndefined();
            });

            it('should have a verifying variable', function() {
                expect(scope.verifying).toBe(false);
            });

            it('should have a displayMessage variable', function() {
                expect(scope.displayMessage).toBe('');
            });

            it('should have a timer variable', function() {
                expect(scope.timer).toBe(false);
            });

            it('should have a success variable', function() {
                expect(scope.success).toBe(true);
            });

            it('should have an eventId variable', function() {
                expect(scope.eventId).toBe(2);
            });

            it('should have an displayRegisteredEventGamesCTA variable', function() {
                expect(scope.displayRegisterEventGamesCTA).toBe(true);
            });

            it('should have an displayRegisteredEventCTA variable', function() {
                expect(scope.displayRegisterEventCTA).toBe(true);
            });

            it('should have an displayRegisterEventMocsCTA variable', function() {
                expect(scope.displayRegisterEventMocsCTA).toBe(true);
            });

            it('should have an displayRegisterEventVendorsCTA variable', function() {
                expect(scope.displayRegisterEventVendorsCTA).toBe(true);
            });

            it('should have a passType variable', function() {
                expect(scope.passType).toBe(undefined);
            });

            it('should have a passDates variable', function() {
                expect(scope.passDates).toBe(undefined);
            });

            it('should have an eventList variable', function() {
                expect(scope.eventList).toEqualData({});
            });

            it('should have an userGameList variable', function() {
                expect(scope.userGameList).toEqualData({});
            });

            it('should have an mocList variable', function() {
                expect(scope.mocList).toEqualData({});
            });

            it('should have an mocCount variable', function() {
                expect(scope.mocCount).toBe(0);
            });

            it('should have an vendorModel variable', function() {
                expect(scope.vendorModel).toEqualData({});
            });

            it('should have a gameCount variable', function() {
                expect(scope.gameCount).toBe(0);
            });

            it('should have an userObject variable', function() {
                expect(scope.userObject).toEqualData({});
            });
        });

        describe('Digest with all add-ons', function() {
            beforeEach(function() {
                window.sessionStorage.registered = 'YES';
                window.sessionStorage.paid = 'YES';
                window.sessionStorage.userId = '1';
                mockBackend.expectGET('/controllers/public/eventDates.php').respond(eventDates);
                mockBackend.expectGET('/controllers/registered/eventRegistration.php').respond(eventRegistration);
                mockBackend.expectGET('/controllers/paid/mocs.php?eventId=2').respond(200, mocs);
                mockBackend.expectGET('/controllers/registered/vendors/vendorMeInformation.php?eventId=2').respond(200, eventMeVendor);
                mockBackend.expectGET('/controllers/paid/gameUser.php?eventId=2').respond(200, userGames);
                mockBackend.expectGET('/controllers/public/user.php').respond(200, singleUser);
                mockBackend.flush();

            });

            afterEach(function() {
                deleteSession(window);
            });

            it('should populate the passType variable', function() {
                expect(scope.passType).toBe('4-Day');
            });

            it('should populate the passDates variable', function() {
                expect(scope.passDates).toBe('May 14th thru 17th');
            });

            it('should populate the userObject variable', function() {
                expect(scope.userObject.memberSince).toEqualData('May 16th, 2014');
            });

            it('should have an displayRegisteredEventCTA variable', function() {
                expect(scope.displayRegisterEventCTA).toBe(false);
            });

            it('should have an displayRegisterEventMocsCTA variable', function() {
                expect(scope.displayRegisterEventMocsCTA).toBe(false);
            });

            it('should have an displayRegisterEventGamesCTA variable', function() {
                expect(scope.displayRegisterEventGamesCTA).toBe(false);
            });

            it('should have an displayRegisterEventVendorsCTA variable', function() {
                expect(scope.displayRegisterEventVendorsCTA).toBe(false);
            });

            it('should have a mocCount variable', function() {
                expect(scope.mocCount).toBe(2);
            });

            it('should have a storeId variable', function() {
                expect(scope.storeId).toBe('4');
            });

            it('should have a tableId variable', function() {
                expect(scope.tableId).toBe('8');
            });

            describe('The Vendor Model', function() {
                describe('Click Edit Store', function() {
                    it('should redirect to the edit store page', function() {
                        scope.clickVendors();
                        expect(location.path()).toBe('/registered/2/4/vendorRegistration.html');
                    });
                });

                describe('Click Add Event Tables', function() {
                    it('should redirect to the add table page', function() {
                        scope.tableId = undefined;
                        scope.clickTables();
                        expect(location.path()).toBe('/registered/2/4/tableRegistration.html');
                    });
                });

                describe('Click Edit Event Tables', function() {
                    it('should redirect to the edit table page', function() {
                        scope.clickTables();
                        expect(location.path()).toBe('/registered/2/8/updateTableRegistration.html');
                    });
                });

                describe('Click Add Associates', function() {
                    it('should redirect to the associates page', function() {
                        scope.clickAssociates();
                        expect(location.path()).toBe('/registered/2/4/associateRegistration.html');
                    });
                });

                describe('Click Edit an Associate', function() {
                    it('should redirect to the associates page', function() {
                        scope.associateId = 6;
                        scope.clickEditAssociate();
                        //expect(location.path()).toBe('');
                    });
                });

                describe('Vendor Store', function() {
                    it('should get a single vendor store', function() {
                        var store = scope.vendorModel.store;
                        expect(store.storeId).toBe('4');
                        expect(store.name).toBe("My Store");
                        expect(store.url).toBe('https://www.brickshelf.com/url');
                        expect(store.logo).toBe('https://www.logo.com/logo');
                        expect(store.creationDate).toBe('2014-08-30 17:16:49');
                    });
                });

                describe('Vendor Tables', function() {
                    it('should have a tables object', function() {
                        expect(scope.vendorModel.hasTables).toBe(true);
                    });

                    it('should get a count of vendor tables for an event', function() {
                        var tables = scope.vendorModel.tables;
                        expect(tables.tableId).toBe('8');
                        expect(tables.tables).toBe('2');
                    });
                });

                describe('Store Associates', function() {
                    it('should have an associates object', function() {
                        expect(scope.vendorModel.hasAssociates).toBe(true);
                    });

                    it('should get a count of associates', function() {
                        var associates = scope.vendorModel.associates;
                        expect(associates[0].associateId).toBe('8');
                        expect(associates[0].fullName).toBe('Ember Pilati');

                        expect(associates[2].associateId).toBe('9');
                        expect(associates[2].fullName).toBe('t h');
                    });
                });

            });

            it('should have an mocList variable', function() {
                expect(scope.mocList).toEqualData(userOneMoc);
            });

            it('should have a gameCount variable', function() {
                expect(scope.gameCount).toBe(1);
            });
        });

        describe('Change Password', function() {
            it('should change a user\'s password', function() {
                scope.changePassword();
                scope.changePasswordForm = {'$setPristine': function() {}};
                expect(scope.verifying).toBe(true);
                mockBackend.expectGET('/controllers/public/eventDates.php').respond(eventDates);
                mockBackend.expectGET('/controllers/registered/eventRegistration.php').respond(eventRegistration);
                mockBackend.expectGET('/controllers/paid/mocs.php?eventId=2').respond(200, mocs);
                mockBackend.expectGET('/controllers/registered/vendors/vendorMeInformation.php?eventId=2').respond(200, eventMeVendor);
                mockBackend.expectGET('/controllers/paid/gameUser.php?eventId=2').respond(200, userGames);
                mockBackend.expectGET('/controllers/public/user.php').respond(200, singleUser);
                mockBackend.expectPATCH('/controllers/public/authentication.php').respond(201);
                mockBackend.flush();
                expect(scope.verifying).toBe(false);
                expect(scope.displayMessage).toBe('Password Changed');
                expect(scope.oldPassword).toBe('');
                expect(scope.newPassword).toBe('');
                expect(scope.newPasswordVerify).toBe('');
                expect(scope.timer).toBe(true);
                expect(scope.success).toBe(true);
            });
        });

        describe('Change Password Error', function() {
            it('should change a user\'s password', function() {
                scope.changePassword();
                scope.changePasswordForm = {'$setPristine': function() {}};
                expect(scope.verifying).toBe(true);
                mockBackend.expectGET('/controllers/public/eventDates.php').respond(eventDates);
                mockBackend.expectGET('/controllers/registered/eventRegistration.php').respond(eventRegistration);
                mockBackend.expectGET('/controllers/paid/mocs.php?eventId=2').respond(200, mocs);
                mockBackend.expectGET('/controllers/registered/vendors/vendorMeInformation.php?eventId=2').respond(200, eventMeVendor);
                mockBackend.expectGET('/controllers/paid/gameUser.php?eventId=2').respond(200, userGames);
                mockBackend.expectGET('/controllers/public/user.php').respond(200, singleUser);
                mockBackend.expectPATCH('/controllers/public/authentication.php').respond(412);
                mockBackend.flush();
                expect(scope.verifying).toBe(false);
                expect(scope.displayMessage).toBe('The password you entered is incorrect.');
                expect(scope.oldPassword).toBe('');
                expect(scope.newPassword).toBe('');
                expect(scope.newPasswordVerify).toBe('');
                expect(scope.timer).toBe(true);
                expect(scope.success).toBe(false);
            });
        });
    });
});
