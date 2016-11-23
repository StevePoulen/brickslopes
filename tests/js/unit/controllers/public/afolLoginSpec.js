describe('controllers', function() {
    'use strict';
    var scope, ctrl, location;

    beforeEach(module('brickSlopes'));

    beforeEach(function() {
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    describe('afolLogin Controller', function() {
        var mockBackend, loader, window;
        beforeEach(inject(function($controller, $rootScope, $location, _$httpBackend_, $window) {
            scope = $rootScope.$new();
            ctrl = $controller('afolLogin', {
                $scope: scope
            });
            location = $location;
            mockBackend = _$httpBackend_;
            window = $window;
        }));

        describe('Close Dialog', function() {
            it('should redirect to index page', function() {
                scope.closeDialog();
                expect(location.path()).toBe('/');
            });
        });

        describe('Default Values', function() {
            it('should display the sign informatoin', function() {
                expect(scope.showLogin).toBe(true);
            });

            it('should have a verifying value of false', function() {
                expect(scope.verifying).toBe(false);
            });

            it('should have a showResetPassword value of false', function() {
                expect(scope.showResetPassword).toBe(false);
            });

            it('should have a displayErrorMessage value of ""', function() {
                expect(scope.displayErrorMessage).toBe("");
            });

            it('should have a displayMessage value of ""', function() {
                expect(scope.displayMessage).toBe("");
            });
        });

        describe('Sign in on success', function() {
            beforeEach(function() {
                scope.submitLogin();
                mockBackend.expectPOST('/controllers/public/authentication.php').respond(200, sessionData);
                mockBackend.flush();
            });

            it('should submit to login page on success', function() {
                expect(location.path()).toBe('/registered/index.html');
            });

            it('should have a blank displayErrorMessage', function() {
                expect(scope.displayErrorMessage).toBe("");
            });

            it('should have a blank displayMessage', function() {
                expect(scope.displayMessage).toBe("");
            });

            it('should have a true verifying message', function() {
                expect(scope.verifying).toBe(false);
            });

            it('should have a window.sessionStorage.token variables', function() {
                expect(window.sessionStorage.token).toBe('1234567890');
            });

            it('should have a window.sessionStorage.firstName variables', function() {
                expect(window.sessionStorage.firstName).toBe('Ember');
            });

            it('should have a window.sessionStorage.lastName variables', function() {
                expect(window.sessionStorage.lastName).toBe('Pilati');
            });

            it('should have a window.sessionStorage.admin variables', function() {
                expect(window.sessionStorage.admin).toBe('NO');
            });

            it('should have a window.sessionStorage.registered variables', function() {
                expect(window.sessionStorage.registered).toBe('YES');
            });

            it('should have a window.sessionStorage.paid variables', function() {
                expect(window.sessionStorage.paid).toBe('YES');
            });

            it('should have a window.sessionStorage.userId variables', function() {
                expect(window.sessionStorage.userId).toBe('080898');
            });
        });

        describe('Sign in on a redirect', function() {
            it('should redirect to an afol page after an initial failure', function() {
                window.sessionStorage.redirectUrl = '/partials/registered/eventMe.html';

                scope.submitLogin();
                mockBackend.expectPOST('/controllers/public/authentication.php').respond(200, sessionData);
                mockBackend.flush();
                expect(location.path()).toBe('/registered/eventMe.html');
                expect(window.sessionStorage.redirectUrl).toBeUndefined();
            });
        });

        describe('Sign in on failure ', function() {
            it('should submit to login page on failure', function() {
                scope.submitLogin();
                mockBackend.expectPOST('/controllers/public/authentication.php').respond(401);
                mockBackend.flush();
                expect(scope.displayMessage.$$unwrapTrustedValue()).toBe("The email or password you entered is incorrect.<p>");
                expect(scope.showModal).toBe(true);
            });
        });

        describe('Sign up', function() {
            it('should display the registration form', function() {
                scope.seeRegistration();
                expect(scope.showLogin).toBe(false);
            });
        });

        describe('Register', function() {
            beforeEach(function() {
                scope.register();
                mockBackend.expectPOST('/controllers/public/user.php').respond(201, sessionData);
                mockBackend.flush();
            });

            it('should register a new user', function() {
                expect(location.path()).toBe('/registered/index.html');
            });

            it('should have a blank displayErrorMessage', function() {
                expect(scope.displayErrorMessage).toBe("");
            });

            it('should have a blank displayMessage', function() {
                expect(scope.displayMessage).toBe("");
            });

            it('should have a true verifying message', function() {
                expect(scope.verifying).toBe(false);
            });

            it('should have a window.sessionStorage.token variables', function() {
                expect(window.sessionStorage.token).toBe('1234567890');
            });

            it('should have a window.sessionStorage.firstName variables', function() {
                expect(window.sessionStorage.firstName).toBe('Ember');
            });

            it('should have a window.sessionStorage.lastName variables', function() {
                expect(window.sessionStorage.lastName).toBe('Pilati');
            });

            it('should have a window.sessionStorage.admin variables', function() {
                expect(window.sessionStorage.admin).toBe('NO');
            });

            it('should have a window.sessionStorage.registered variables', function() {
                expect(window.sessionStorage.registered).toBe('YES');
            });

            it('should have a window.sessionStorage.paid variables', function() {
                expect(window.sessionStorage.paid).toBe('YES');
            });

            it('should have a window.sessionStorage.userId variables', function() {
                expect(window.sessionStorage.userId).toBe('080898');
            });
        });

        describe('Register - Existing User', function() {
            it('should redirect for an existing user', function() {
                scope.register();
                expect(scope.verifying).toBe(true);
                var response = {
                    data: 'Duplicate E-mail',
                    status: 400
                }

                mockBackend.expectPOST('/controllers/public/user.php').respond(400, response);
                mockBackend.flush();
                expect(location.path()).toBe('/');
                expect(window.sessionStorage.token).toBe('1234567890');
                expect(scope.verifying).toBe(false);
                expect(scope.showLogin).toBe(true);
                expect(scope.showModal).toBe(true);
                expect(scope.showResetPassword).toBe(true);
                expect(scope.displayMessage.$$unwrapTrustedValue()).toBe('The email is already in our system.<p>Please login using your e-mail and password.<p>If you have forgotten your password, please reset it.');
            });
        });

        describe('See Reset Password', function() {
            it('should display the reset password form', function() {
                scope.seeResetPassword();
                expect(scope.showResetPassword).toBe(true);
            });
        });

        describe('Reset Password', function() {
            it('should reset a user password', function() {
                scope.resetPassword();
                scope.resetPasswordForm = {
                    '$setPristine': function() {}
                };
                expect(scope.verifying).toBe(true);
                mockBackend.expectPUT('/controllers/public/authentication.php').respond(201);
                mockBackend.flush();
                expect(scope.verifying).toBe(false);
                expect(scope.showModal).toBe(true);
                expect(scope.resetEmail).toBe('');
                expect(scope.displayMessage.$$unwrapTrustedValue()).toBe('An e-mail with password reset information has been sent to your account.<p>Please check your spam filter too.');
            });
        });
    });
});
