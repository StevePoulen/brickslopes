'use strict';

/* jasmine specs for services go here */

describe('service', function() {
    beforeEach(module('brickSlopes.services'));

    beforeEach(function() {
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    describe('Event Registration', function() {
        describe('Create', function() {
            var mockBackend, service, data, eventDetails;
            beforeEach(inject(function(_$httpBackend_, EventRegistration) {
                eventDetails = {
                    'userId': '1',
                    'eventId': '2'
                };
                mockBackend = _$httpBackend_;
                service = EventRegistration;
            }));

            it('should register a user for an event', function() {
                mockBackend.expectPOST('/controllers/eventRegistration.php', eventDetails).respond(201);
                var load = service.submitRegistration(true, eventDetails);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toBe(undefined);
            });

            it('should update a user for an event', function() {
                mockBackend.expectPATCH('/controllers/eventRegistration.php', eventDetails).respond(201);
                var load = service.submitRegistration(false, eventDetails);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toBe(undefined);
            });
        });

        describe('Get', function() {
            var mockBackend, service, eventList;
            beforeEach(inject(function(_$httpBackend_, EventRegistration) {
                mockBackend = _$httpBackend_;
                service = EventRegistration;
                mockBackend.expectGET('/controllers/eventRegistration.php').respond(201, eventRegistration);

                service.get().then(function(_data) {
                    eventList = _data[0];
                });

                mockBackend.flush();
            }));

            it('should have an age verification attribue in eventList', function() {
                expect(eventList.ageVerification).toBe('YES');
            });

            it('should have a type attribue in eventList', function() {
                expect(eventList.type).toBe('AFOL');
            });

            it('should have a paid attribute in eventList', function() {
                expect(eventList.paid).toBe('NO');
            });

            it('should have a name attribute in eventList', function() {
                expect(eventList.name).toBe('BrickSlopes - Salt Lake City');
            });

            it('should have a total attribute in eventList', function() {
                expect(eventList.total).toBe('25.00');
            });

            it('should have a tShirtSize attribute in eventList', function() {
                expect(eventList.tShirtSize).toBe('X-Large');
            });

            it('should have a paidCTA attribute in eventList', function() {
                expect(eventList.paidCTA).toBe(false);
            });

            it('should have a tShirtSize attribute in eventList', function() {
                expect(eventList.meetAndGreet).toBe('YES');
            });

            it('should have a nameBadge attribute in eventList', function() {
                expect(eventList.nameBadge).toBe('YES');
            });

            it('should have a showBadgeLine1 attribute in eventList', function() {
                expect(eventList.showBadgeLine1).toBe(true);
            });

            it('should have a badgeLine1 attribute in eventList', function() {
                expect(eventList.badgeLine1).toBe('2015 BrickSlopes');
            });

            it('should have a showBadgeLine2 attribute in eventList', function() {
                expect(eventList.showBadgeLine2).toBe(true);
            });

            it('should have a badgeLine2 attribute in eventList', function() {
                expect(eventList.badgeLine2).toBe('Badge Line Two');
            });

            it('should have a showBadgeLine3 attribute in eventList', function() {
                expect(eventList.showBadgeLine3).toBe(true);
            });

            it('should have a badgeLine3 attribute in eventList', function() {
                expect(eventList.badgeLine3).toBe('Badge Line Three');
            });

            describe('line items', function() {
                var lineItems, total;
                beforeEach(function() {
                    lineItems = eventList.lineItems.lineItems[0];
                    total = eventList.lineItems.total;
                });

                it('should have a total attribute', function() {
                    expect(total).toBe('25.00');
                });

                it('should have a lineitem attribute', function() {
                    expect(lineItems.lineItem).toBe('T-Shirt');
                });
            });
        });

        describe('Digest Without add-ons', function() {
            var mockBackend, service, eventList;
            beforeEach(inject(function(_$httpBackend_, EventRegistration) {
                mockBackend = _$httpBackend_;
                service = EventRegistration;
            }));

            it('should have no tShirtSize attribute in eventList', function() {
                mockBackend.expectGET('/controllers/eventRegistration.php').respond(eventRegistrationNoTShirt);
                service.get().then(function(_data) {
                    eventList = _data[0];
                });
                mockBackend.flush();
                expect(eventList.tShirtSize).toBe('NO');
            });

            it('should have no meetAndGreet attribute in eventList', function() {
                mockBackend.expectGET('/controllers/eventRegistration.php').respond(eventRegistrationNoMeetAndGreet);
                service.get().then(function(_data) {
                    eventList = _data[0];
                });
                mockBackend.flush();
                expect(eventList.meetAndGreet).toBe('NO');
            });

            it('should have no badgeLine1 attribute in eventList', function() {
                mockBackend.expectGET('/controllers/eventRegistration.php').respond(eventRegistrationNoMeetAndGreet);
                service.get().then(function(_data) {
                    eventList = _data[0];
                });
                mockBackend.flush();
                expect(eventList.showBadgeLine1).toBe(false);
                expect(eventList.badgeLine1).toBe('One');
            });

            it('should have no badgeLine2 attribute in eventList', function() {
                mockBackend.expectGET('/controllers/eventRegistration.php').respond(eventRegistrationNoMeetAndGreet);
                service.get().then(function(_data) {
                    eventList = _data[0];
                });
                mockBackend.flush();
                expect(eventList.showBadgeLine2).toBe(false);
                expect(eventList.badgeLine2).toBe('Two');
            });

            it('should have a badgeLine1 and no badgeLine2 attribute in eventList', function() {
                mockBackend.expectGET('/controllers/eventRegistration.php').respond(eventRegistrationBadgeLineOneOnly);
                service.get().then(function(_data) {
                    eventList = _data[0];
                });
                mockBackend.flush();
                expect(eventList.badgeLine1).toBe('Badge Line One');
                expect(eventList.showBadgeLine1).toBe(true);
                expect(eventList.badgeLine2).toBe('Two');
                expect(eventList.showBadgeLine2).toBe(false);
                expect(eventList.badgeLine3).toBe('Three');
                expect(eventList.showBadgeLine3).toBe(false);
                expect(eventList.badgeLine2).toBe('Two');
                expect(eventList.showBadgeLine2).toBe(false);
            });

            it('should have a paidCTA attribute of true', function() {
                mockBackend.expectGET('/controllers/eventRegistration.php').respond(eventRegistrationPaid);
                service.get().then(function(_data) {
                    eventList = _data[0];
                });
                mockBackend.flush();
                expect(eventList.paidCTA).toBe(true);
            });
        });
    });
});
