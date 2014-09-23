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

    describe('Registration Line Items', function() {
        describe('Get', function() {
            var mockBackend, loader, data, eventId;
            beforeEach(inject(function(_$httpBackend_, RegistrationLineItems) {
                eventId = 2;
                mockBackend = _$httpBackend_;
                loader = RegistrationLineItems;
                mockBackend.expectGET('/controllers/registered/registrationLineItems.php?eventId=2').respond(registrationLineItems);
            }));

            it('should get registration line items', function() {
                var load = loader.get(eventId);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data[2].lineItems[0].lineItem).toEqualData('Event Pass - Brian Pilati');
                expect(data[2].lineItems[5].lineItem).toEqualData('Event Pass - Ember Pilati');
                expect(data[2].lineItems[6].lineItem).toEqualData('Event Badge Brick - Ember Pilati');
                expect(data[2].lineItems[7].lineItem).toEqualData('Vendor Pass - Ember');
                expect(data[2].lineItems[8].lineItem).toEqualData('Associate Pass - T h');
            });
        });

        describe('Confirm Payment', function() {
            var mockBackend, loader, data, dto;
            beforeEach(inject(function(_$httpBackend_, RegistrationLineItems) {
                dto = {
                    registrationLineItemId: 22,
                    userId: 1234,
                    registrationId: 11
                }
                var payload = dto;
                payload.revoke = 'no';
                mockBackend = _$httpBackend_;
                loader = RegistrationLineItems;
                mockBackend.expectPATCH('/controllers/admin/payment.php', payload).respond('success');
            }));

            it('should patch a registration line item confirm payment', function() {
                var load = loader.confirmPayment(dto);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toEqualData('success');
            });
        });

        describe('Revoke Payment', function() {
            var mockBackend, loader, data, dto;
            beforeEach(inject(function(_$httpBackend_, RegistrationLineItems) {
                dto = {
                    registrationLineItemId: 22,
                    userId: 1234,
                    registrationId: 11
                }
                var payload = dto;
                payload.revoke = 'yes';
                mockBackend = _$httpBackend_;
                loader = RegistrationLineItems;
                mockBackend.expectPATCH('/controllers/admin/payment.php', payload).respond('success');
            }));

            it('should patch a registration line item confirm payment', function() {
                var load = loader.revokePayment(dto);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toEqualData('success');
            });
        });
    });
});
