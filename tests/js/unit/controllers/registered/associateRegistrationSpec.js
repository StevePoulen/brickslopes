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

    describe('associateRegistration Controller', function() {
        var mockBackend, loader, location, response, route;

        beforeEach(inject(function($controller, $rootScope, $location, _$httpBackend_ , $route) {
            route = $route;
            route = {
                current: {
                    params: {
                        eventId: 2,
                        vendorId: 4
                    }
                }
            };
            scope = $rootScope.$new();
            ctrl = $controller('associateRegistration', { $scope: scope, $route: route});
            location = $location;
            mockBackend = _$httpBackend_;
        }));

        describe('Default Values', function() {
            it('should have a displayMessage variable', function() {
                expect(scope.displayMessage).toBeUndefined();
            });

            it('should have an eventId variable ', function() {
                expect(scope.eventId).toBe(2);
            });

            it('should have an vendorId variable ', function() {
                expect(scope.vendorId).toBe(4);
            });
        });

        describe('Close Dialog', function() {
            it('should redirect to the eventPayment page', function() {
                scope.closeDialog();
                expect(location.path()).toBe('/registered/eventPayment.html');
            });
        });

        describe('Create Associate', function() {
            var vendorDTO;
            beforeEach(function() {
                vendorDTO = {
                    eventId: 2,
                    vendorId: 4,
                    firstName: 'Steve',
                    lastName: 'Poulsen',
                    email: 'steve@brickslopes.com',
                    addAfolPass: 'YES'
                }
            });

            it('should create an associate', function() {
                scope.firstName = 'Steve';
                scope.lastName = 'Poulsen';
                scope.email = 'steve@brickslopes.com';
                scope.addAfolPass = 'YES';
                scope.submitRegistration();
                mockBackend.expectPOST('/controllers/registered/vendorAssociates.php', vendorDTO).respond(201);
                mockBackend.flush();
                expect(scope.displayMessage).toBe('Add another Associate or Pay?');
            });

            it('should display an error', function() {
                scope.firstName = 'Steve';
                scope.lastName = 'Poulsen';
                scope.email = 'steve@brickslopes.com';
                scope.addAfolPass = 'YES';
                scope.submitRegistration();
                mockBackend.expectPOST('/controllers/registered/vendorAssociates.php', vendorDTO).respond(400);
                mockBackend.flush();
                expect(scope.displayMessage).toBe('The Vendor Associate travails.');
            });
        });

        describe('Click To Payment', function() {
            it('should click to payment', function() {
                scope.clickPayment();
                expect(location.path()).toBe('/registered/eventPayment.html');
            });
        });
    });
});
