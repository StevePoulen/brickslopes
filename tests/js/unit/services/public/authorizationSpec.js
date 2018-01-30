describe('service', function() {
    'use strict';

    var mockBackend, authService, data, credentials;

    beforeEach(module('brickSlopes'));

    beforeEach(inject(function(
        _Auth_,
        _$httpBackend_
    ) {
        mockBackend = _$httpBackend_;
        authService = _Auth_;
    }));

    describe('Authentication', function() {
        describe('Login', function() {
            beforeEach(function() {
                credentials = {
                    email: 'brian@bs.com',
                    password: 'LEGO'
                };
                var payload = {
                    email: 'brian@bs.com',
                    password: 'LEGO'
                };
                mockBackend.expectPOST('/controllers/public/authentication.php', payload).respond('success');
            });

            it('should register a user', function() {
                authService.login(credentials).then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toEqual('success');
            });
        });


        describe('Reset', function() {
            beforeEach(function() {
                credentials = {
                    email: 'steve@bs.com'
                };
                mockBackend.expectPUT('/controllers/public/authentication.php', credentials).respond('success');
            });

            it('should register a user', function() {
                authService.reset(credentials).then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toEqual('success');
            });
        });

        describe('Update', function() {
            beforeEach(function() {
                credentials = {
                    oldPassword: 'oldSecure',
                    newPassword: 'newSecure'
                };
                mockBackend.expectPATCH('/controllers/public/authentication.php', credentials).respond('success');
            });

            it('should update a user\'s password', function() {
                authService.update(credentials).then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toEqual('success');
            });
        });
    });
});
