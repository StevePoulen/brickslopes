'use strict';

/* jasmine specs for directives go here */

describe('directives', function() {
    beforeEach(
        module(
            'brickSlopes.directives',
            'brickSlopes.services',
            'app/partials/directives/tour.html'
        )
    );

    var scope, element, mockBackend;

    describe('bsTour', function() {
        beforeEach(inject(function($compile, $rootScope, $templateCache, _$httpBackend_) {
            mockBackend = _$httpBackend_;
            var template = $templateCache.get('app/partials/directives/tour.html');
            $templateCache.put('partials/directives/tour.html', template);
            scope = $rootScope.$new();
            spyOn(scope, "initializeMask");
            element = angular.element('<div id="tourMask"></div><bs-tour></bs-tour>');
            element = $compile(element)(scope);
        }));

        describe('Default variables', function() {
            beforeEach(function() {
                mockBackend.expectGET('/controllers/public/user.php').respond(singleUser);
                scope.$digest();
            });

            it('should have isHideTour to be false', function() {
                expect(scope.isHideTour).toBe(true);
            });

            it('should have isHideTour to be false', function() {
                expect(scope.buttonText).toBe('Next');
            });
        });

        describe('The Tour', function() {
            it('should show the tour', function() {
                mockBackend.expectGET('/controllers/public/user.php').respond(singleUser);
                scope.$digest();
                mockBackend.flush();
                expect($(element).hasClass('ng-hide')).toBe(false);
                expect($(element).find('div.tourText').html()).toBe('Hello World');
            });

            it('should show the tour', function() {
                mockBackend.expectGET('/controllers/public/user.php').respond(getUser(1));
                mockBackend.flush();
                expect($(element).hasClass('ng-hide')).toBe(true);
                expect($(element).find('div.tourText').html()).toBe('Hello World');
            });
        });

        describe('Close (hide) the tour', function() {
            it('should hide the tour', function() {
                mockBackend.expectGET('/controllers/public/user.php').respond(getUser(1));
                scope.$digest();
                scope.isHideTour = false;
                $(element).find('div#modalCloseButton').click();
                expect(scope.isHideTour).toBe(true);
            });
        });

        describe('Turn off the tour', function() {
            it('should hide the tour', function() {
                mockBackend.expectGET('/controllers/public/user.php').respond(getUser(0));
                scope.$digest();
                mockBackend.expectPATCH('/controllers/registered/tour.php').respond(200);
                $(element).find('div.actionButtonSmall').click();
                mockBackend.flush();
            });
        });
    });
});
