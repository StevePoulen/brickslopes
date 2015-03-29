'use strict';

/* jasmine specs for directives go here */

describe('directives', function() {
    beforeEach(
        module(
            'brickSlopes.directives',
            'brickSlopes.services',
            'brickSlopes.controllers',
            'app/partials/directives/splashPageCTA.html'
        )
    );

    beforeEach(function() {
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    describe('bsSplashPageCTA', function() {
        var scope, element, mockBackend, location;
        beforeEach(inject(function($compile, $rootScope, $templateCache, _$httpBackend_, $location) {
            location = $location;
            var template = $templateCache.get('app/partials/directives/splashPageCTA.html');
            $templateCache.put('partials/directives/splashPageCTA.html', template);
            scope = $rootScope.$new();
            element = angular.element('<bs-splash-page-cta></bs-splash-page-cta>');
            $compile(element)(scope);
            mockBackend = _$httpBackend_;
            mockBackend.expectGET('/controllers/public/eventDates.php').respond(200);
            scope.$digest();
        }));

        it('should have a childPackages div', function() {
            expect($(element).find('#childPackages').html()).toContain('View Event Package');
        });

        it('should have a countDown div', function() {
            expect($(element).find('#countDown')).not.toBeUndefined();
        });

        it('should be displayed', function() {
            expect(element.hasClass('ng-hide')).toBe(false);
        });

        it('should not be displayed', function() {
            location.path('/paid/hello.html');
            scope.$digest();
            expect(element.hasClass('ng-hide')).toBe(true);
        });

        it('should not be displayed', function() {
            location.path('/admin/hello.html');
            scope.$digest();
            expect(element.hasClass('ng-hide')).toBe(true);
        });

        it('should not be displayed', function() {
            location.path('/aboutus/22.html');
            scope.$digest();
            expect(element.hasClass('ng-hide')).toBe(true);
        });

        it('should not be displayed', function() {
            location.path('/error.html');
            scope.$digest();
            expect(element.hasClass('ng-hide')).toBe(true);
        });

        it('should not be displayed', function() {
            location.path('/registered/hello.html');
            scope.$digest();
            expect(element.hasClass('ng-hide')).toBe(true);
        });

        it('should be displayed', function() {
            location.path('/when/index.html');
            scope.$digest();
            expect(element.hasClass('ng-hide')).toBe(false);
        });

        it('should be displayed', function() {
            location.path('/');
            scope.$digest();
            expect(element.hasClass('ng-hide')).toBe(false);
        });
    });
});
