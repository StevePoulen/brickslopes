describe('service', function() {
    'use strict';

    beforeEach(module('brickSlopes'));

    beforeEach(function() {
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    describe('EmailUs', function() {
        describe('create', function() {
            var mockBackend, loader, data, emailJson;
            beforeEach(inject(function(_$httpBackend_, EmailUs) {
                emailJson = {
                    'firstName': 'Steve',
                    'lastName': 'Poulsen',
                    'email': 'steve@bs.com',
                    'comments': 'LEGO is awesome'
                };
                mockBackend = _$httpBackend_;
                loader = EmailUs;
                mockBackend.expectPOST('/controllers/public/emailUs.php', emailJson).respond('success');
            }));

            it('should post an email', function() {
                var load = loader.create(emailJson);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toEqualData('success');
            });
        });
    });
});
