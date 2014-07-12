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
        beforeEach(inject(function($controller, $rootScope, _$httpBackend_, $location) {
            scope = $rootScope.$new();
            ctrl = $controller('afolMe', { $scope: scope});
            mockBackend = _$httpBackend_;
            location = $location
        }));

        describe('Close Dialog', function() {
            it('should redirect to index page', function() {
                scope.closeDialog();
                expect(location.path()).toBe('/afol/index.html');
            });
        });

        describe('Default Values', function() {
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

            it('should have a passType variable', function() {
                expect(scope.passType).toBe(undefined);
            });

            it('should have a passDates variable', function() {
                expect(scope.passDates).toBe(undefined);
            });
        });

        describe('Digest with all add-ons', function() {
            beforeEach(function() {
                mockBackend.expectGET('/controllers/eventDates.php').respond(eventDates);
                mockBackend.expectGET('/controllers/eventRegistration.php').respond(eventRegistration);
                mockBackend.flush();
            });

            it('should populate the passType variable', function() {
                expect(scope.passType).toBe('4-Day');
            });

            it('should populate the passDates variable', function() {
                expect(scope.passDates).toBe('May 14th thru 17th');
            });

            it('should have an age verification attribue in eventList', function() {
                expect(scope.eventList[0].ageVerification).toBe('YES');
            });

            it('should have a type attribue in eventList', function() {
                expect(scope.eventList[0].type).toBe('AFOL');
            });

            it('should have a paid attribute in eventList', function() {
                expect(scope.eventList[0].paid).toBe('NO');
            });

            it('should have a name attribute in eventList', function() {
                expect(scope.eventList[0].name).toBe('BrickSlopes - Salt Lake City');
            });

            it('should have a total attribute in eventList', function() {
                expect(scope.eventList[0].total).toBe('25.00');
            });

            it('should have a tShirtSize attribute in eventList', function() {
                expect(scope.eventList[0].tShirtSize).toBe('X-Large');
            });

            it('should have a tShirtSize attribute in eventList', function() {
                expect(scope.eventList[0].meetAndGreet).toBe('YES');
            });

            it('should have a nameBadge attribute in eventList', function() {
                expect(scope.eventList[0].nameBadge).toBe('YES');
            });

            it('should have a showBadgeLine1 attribute in eventList', function() {
                expect(scope.eventList[0].showBadgeLine1).toBe(true);
            });

            it('should have a badgeLine1 attribute in eventList', function() {
                expect(scope.eventList[0].badgeLine1).toBe('2015 BrickSlopes');
            });

            it('should have a showBadgeLine2 attribute in eventList', function() {
                expect(scope.eventList[0].showBadgeLine2).toBe(true);
            });

            it('should have a badgeLine2 attribute in eventList', function() {
                expect(scope.eventList[0].badgeLine2).toBe('Badge Line Two');
            });

            it('should have a showBadgeLine3 attribute in eventList', function() {
                expect(scope.eventList[0].showBadgeLine3).toBe(true);
            });

            it('should have a badgeLine3 attribute in eventList', function() {
                expect(scope.eventList[0].badgeLine3).toBe('Badge Line Three');
            });

            describe('line items', function() {
                var lineItems, total;
                beforeEach(function() {
                    lineItems = scope.eventList[0].lineItems.lineItems[0];
                    total = scope.eventList[0].lineItems.total;
                });

                it('should have a total attribute', function() {
                    expect(total).toBe('25.00');
                });

                it('should have a lineitem attribute', function() {
                    expect(lineItems.lineItem).toBe('T-Shirt');
                });
            });
        });

        describe('Digest Without add-ons', function() {
            beforeEach(function() {
                mockBackend.expectGET('/controllers/eventDates.php').respond(eventDates);
            });

            it('should have no tShirtSize attribute in eventList', function() {
                mockBackend.expectGET('/controllers/eventRegistration.php').respond(eventRegistrationNoTShirt);
                mockBackend.flush();
                expect(scope.eventList[0].tShirtSize).toBe('NO');
            });

            it('should have no meetAndGreet attribute in eventList', function() {
                mockBackend.expectGET('/controllers/eventRegistration.php').respond(eventRegistrationNoMeetAndGreet);
                mockBackend.flush();
                expect(scope.eventList[0].meetAndGreet).toBe('NO');
            });

            it('should have no badgeLine1 attribute in eventList', function() {
                mockBackend.expectGET('/controllers/eventRegistration.php').respond(eventRegistrationNoMeetAndGreet);
                mockBackend.flush();
                expect(scope.eventList[0].showBadgeLine1).toBe(false);
                expect(scope.eventList[0].badgeLine1).toBe('One');
            });

            it('should have no badgeLine2 attribute in eventList', function() {
                mockBackend.expectGET('/controllers/eventRegistration.php').respond(eventRegistrationNoMeetAndGreet);
                mockBackend.flush();
                expect(scope.eventList[0].showBadgeLine2).toBe(false);
                expect(scope.eventList[0].badgeLine2).toBe('Two');
            });

            it('should have a badgeLine1 and no badgeLine2 attribute in eventList', function() {
                mockBackend.expectGET('/controllers/eventRegistration.php').respond(eventRegistrationBadgeLineOneOnly);
                mockBackend.flush();
                expect(scope.eventList[0].badgeLine1).toBe('Badge Line One');
                expect(scope.eventList[0].showBadgeLine1).toBe(true);
                expect(scope.eventList[0].badgeLine2).toBe('Two');
                expect(scope.eventList[0].showBadgeLine2).toBe(false);
                expect(scope.eventList[0].badgeLine3).toBe('Three');
                expect(scope.eventList[0].showBadgeLine3).toBe(false);
                expect(scope.eventList[0].badgeLine2).toBe('Two');
                expect(scope.eventList[0].showBadgeLine2).toBe(false);
            });
        });

        describe('Change Password', function() {
            it('should change a user\'s password', function() {
                scope.changePassword();
                scope.changePasswordForm = {'$setPristine': function() {}};
                expect(scope.verifying).toBe(true);
                mockBackend.expectGET('/controllers/eventDates.php').respond(eventDates);
                mockBackend.expectGET('/controllers/eventRegistration.php').respond(eventRegistration);
                mockBackend.expectPATCH('/controllers/authentication.php').respond(201);
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
                mockBackend.expectGET('/controllers/eventDates.php').respond(eventDates);
                mockBackend.expectGET('/controllers/eventRegistration.php').respond(eventRegistration);
                mockBackend.expectPATCH('/controllers/authentication.php').respond(412);
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
