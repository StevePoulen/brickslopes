'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function() {
    var scope, ctrl, location;

    beforeEach(
        module(
            'brickSlopes.controllers'
        )
    );

    beforeEach(function() {
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    describe('afolEventPayment Controller', function() {
        var mockBackend, loader, window, location, response;
        beforeEach(inject(function($controller, $rootScope, $location, _$httpBackend_ ) {
            scope = $rootScope.$new();
            ctrl = $controller('afolEventPayment', { $scope: scope});
            location = $location;
            mockBackend = _$httpBackend_;
        }));

        describe('Default Values', function() {
            it('should have an eventData variable ', function() {
                expect(scope.eventData).toBe(undefined);
            });
        });

        describe('Close Dialog', function() {
            it('should redirect to index page', function() {
                scope.closeDialog();
                expect(location.path()).toBe('/afol/index.html');
            });
        });

        describe('Digest', function() {
            beforeEach(function() {
                mockBackend.expectGET('/controllers/eventRegistration.php').respond(eventRegistration);
                mockBackend.flush();
            });

            it('should populate the eventData variable', function() {
                expect(scope.eventData).toEqualData(eventRegistration);
            });
        });
    });
});
