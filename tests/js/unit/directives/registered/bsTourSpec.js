describe('directives', function() {
    'use strict';
    var scope, element, mockBackend;

    beforeEach(module('brickSlopes.directives'));

    beforeEach(inject(function(_EventSelectionFactory_) {
        spyOn(_EventSelectionFactory_, 'getSelectedEvent').andReturn(2);
    }));

    describe('bsTour', function() {
        beforeEach(inject(function($compile, $rootScope, $templateCache, _$httpBackend_) {
            mockBackend = _$httpBackend_;
            var template = $templateCache.get('app/partials/directives/tour.html');
            $templateCache.put('partials/directives/tour.html', template);
            scope = $rootScope.$new();
            element = angular.element('<div id="tourMask"></div><bs-tour></bs-tour>');
            $compile(element)(scope);
        }));

        describe('Default variables', function() {
            beforeEach(function() {
                scope.$digest();
                spyOn(scope, "initializeMask");
            });

            it('should have isHideTour to be false', function() {
                expect(scope.isHideTour).toBe(true);
            });

            it('should have isHideTour to be false', function() {
                expect(scope.buttonText).toBe('Next');
            });

            it('should have stepDisplay variable', function() {
                expect(scope.stepDisplay).toBe('Step 1 of 8');
            });
        });

        describe('The Tour', function() {
            it('should show the tour', inject(function(_$rootScope_, _$timeout_) {
                var rootScope = _$rootScope_.$new();
                mockBackend.expectGET('/controllers/public/user.php').respond(singleUser);
                mockBackend.expectGET('/controllers/public/event.php?eventId=2').respond(eventDetails);
                scope.$digest();
                spyOn(scope, "initializeMask");
                rootScope.$emit('show-tour');
                _$timeout_.flush();
                mockBackend.flush();
                expect(scope.initializeMask).toHaveBeenCalled();
                expect($(element).hasClass('ng-hide')).toBe(false);
                expect(scope.isHideTour).toBe(false);
                expect(scope.tourUserName).toBe('Steve');
                expect(scope.eventName).toBe('BrickSlopes 2015');
                expect(scope.eventYear).toBe('2015');
                expect(scope.discountDate).toBe('March 25th, 2015');
            }));

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
            it('should hide the tour', inject(function(_UserDetails_) {
                mockBackend.expectGET('/controllers/public/user.php').respond(singleUser);
                _UserDetails_.getUser();
                mockBackend.expectPATCH('/controllers/registered/tour.php').respond(200);
                scope.$digest();
                $(element).find('input').click();
                mockBackend.flush();
            }));
        });

        describe('Click the button', function() {
            it('should increment the tour step', function() {
                scope.$digest();
                spyOn(scope, "nextStep");
                scope.buttonClick();
                expect(scope.nextStep).toHaveBeenCalled();
            });
        });
    });
});
