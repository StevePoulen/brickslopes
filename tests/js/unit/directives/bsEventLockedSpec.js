describe('directives', function() {
    'use strict';

    beforeEach(module('brickSlopes'));

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

            it('should have an eventLocked Bottom Class', function() {
                element = compile(element)(scope);
                scope.$digest();
                expect(element.hasClass('eventLockedIndex')).toBe(true);
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

            it('should have eventLockedMe class with attribute', function() {
                element = angular.element('<bs-event-locked bottom="eventLockedMe"></bs-event-locked>');
                element = compile(element)(scope);
                scope.$digest();
                expect(element.hasClass('eventLockedMe')).toBe(true);
            });

            it('should be visible with no registration', function() {
                window.sessionStorage.registered = 'NO';
                window.sessionStorage.paid = 'NO';
                compile(element)(scope);
                scope.$digest();
                expect(element.hasClass('ng-hide')).toBe(false);
                expect($(element).find('.cta').html()).toContain('Register to Unlock');
            });

            it('should be hidden with registration', function() {
                window.sessionStorage.registered = 'YES';
                window.sessionStorage.paid = 'NO';
                element = compile(element)(scope);
                scope.$digest();
                expect(element.hasClass('ng-hide')).toBe(false);
                expect($(element).find('.cta').html()).toContain('Pay to Unlock');
            });

            it('should be hidden with registration and payment', function() {
                window.sessionStorage.registered = 'YES';
                window.sessionStorage.paid = 'YES';
                element = compile(element)(scope);
                scope.$digest();
                expect(element.hasClass('ng-hide')).toBe(true);
                expect($(element).find('.cta').html()).toContain('Pay to Unlock');
            });
        });
    });
});
