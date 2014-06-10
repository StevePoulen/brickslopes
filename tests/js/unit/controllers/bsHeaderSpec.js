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

    describe('bsHeaderController Default Variables', function() {
        beforeEach(inject(function($controller, $rootScope) {
            scope = $rootScope.$new();
            ctrl = $controller('bsHeader', { $scope: scope});
        }));

        it('should have a showAfol variable', function() {
            expect(scope.showAfolLogin).toBe(false);
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
});
