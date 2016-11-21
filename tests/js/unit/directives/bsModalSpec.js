describe('directives', function() {
    'use strict';
    beforeEach(module('brickSlopes'));
    var scope, element;

    describe('bsModal', function() {
        beforeEach(inject(function($compile, $rootScope, $templateCache) {
            var template = $templateCache.get('app/partials/directives/modal.html');
            $templateCache.put('partials/directives/modal.html', template);
            scope = $rootScope.$new();
            element = angular.element('<bs-modal title="Congrats">Hello World</bs-modal>');
            $compile(element)(scope);
            scope.$digest();
        }));

        describe('Contents', function() {
            it('should transclude the modal', function() {
                expect($(element.find('span')).html()).toBe('Hello World');
            });

            it('should have the close button', function() {
                expect($(element.find('#modalCloseButton')).html()).toBeUndefined;
            });

            it('should have the title', function() {
                expect($($(element).find('.title')).html()).toBe('Congrats');
            });

            it('should have the continue button', function() {
                expect($($(element).find('.actionButtonSmall')).html()).toContain('Continue');
            });
        });

        describe('hidden', function() {
            it('should hide the modal', function() {
                expect($(element).hasClass('ng-hide')).toBe(true);
            });
        });

        describe('shown', function() {
            beforeEach(function() {
                scope.showModal=true;
                scope.$digest();
            });

            it('should show the modal', function() {
                expect($(element).hasClass('ng-hide')).toBe(false);
            });
        });

        describe('Close the Modal', function() {
            beforeEach(function() {
                scope.showModal=true;
                scope.$digest();
            });

            it('should close the modal with the "x"', function() {
                expect($(element).hasClass('ng-hide')).toBe(false);
                $($(element).find('#modalCloseButton')).click();
                expect($(element).hasClass('ng-hide')).toBe(true);
            });

            it('should close the modal with the button', function() {
                expect($(element).hasClass('ng-hide')).toBe(false);
                $($(element).find('.actionButtonSmall')).click();
                expect($(element).hasClass('ng-hide')).toBe(true);
            });
        });
    });
});
