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
                        storeId: 4
                    }
                }
            };
            scope = $rootScope.$new();
            ctrl = $controller('AssociateRegistration', { $scope: scope, $route: route});
            location = $location;
            mockBackend = _$httpBackend_;
        }));

        describe('Default Values', function() {
            it('should have a displayMessage variable', function() {
                expect(scope.displayMessage).toBeUndefined();
            });

            it('should have an addAfolPass variable ', function() {
                expect(scope.addAfolPass).toBe('YES');
            });

            it('should have a showModal variable ', function() {
                expect(scope.showModal).toBe(false);
            });

            it('should have an eventId variable ', function() {
                expect(scope.eventId).toBe(2);
            });

            it('should have an storeId variable ', function() {
                expect(scope.storeId).toBe(4);
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
                    storeId: 4,
                    firstName: 'Steve',
                    lastName: 'Poulsen',
                    email: 'steve@brickslopes.com',
                    addAfolPass: 'YES'
                }
            });

            it('should create an associate', function() {
                scope.registrationForm = {'$setPristine': function() {}};
                scope.firstName = 'Steve';
                scope.lastName = 'Poulsen';
                scope.email = 'steve@brickslopes.com';
                scope.addAfolPass = 'YES';
                scope.submitAssociateRegistration();
                mockBackend.expectPOST('/controllers/registered/vendors/vendorAssociates.php', vendorDTO).respond(201);
                mockBackend.flush();
                expect(scope.displayMessage).toBe('Your Associate Registration has been received.<p>Would you like to add another Associate or Continue to Payment?');
                expect(scope.showModal).toBe(true);
                expect(scope.firstName).toBeUndefined();
                expect(scope.lastName).toBeUndefined();
                expect(scope.email).toBeUndefined();
                expect(scope.addAfolPass).toBe('YES');
            });

            it('should display an error', function() {
                scope.firstName = 'Steve';
                scope.lastName = 'Poulsen';
                scope.email = 'steve@brickslopes.com';
                scope.addAfolPass = 'YES';
                scope.submitAssociateRegistration();
                mockBackend.expectPOST('/controllers/registered/vendors/vendorAssociates.php', vendorDTO).respond(400);
                mockBackend.flush();
                expect(scope.displayMessage).toBe('The Vendor Associate travails.');
                expect(scope.showModal).toBe(true);
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
