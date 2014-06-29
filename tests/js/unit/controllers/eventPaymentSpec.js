'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function() {
    var scope, ctrl, location;

    beforeEach(
        module(
            'brickSlopes.controllers',
            'app/partials/afol/eventPayment.html'
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
            it('should have an registrationLineItems variable ', function() {
                expect(scope.registrationLineItems).toBe(undefined);
            });

            it('should have an eventId variable ', function() {
                expect(scope.eventId).toBe(2);
            });

            it('should have an totalAmount variable ', function() {
                expect(scope.totalAmount).toBe(0);
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
                mockBackend.expectGET('/controllers/registrationLineItems.php?eventId=2').respond(registrationLineItems);
                mockBackend.flush();
            });

            it('should populate the registrationLineItem variable', function() {
                expect(scope.registrationLineItems).toEqualData(registrationLineItems[2]);
            });

            it('should have an totalAmount variable ', function() {
                expect(scope.totalAmount).toBe(100.00);
            });
        });
    });
});
