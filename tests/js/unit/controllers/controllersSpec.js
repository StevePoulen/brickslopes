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

    describe('bsHeaderController No Session', function() {
        var window;
        beforeEach(inject(function($controller, $rootScope, $location, _$window_) {
            scope = $rootScope.$new();
            window = _$window_;
            ctrl = $controller('bsHeader', { $scope: scope, $window: window});
            location = $location;
        }));

        it('should redirect to afol login page without a session token', function() {
            scope.clickBuilder();
            expect(location.path()).toBe('/afol/login.html');
        });
    });

    describe('bsHeaderController Session', function() {
        var window;
        beforeEach(inject(function($controller, $rootScope, $location, _$window_) {
            scope = $rootScope.$new();
            window = _$window_;
            window.sessionStorage.token = '1234567890';
            ctrl = $controller('bsHeader', { $scope: scope, $window: window});
            location = $location;
        }));

        afterEach(function() {
            delete window.sessionStorage.token;
        });

        it('should redirect to afol index page with a session token', function() {
            scope.clickBuilder();
            expect(location.path()).toBe('/afol/index.html');
        });
    });

    describe('bsHeaderController Logout', function() {
        var window;
        beforeEach(inject(function($controller, $rootScope, $location, _$window_) {
            scope = $rootScope.$new();
            window = _$window_;
            window.sessionStorage.token = '1234567890';
            window.sessionStorage.firstName = 'Ember';
            window.sessionStorage.lastName = 'Pilati';
            ctrl = $controller('bsHeader', { $scope: scope, $window: window});
            location = $location;
        }));

        afterEach(function() {
            delete window.sessionStorage.token;
            delete window.sessionStorage.firstName;
            delete window.sessionStorage.lastName;
        });

        it('should have an undefined token', function() {
            expect(window.sessionStorage.token).toBe('1234567890');
            scope.logout();
            expect(window.sessionStorage.token).toBe(undefined);
        });

        it('should have an undefined firstName', function() {
            expect(window.sessionStorage.firstName).toBe('Ember');
            scope.logout();
            expect(window.sessionStorage.firstName).toBe(undefined);
        });

        it('should have an undefined lastName', function() {
            expect(window.sessionStorage.lastName).toBe('Pilati');
            scope.logout();
            expect(window.sessionStorage.lastName).toBe(undefined);
        });

        it('should have a login path', function() {
            scope.logout();
            expect(location.path()).toBe('/afol/login.html');
        });
    });

    describe('bsHeaderController Authenticated', function() {
        var window;
        beforeEach(inject(function($controller, $rootScope, $location, _$window_) {
            scope = $rootScope.$new();
            window = _$window_;
            ctrl = $controller('bsHeader', { $scope: scope, $window: window});
            location = $location;
        }));

        afterEach(function() {
            delete window.sessionStorage.token;
        });

        it('should have a false for unauthenticated', function() {
            expect(scope.authenticated()).toBe(false);
        });

        it('should have a false for unauthenticated', function() {
            window.sessionStorage.token = '1234567890';
            expect(scope.authenticated()).toBe(true);
        });
    });

    describe('bsHeaderController Authentication Management - Login', function() {
        var window;
        beforeEach(inject(function($controller, $rootScope, _$window_) {
            scope = $rootScope.$new();
            window = _$window_;
            window.sessionStorage.firstName = 'Brian';
            ctrl = $controller('bsHeader', { $scope: scope, $window: window});
        }));

        afterEach(function() {
            delete window.sessionStorage.firstName;
        });

        it('should have the user name builder login', function() {
            expect(scope.authenticationText()).toBe("Brian's Site");
        });
    });

    describe('bsHeaderController Authentication Management - No Login', function() {
        var window;
        beforeEach(inject(function($controller, $rootScope, _$window_) {
            scope = $rootScope.$new();
            window = _$window_;
            delete window.sessionStorage.token;
            ctrl = $controller('bsHeader', { $scope: scope, $window: window});
        }));

        it('should have the generic builder login', function() {
            expect(scope.authenticationText()).toBe('Builder Login');
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


        describe('Sign in', function() {
            it('should submit to login page on success', function() {
                var response = {
                    data: {
                        token: 22
                    },
                    status: 201
                }
                scope.submitLogin();
                mockBackend.expectGET('/controllers/authentication.php?').respond(200, response);
                mockBackend.flush();
                expect(location.path()).toBe('/afol/index.html');
                expect(scope.displayErrorMessage).toBe("");
                expect(scope.verifying).toBe(true);
            });

            it('should submit to login page on failure', function() {
                scope.submitLogin();
                mockBackend.expectGET('/controllers/authentication.php?').respond(401);
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
            it('should register a new user', function() {
                scope.register();
                expect(scope.verifying).toBe(true);
                var response = {
                    data: {
                        token: 22
                    },
                    status: 201
                }

                mockBackend.expectPOST('/controllers/authentication.php').respond(201, response);
                mockBackend.flush();
                expect(location.path()).toBe('/afol/index.html');
                expect(window.sessionStorage.token).toBe('22');
                expect(scope.verifying).toBe(false);
                expect(scope.displayErrorMessage).toBe('');
                expect(scope.displayMessage).toBe('');
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

                mockBackend.expectPOST('/controllers/authentication.php').respond(400, response);
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
                mockBackend.expectPUT('/controllers/authentication.php').respond(201);
                mockBackend.flush();
                expect(scope.verifying).toBe(false);
                expect(scope.displayErrorMessage).toBe('');
                expect(scope.resetEmail).toBe('');
                expect(scope.displayMessage).toBe('An e-mail with reset information has been sent to your account');
            });
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
        });

        describe('Change Password', function() {
            it('should change a user\'s password', function() {
                scope.changePassword();
                scope.changePasswordForm = {'$setPristine': function() {}};
                expect(scope.verifying).toBe(true);
                mockBackend.expectGET('/controllers/eventRegistration.php').respond({});
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
                mockBackend.expectGET('/controllers/eventRegistration.php').respond({});
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

    describe('afolIndex Controller', function() {
        beforeEach(inject(function($controller, $rootScope, $location) {
            scope = $rootScope.$new();
            ctrl = $controller('afolIndex', { $scope: scope});
            location = $location;
        }));

        it('should redirect to eventRegistration', function() {
            scope.clickRegistration();
            expect(location.path()).toBe('/afol/comingSoon.html');
        });

        it('should redirect to the index on close', function() {
            scope.closeDialog();
            expect(location.path()).toBe('/afol/index.html');
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
        }));

        it('should set the mocCount variable', function() {
            var returnList = {'afolMocCount': 22};
            mockBackend.expectGET('/controllers/mocs/getRegisteredMocList.php').respond(returnList);

            mockBackend.flush();
            expect(scope.mocCount).toBe(22);
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
        }));

        it('should set the mocListvariable', function() {
            var returnList = {'afolMocCount': 22, 'mocs': {'firstName': 'Steve'}};
            mockBackend.expectGET('/controllers/mocs/getRegisteredMocList.php').respond(returnList);

            mockBackend.flush();
            expect(scope.mocList).toEqual({'firstName': 'Steve'});
        });
    });
});
