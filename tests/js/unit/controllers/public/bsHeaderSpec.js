describe('controllers', function() {
    'use strict';
    var scope, ctrl, location;

    beforeEach(module('brickSlopes'));

    describe('bsHeaderController Default Variables', function() {
        beforeEach(inject(function($controller, $rootScope) {
            scope = $rootScope.$new();
            ctrl = $controller('bsHeader', {
                $scope: scope
            });
        }));

        it('should have a showAfol variable', function() {
            expect(scope.showAfolLogin).toBe(true);
        });

        it('should have a showHeader variable', function() {
            expect(scope.showHeader).toBe(true);
        });
    });

    describe('bsHeaderController Login, Builder site and Admin', function() {
        var window, controller, ctrl;
        beforeEach(inject(function($controller, $rootScope, $location, _$window_) {
            scope = $rootScope.$new();
            window = _$window_;
            controller = $controller;
            location = $location;
        }));

        it('should not show the header on /schedule', function() {
            location.path("/schedule");
            ctrl = controller('bsHeader', {
                $scope: scope,
                $window: window,
                $location: location
            });
            scope.$digest();
            expect(scope.showHeader).toBe(false);
        });

        it('should redirect to afol login page without a session token', function() {
            ctrl = controller('bsHeader', {
                $scope: scope,
                $window: window
            });
            scope.clickBuilder();
            expect(location.path()).toBe('/registered/login.html');
        });

        it('should redirect to afol index page with a session token', function() {
            window.sessionStorage.token = '1234567890';
            ctrl = controller('bsHeader', {
                $scope: scope,
                $window: window
            });
            scope.clickBuilder();
            expect(location.path()).toBe('/registered/index.html');
        });

        it('should redirect to afol admin page with an admin variable', function() {
            window.sessionStorage.token = '1234567890';
            window.sessionStorage.admin = 'YES';
            ctrl = controller('bsHeader', {
                $scope: scope,
                $window: window
            });
            scope.clickAdmin();
            expect(location.path()).toBe('/admin/index.html');
        });
    });

    describe('bsHeaderController Logout', function() {
        var window;
        beforeEach(inject(function($controller, $rootScope, $location, _$window_) {
            scope = $rootScope.$new();
            window = _$window_;
            var data = {
                token: '1234567890',
                firstName: 'Ember',
                lastName: 'Pilati',
                admin: 'YES',
                registered: 'YES',
                paid: 'NO',
                userId: '051675'
            };
            storeSession(window, data);
            ctrl = $controller('bsHeader', {
                $scope: scope,
                $window: window
            });
            location = $location;
        }));

        afterEach(function() {
            deleteSession(window);
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

        it('should have an undefined Admin', function() {
            expect(window.sessionStorage.admin).toBe('YES');
            scope.logout();
            expect(window.sessionStorage.admin).toBe(undefined);
        });

        it('should have an undefined Registered', function() {
            expect(window.sessionStorage.registered).toBe('YES');
            scope.logout();
            expect(window.sessionStorage.registered).toBe(undefined);
        });

        it('should have an undefined paid', function() {
            expect(window.sessionStorage.paid).toBe('NO');
            scope.logout();
            expect(window.sessionStorage.paid).toBe(undefined);
        });

        it('should have an undefined userId', function() {
            expect(window.sessionStorage.userId).toBe('051675');
            scope.logout();
            expect(window.sessionStorage.userId).toBe(undefined);
        });

        it('should have a login path', function() {
            scope.logout();
            expect(location.path()).toBe('/registered/login.html');
        });
    });

    describe('bsHeaderController Authenticated', function() {
        var window;
        beforeEach(inject(function($controller, $rootScope, $location, _$window_) {
            scope = $rootScope.$new();
            window = _$window_;
            ctrl = $controller('bsHeader', {
                $scope: scope,
                $window: window
            });
            location = $location;
        }));

        afterEach(function() {
            deleteSession(window);
        });

        it('should have a false for unauthenticated', function() {
            expect(scope.authenticated()).toBe(false);
        });

        it('should have a true for authenticated', function() {
            window.sessionStorage.token = '1234567890';
            expect(scope.authenticated()).toBe(true);
        });

        it('should have a true for admin', function() {
            window.sessionStorage.admin = 'YES';
            expect(scope.admin()).toBe(true);
        });

        it('should have a false for admin', function() {
            window.sessionStorage.admin = 'NO';
            expect(scope.admin()).toBe(false);
        });

        it('should have a false for admin', function() {
            window.sessionStorage.admin = 'yes';
            expect(scope.admin()).toBe(false);
        });
    });

    describe('bsHeaderController Authentication Management', function() {
        var window, controller;
        beforeEach(inject(function($controller, $rootScope, _$window_) {
            scope = $rootScope.$new();
            window = _$window_;
            controller = $controller;
        }));

        afterEach(function() {
            deleteSession(window);
        });

        it('should have the user name builder login', function() {
            window.sessionStorage.firstName = 'Brian';
            ctrl = controller('bsHeader', {
                $scope: scope,
                $window: window
            });
            expect(scope.authenticationText()).toBe("Brian's Site");
        });

        it('should have the generic builder login', function() {
            ctrl = controller('bsHeader', {
                $scope: scope,
                $window: window
            });
            expect(scope.authenticationText()).toBe('Builder Login');
        });

        it('should have the admin text', function() {
            window.sessionStorage.token = '12345678';
            window.sessionStorage.admin = 'YES';
            ctrl = controller('bsHeader', {
                $scope: scope,
                $window: window
            });
            expect(scope.adminText()).toBe("| Admin");
        });

        it('should have no admin text', function() {
            window.sessionStorage.admin = 'NO';
            ctrl = controller('bsHeader', {
                $scope: scope,
                $window: window
            });
            expect(scope.adminText()).toBe("");
        });
    });
});
