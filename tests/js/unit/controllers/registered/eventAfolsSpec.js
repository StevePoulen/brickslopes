describe('controllers', function() {
    'use strict';
    var scope, ctrl, location;

    beforeEach(module('brickSlopes'));

    beforeEach(inject(function(_EventSelectionFactory_) {
        spyOn(_EventSelectionFactory_, 'getSelectedEvent').andReturn(2);
    }));

    describe('eventAfols Controller', function() {
        var mockBackend;
        beforeEach(inject(function($controller, $rootScope, $location, _$httpBackend_) {
            scope = $rootScope.$new();
            ctrl = $controller('eventAfols', { $scope: scope});
            location = $location;
            mockBackend = _$httpBackend_;
            mockBackend.expectGET('/controllers/registered/registeredAfols.php?eventId=2').respond(201, registeredAfols);
        }));

        describe('Close Dialog', function() {
            it('should redirect to index page', function() {
                scope.closeDialog();
                expect(location.path()).toBe('/registered/index.html');
            });
        });

        describe('Default Variables', function() {
            it('should have an eventId variable', function() {
                expect(scope.eventId).toBe(2);
            });

            it('should have an eventName variable', function() {
                expect(scope.eventName).toBeUndefined;
            });

            it('should have an eventName variable', function() {
                mockBackend.flush();
                expect(scope.registeredAfols).toEqual(registeredAfols['2']['registeredAfols']);
            });

            it('should have a registeredAfols lisit', function() {
                mockBackend.flush();
                expect(scope.eventName).toBe('BrickSlopes - Salt Lake City');
            });
        });

    });
});
