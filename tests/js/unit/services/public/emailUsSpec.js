describe('Email Us service', function() {
    'use strict';

    var mockBackend, emailUsService, data, emailJson;

    beforeEach(module('brickSlopes'));

    describe('EmailUs', function() {
        describe('create', function() {
            beforeEach(inject(function(
                _emailUsService_,
                _$httpBackend_
            ) {
                emailJson = {
                    'firstName': 'Steve',
                    'lastName': 'Poulsen',
                    'email': 'steve@bs.com',
                    'comments': 'LEGO is awesome'
                };
                mockBackend = _$httpBackend_;
                emailUsService = _emailUsService_;
                mockBackend.expectPOST('/controllers/public/emailUs.php', emailJson).respond('success');
            }));

            it('should post an email', function() {
                var load = emailUsService.create(emailJson);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toEqual('success');
            });
        });
    });
});
