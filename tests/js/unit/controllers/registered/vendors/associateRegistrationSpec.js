describe('controllers', function() {
    'use strict';
    var scope, ctrl, location;

    beforeEach(module('brickSlopes'));

    beforeEach(inject(function(_EventSelectionFactory_) {
        spyOn(_EventSelectionFactory_, 'getSelectedEvent').andReturn(2);
    }));

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
                mockBackend.expectGET('/controllers/public/eventDates.php').respond(eventDates);
                mockBackend.expectGET('/controllers/registered/vendors/vendorAssociates.php?eventId=2&storeId=4').respond(201, associatesMock);
                mockBackend.expectGET('/controllers/public/event.php?eventId=2').respond(201, eventDetails);
                mockBackend.flush();
            });

            it('should have an passType', function() {
                expect(scope.passType).toBe('4-Day');
            });

            it('should have an associates collection', function() {
                expect(scope.associates[0].firstName).toBe('Dorthy');
            });

            it('should have a formatted discount date', function() {
                expect(scope.formattedDiscountDate).toBe('March 25th, 2015');
            });

            it('should have a vendorEventCost', function() {
                expect(scope.vendorEventCost).toBe('15.00');
            });

            it('should have a vendorEventDiscount', function() {
                expect(scope.vendorEventDiscount).toBe('10.00');
            });
        });

        describe('Default Values', function() {
            it('should have a displayMessage variable', function() {
                expect(scope.displayMessage).toBeUndefined();
            });

            it('should have an associates collection', function() {
                expect(scope.associates).toEqual([]);
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
                    userId: 5678,
                    firstName: associateDTO.firstName,
                    lastName: associateDTO.lastName,
                    lineItem: 'Event Pass'
                }

                mockBackend.expectGET('/controllers/public/eventDates.php').respond(eventDates);

                mockBackend.expectGET('/controllers/registered/vendors/vendorAssociates.php?eventId=2&storeId=4').respond(201, associatesMock);
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
                expect(scope.associates[3].associateId).toBe(1234);
                expect(scope.associates[3].userId).toBe(5678);
                expect(scope.associates[3].firstName).toBe('Steve');
                expect(scope.associates[3].lastName).toBe('Poulsen');
                expect(scope.associates[3].lineItem).toBe('4-Day Event Pass');
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

        describe('Delete an Associate', function() {
            beforeEach(function() {
                mockBackend.expectGET('/controllers/public/eventDates.php').respond(eventDates);
                mockBackend.expectGET('/controllers/registered/vendors/vendorAssociates.php?eventId=2&storeId=4').respond(201, associatesMock);
                mockBackend.expectGET('/controllers/public/event.php?eventId=2').respond(201, eventDetails);
            });

            it('should create an associate', function() {
                scope.eventId = 2;
                scope.associate = {associateId: 4, userId:23};
                scope.clickDelete();
                mockBackend.expectDELETE('/controllers/registered/vendors/vendorAssociates.php?associateId=4&eventId=2&userId=23').respond(201);
                mockBackend.flush();

                //valid the associates collection
                expect(scope.associates[0].associateId).toBe(2);
                expect(scope.associates[1].associateId).toBe(3);
                expect(scope.associates[2]).toBeUndefined();
            });

            it('should display an error', function() {
                scope.associate = {associateId: 4, userId:3};
                scope.clickDelete();
                mockBackend.expectDELETE('/controllers/registered/vendors/vendorAssociates.php?associateId=4&eventId=2&userId=3').respond(400, {error: 'nothing'});
                mockBackend.flush();
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
