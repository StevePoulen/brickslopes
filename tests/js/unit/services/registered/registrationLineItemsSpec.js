describe('service', function() {
    'use strict';

    var mockBackend, registrationLineItemsService, data, dto;

    beforeEach(module('brickSlopes'));

    beforeEach(inject(function(
        _$httpBackend_,
        _RegistrationLineItems_
    ) {
        mockBackend = _$httpBackend_;
        registrationLineItemsService = _RegistrationLineItems_;
    }));


    describe('Registration Line Items', function() {
        describe('Get', function() {
            beforeEach(function() {
                mockBackend.expectGET('/controllers/registered/registrationLineItems.php?eventId=2').respond(window.registrationLineItems);
            });

            it('should get registration line items', function() {
                registrationLineItemsService.get().then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data[2].lineItems[0].lineItem).toBe('Event Pass - Brian Pilati');
                expect(data[2].lineItems[5].lineItem).toBe('Event Pass - Ember Pilati');
                expect(data[2].lineItems[6].lineItem).toBe('Event Badge Brick - Ember Pilati');
                expect(data[2].lineItems[7].lineItem).toBe('Vendor Pass - Ember');
                expect(data[2].lineItems[8].lineItem).toBe('Associate Pass - T h');
            });
        });

        describe('Confirm Payment', function() {
            beforeEach(function() {
                dto = Object({
                    registrationLineItemId: 22,
                    userId: 1234,
                    registrationId: 11,
                    eventId: 2
                });
                var payload = dto;
                payload.revoke = 'no';
                mockBackend.expectPATCH('/controllers/admin/payment.php', payload).respond('success');
            });

            it('should patch a registration line item confirm payment', function() {
                registrationLineItemsService.confirmPayment(dto).then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toBe('success');
            });
        });

        describe('Revoke Payment', function() {
            beforeEach(function() {
                dto = Object({
                    registrationLineItemId: 22,
                    userId: 1234,
                    registrationId: 11,
                    eventId: 2
                });
                var payload = dto;
                payload.revoke = 'yes';
                mockBackend.expectPATCH('/controllers/admin/payment.php', payload).respond('success');
            });

            it('should patch a registration line item confirm payment', function() {
                registrationLineItemsService.revokePayment(dto).then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toBe('success');
            });
        });
    });
});
