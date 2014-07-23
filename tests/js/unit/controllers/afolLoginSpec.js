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

    describe('afolLogin Controller', function() {
        var mockBackend, loader, window;
        beforeEach(inject(function($controller, $rootScope, $location, _$httpBackend_, $window) {
            scope = $rootScope.$new();
            ctrl = $controller('afolLogin', { $scope: scope});
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
                var response = {
                    data: {
                        token: 22,
                        firstName: 'Cody',
                        lastName: 'Ottley',
                        admin: 'NO',
                        registered: 'YES'
                    },
                    status: 201
                }

                scope.submitLogin();
                mockBackend.expectPOST('/controllers/public/authentication.php').respond(200, response);
                mockBackend.flush();
            });

            it('should submit to login page on success', function() {
                expect(location.path()).toBe('/afol/index.html');
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
                expect(window.sessionStorage.token).toBe('22');
            });

            it('should have a window.sessionStorage.firstName variables', function() {
                expect(window.sessionStorage.firstName).toBe('Cody');
            });

            it('should have a window.sessionStorage.lastName variables', function() {
                expect(window.sessionStorage.lastName).toBe('Ottley');
            });

            it('should have a window.sessionStorage.admin variables', function() {
                expect(window.sessionStorage.admin).toBe('NO');
            });

            it('should have a window.sessionStorage.registered variables', function() {
                expect(window.sessionStorage.registered).toBe('YES');
            });
        });

        describe('Sign in on a redirect', function() {
            var response;
            beforeEach(function() {
                response = {
                    data: {
                        token: 22,
                        firstName: 'Cody',
                        lastName: 'Ottley',
                        admin: 'NO'
                    },
                    status: 201
                }
            });
            it('should redirect to an afol page after an initial failure', function() {
                window.sessionStorage.redirectUrl = '/partials/afol/eventMe.html';

                scope.submitLogin();
                mockBackend.expectPOST('/controllers/public/authentication.php').respond(200, response);
                mockBackend.flush();
                expect(location.path()).toBe('/afol/eventMe.html');
                expect(window.sessionStorage.redirectUrl).toBeUndefined();
            });
        });

        describe('Sign in on failure ', function() {
            it('should submit to login page on failure', function() {
                scope.submitLogin();
                mockBackend.expectPOST('/controllers/public/authentication.php').respond(401);
                mockBackend.flush();
                expect(scope.displayErrorMessage).toBe("The email or password you entered is incorrect.");
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
                var response = {
                    data: {
                        token: 22,
                        firstName: 'Cody',
                        lastName: 'Ottley',
                        admin: 'NO',
                        registered: 'YES'
                    },
                    status: 201
                }

                scope.register();
                mockBackend.expectPOST('/controllers/user.php').respond(201, response);
                mockBackend.flush();
            });

            it('should register a new user', function() {
                expect(location.path()).toBe('/afol/index.html');
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
                expect(window.sessionStorage.token).toBe('22');
            });

            it('should have a window.sessionStorage.firstName variables', function() {
                expect(window.sessionStorage.firstName).toBe('Cody');
            });

            it('should have a window.sessionStorage.lastName variables', function() {
                expect(window.sessionStorage.lastName).toBe('Ottley');
            });

            it('should have a window.sessionStorage.admin variables', function() {
                expect(window.sessionStorage.admin).toBe('NO');
            });

            it('should have a window.sessionStorage.registered variables', function() {
                expect(window.sessionStorage.registered).toBe('YES');
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

                mockBackend.expectPOST('/controllers/user.php').respond(400, response);
                mockBackend.flush();
                expect(location.path()).toBe('');
                expect(window.sessionStorage.token).toBe('22');
                expect(scope.verifying).toBe(false);
                expect(scope.showLogin).toBe(true);
                expect(scope.showResetPassword).toBe(true);
                expect(scope.displayErrorMessage).toBe('The email is already in our system. Please login.');
                expect(scope.displayMessage).toBe('');
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
                scope.resetPasswordForm = {'$setPristine': function() {}};
                expect(scope.verifying).toBe(true);
                mockBackend.expectPUT('/controllers/public/authentication.php').respond(201);
                mockBackend.flush();
                expect(scope.verifying).toBe(false);
                expect(scope.displayErrorMessage).toBe('');
                expect(scope.resetEmail).toBe('');
                expect(scope.displayMessage).toBe('An e-mail with reset information has been sent to your account');
            });
        });
    });
});
