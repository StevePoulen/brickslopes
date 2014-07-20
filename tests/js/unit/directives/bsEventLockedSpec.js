'use strict';

/* jasmine specs for directives go here */

describe('directives', function() {
    beforeEach(
        module(
            'brickSlopes.directives',
            'brickSlopes.services',
            'app/partials/directives/eventLocked.html'
        )
    );

    beforeEach(function() {
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    describe('bsModal', function() {
        var scope, element, window, compile;
        beforeEach(inject(function($compile, $rootScope, $templateCache, _$window_) {
            window = _$window_;
            var template = $templateCache.get('app/partials/directives/eventLocked.html');
            $templateCache.put('partials/directives/eventLocked.html', template);
            scope = $rootScope.$new();
            element = angular.element('<bs-event-locked></bs-event-locked>');
            compile = $compile;
        }));

        afterEach(function() {
            deleteSession(window);
        });

        describe('Contents', function() {
            it('should have an eventLocked class', function() {
                element = compile(element)(scope);
                scope.$digest();
                expect(element.hasClass('eventLocked')).toBe(true);
            });

            it('should have a lock icon', function() {
                element = compile(element)(scope);
                scope.$digest();
                expect(element.find('i').hasClass('icons-lock')).toBe(true);
            });
        });

        describe('Visibility', function() {
            it('should be visible with no registration', function() {
                element = compile(element)(scope);
                scope.$digest();
                expect(element.hasClass('ng-hide')).toBe(false);
            });

            it('should be visible with no registration', function() {
                window.sessionStorage.registered = 'NO';
                compile(element)(scope);
                scope.$digest();
                expect(element.hasClass('ng-hide')).toBe(false);
            });

            it('should be hidden with registration', function() {
                window.sessionStorage.registered = 'YES';
                element = compile(element)(scope);
                scope.$digest();
                expect(element.hasClass('ng-hide')).toBe(true);
            });
        });
    });
});
