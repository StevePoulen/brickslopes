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
                eventId = 22;
                mockBackend = _$httpBackend_;
                loader = RegistrationLineItems;
                mockBackend.expectGET('/controllers/registrationLineItems.php?eventId=22').respond('success');
            }));

            it('should get registration line items', function() {
                var load = loader.get(eventId);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toEqualData('success');
            });
        });

        describe('Confirm Payment', function() {
            var mockBackend, loader, data, registrationLineItemId;
            beforeEach(inject(function(_$httpBackend_, RegistrationLineItems) {
                registrationLineItemId = 22;
                var payload = {
                    registrationLineItemId: 22,
                    revoke: 'no'
                };
                mockBackend = _$httpBackend_;
                loader = RegistrationLineItems;
                mockBackend.expectPATCH('/controllers/admin/payment.php', payload).respond('success');
            }));

            it('should patch a registration line item confirm payment', function() {
                var load = loader.confirmPayment(registrationLineItemId);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toEqualData('success');
            });
        });

        describe('Revoke Payment', function() {
            var mockBackend, loader, data, registrationLineItemId;
            beforeEach(inject(function(_$httpBackend_, RegistrationLineItems) {
                registrationLineItemId = 22;
                var payload = {
                    registrationLineItemId: 22,
                    revoke: 'yes'
                };
                mockBackend = _$httpBackend_;
                loader = RegistrationLineItems;
                mockBackend.expectPATCH('/controllers/admin/payment.php', payload).respond('success');
            }));

            it('should patch a registration line item confirm payment', function() {
                var load = loader.revokePayment(registrationLineItemId);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toEqualData('success');
            });
        });
    });
});
