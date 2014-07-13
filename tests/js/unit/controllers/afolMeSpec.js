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
            it('should redirect to the index page', function() {
                scope.closeDialog();
                expect(location.path()).toBe('/afol/index.html');
            });
        });

        describe('Pay Now', function() {
            it('should redirect to the eventPayment page', function() {
                scope.payNow();
                expect(location.path()).toBe('/afol/eventPayment.html');
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
