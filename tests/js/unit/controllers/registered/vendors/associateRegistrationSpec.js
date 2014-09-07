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

        describe('Digest Values', function() {
            beforeEach(function() {
                mockBackend.expectGET('/controllers/registered/vendors/vendorAssociates.php?eventId=2&storeId=4').respond(201, associates);
                mockBackend.expectGET('/controllers/public/event.php?eventId=2').respond(201, eventDetails);
                mockBackend.flush();
            });

            it('should have an associates collection', function() {
                expect(scope.associates[0].firstName).toEqualData('Dorthy');
            });

            it('should have a formatted discount date', function() {
                expect(scope.formattedDiscountDate).toEqualData('March 25th, 2015');
            });

            it('should have a vendorEventCost', function() {
                expect(scope.vendorEventCost).toEqualData('15.00');
            });

            it('should have a vendorEventDiscount', function() {
                expect(scope.vendorEventDiscount).toEqualData('10.00');
            });
        });

        describe('Default Values', function() {
            it('should have a displayMessage variable', function() {
                expect(scope.displayMessage).toBeUndefined();
            });

            it('should have an associates collection', function() {
                expect(scope.associates).toEqualData([]);
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
            var associateDTO, response;
            beforeEach(function() {
                associateDTO = {
                    eventId: 2,
                    storeId: 4,
                    firstName: 'Steve',
                    lastName: 'Poulsen',
                    email: 'steve@brickslopes.com',
                    addAfolPass: 'YES'
                }

                response = {
                    associateId: 1234,
                    firstName: associateDTO.firstName,
                    lastName: associateDTO.lastName
                }

                mockBackend.expectGET('/controllers/registered/vendors/vendorAssociates.php?eventId=2&storeId=4').respond(201, associates);
                mockBackend.expectGET('/controllers/public/event.php?eventId=2').respond(201, eventDetails);
            });

            it('should create an associate', function() {
                scope.registrationForm = {'$setPristine': function() {}};
                scope.firstName = 'Steve';
                scope.lastName = 'Poulsen';
                scope.email = 'steve@brickslopes.com';
                scope.addAfolPass = 'YES';
                scope.submitAssociateRegistration();
                mockBackend.expectPOST('/controllers/registered/vendors/vendorAssociates.php', associateDTO).respond(201, response);
                mockBackend.flush();
                expect(scope.displayMessage.$$unwrapTrustedValue()).toBe('Your Associate Registration has been received.<p>Would you like to add another Associate or Continue to Payment?');
                expect(scope.showModal).toBe(true);
                expect(scope.modalTitle).toBe('Success');
                expect(scope.firstName).toBeUndefined();
                expect(scope.lastName).toBeUndefined();
                expect(scope.email).toBeUndefined();
                expect(scope.addAfolPass).toBe('YES');

                //valid the associates collection
                expect(scope.associates[1].associateId).toBe(1234);
                expect(scope.associates[1].firstName).toBe('Steve');
                expect(scope.associates[1].lastName).toBe('Poulsen');
            });

            it('should display an error', function() {
                scope.firstName = 'Steve';
                scope.lastName = 'Poulsen';
                scope.email = 'steve@brickslopes.com';
                scope.addAfolPass = 'YES';
                scope.submitAssociateRegistration();
                mockBackend.expectPOST('/controllers/registered/vendors/vendorAssociates.php', associateDTO).respond(400, {error: 'nothing'});
                mockBackend.flush();
                expect(scope.displayMessage.$$unwrapTrustedValue()).toBe('The Vendor Associate travails.');
                expect(scope.modalTitle).toBe('Error');
                expect(scope.showModal).toBe(true);
            });

            it('should display an error on a self add', function() {
                scope.firstName = 'Steve';
                scope.lastName = 'Poulsen';
                scope.email = 'steve@brickslopes.com';
                scope.addAfolPass = 'YES';
                scope.submitAssociateRegistration();
                mockBackend.expectPOST('/controllers/registered/vendors/vendorAssociates.php', associateDTO).respond(412, {error: 'selfie'});
                mockBackend.flush();
                expect(scope.modalTitle).toBe('Error');
                expect(scope.displayMessage.$$unwrapTrustedValue()).toBe('You may not add yourself as an associate of your own store.');
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
