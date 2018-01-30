describe('Vendor Contact service', function() {
    'use strict';

    var mockBackend, vendorContactService, data, emailJson;

    beforeEach(module('brickSlopes'));

    describe('create', function() {
        beforeEach(inject(function(
            _vendorContactService_,
            _$httpBackend_
        ) {
            emailJson = {
                firstName: 'Steve',
                lastName: 'Poulsen',
                email: 'steve@bs.com',
                comments: 'LEGO is awesome'
            };
            mockBackend = _$httpBackend_;
            vendorContactService = _vendorContactService_;
            mockBackend.expectPOST('/controllers/public/vendorContact.php', emailJson).respond('success');
        }));

        it('should post an email', function() {
            vendorContactService.create(emailJson).then(function(_data) {
                data = _data;
            });

            mockBackend.flush();
            expect(data).toEqual('success');
        });
    });
});
