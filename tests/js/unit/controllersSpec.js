'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function() {
    var scope, ctrl, location;

    beforeEach(module('brickSlopes.controllers', 'brickSlopes.services'));

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
            delete window.sessionStorage.token;
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

        it('should redirect to afol index page with a session token', function() {
            scope.clickBuilder();
            expect(location.path()).toBe('/afol/index.html');
        });
    });

    describe('afolLogin Controller', function() {
        var mockBackend, loader;
        beforeEach(inject(function($controller, $rootScope, $location, _$httpBackend_) {
            scope = $rootScope.$new();
            ctrl = $controller('afolLogin', { $scope: scope});
            location = $location;
            mockBackend = _$httpBackend_;
        }));

        describe('Close Dialog', function() {
            it('should redirect to index page', function() {
                scope.closeDialog();
                expect(location.path()).toBe('/');
            });
        });

        describe('Sign in', function() {
            it('should display the sign informatoin', function() {
                expect(scope.showLogin).toBe(true);
            });

            it('should submit to login page on success', function() {
                scope.submitLogin();
                mockBackend.expectPOST('/controllers/authentication.php').respond(200);
                mockBackend.flush();
                expect(location.path()).toBe('/afol/index.html');
                expect(scope.displayErrorMessage).toBe("");
            });

            it('should submit to login page on failure', function() {
                scope.submitLogin();
                mockBackend.expectPOST('/controllers/authentication.php').respond(401);
                mockBackend.flush();
                expect(scope.displayErrorMessage).toBe("The email or password you entered is incorrect.");
            });
        });

        describe('Sign up', function() {
            it('should register', function() {
                scope.register();
                expect(scope.showLogin).toBe(false);
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
            expect(location.path()).toBe('/afol/eventRegistration.html');
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
