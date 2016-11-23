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

    describe('Authentication', function() {
        describe('Login', function() {
            var mockBackend, loader, data, credentials;
            beforeEach(inject(function(_$httpBackend_, Auth) {
                credentials = {
                    'email': 'brian@bs.com',
                    'password': 'LEGO'
                };
                mockBackend = _$httpBackend_;
                loader = Auth;
                var payload = {
                    email: 'brian@bs.com',
                    password: 'LEGO'
                };
                mockBackend.expectPOST('/controllers/public/authentication.php', payload).respond('success');
            }));

            it('should register a user', function() {
                var load = loader.login(credentials);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toEqualData('success');
            });
        });


        describe('Reset', function() {
            var mockBackend, loader, data, credentials;
            beforeEach(inject(function(_$httpBackend_, Auth) {
                credentials = {
                    'email': 'steve@bs.com'
                };
                mockBackend = _$httpBackend_;
                loader = Auth;
                mockBackend.expectPUT('/controllers/public/authentication.php', credentials).respond('success');
            }));

            it('should register a user', function() {
                var load = loader.reset(credentials);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toEqualData('success');
            });
        });

        describe('Update', function() {
            var mockBackend, loader, data, credentials;
            beforeEach(inject(function(_$httpBackend_, Auth) {
                credentials = {
                    'oldPassword': 'oldSecure',
                    'newPassword': 'newSecure'
                };
                mockBackend = _$httpBackend_;
                loader = Auth;
                mockBackend.expectPATCH('/controllers/public/authentication.php', credentials).respond('success');
            }));

            it('should update a user\'s password', function() {
                var load = loader.update(credentials);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toEqualData('success');
            });
        });
    });
});
