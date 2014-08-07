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

    describe('User Details', function() {
        describe('Get', function() {
            var mockBackend, service, data;
            beforeEach(inject(function(_$httpBackend_, UserDetails) {
                mockBackend = _$httpBackend_;
                service = UserDetails;
                mockBackend.expectGET('/controllers/public/user.php').respond(singleUser);
            }));

            it('should get userdetails', function() {
                var load = service.get();

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                singleUser.memberSince = 'May 16th, 2014'
                expect(data).toEqualData(singleUser);
            });
        });

        describe('Get All', function() {
            var mockBackend, service, data;
            beforeEach(inject(function(_$httpBackend_, UserDetails) {
                mockBackend = _$httpBackend_;
                service = UserDetails;
                mockBackend.expectGET('/controllers/admin/registeredUsers.php').respond(registeredUsers);
            }));

            it('should load registered users count', function() {
                var load = service.getCount(2);
                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toEqualData(2);
            });

            it('should get all userdetails', function() {
                var load = service.getAll();

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                registeredUsers[0].memberSince = 'May 16th, 2014';
                registeredUsers[1].memberSince = 'May 16th, 2013';
                expect(data).toEqualData(registeredUsers);
            });
        });

        describe('Register', function() {
            var mockBackend, service, data, credentials;
            beforeEach(inject(function(_$httpBackend_, UserDetails) {
                credentials = {
                    'firstName': 'Steve',
                    'lastName': 'Poulsen',
                    'email': 'steve@bs.com',
                    'password': 'LEGO'
                };
                mockBackend = _$httpBackend_;
                service = UserDetails;
                mockBackend.expectPOST('/controllers/public/user.php', credentials).respond('success');
            }));

            it('should register a user', function() {
                var load = service.register(credentials);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toEqualData('success');
            });
        });

        describe('Update Profile', function() {
            var mockBackend, service, data, credentials;
            beforeEach(inject(function(_$httpBackend_, UserDetails) {
                credentials = {
                    'firstName': 'Steve',
                    'lastName': 'Poulsen',
                    'email': 'steve@bs.com',
                    'password': 'LEGO'
                };
                mockBackend = _$httpBackend_;
                service = UserDetails;
                mockBackend.expectPATCH('/controllers/public/user.php', credentials).respond('success');
            }));

            it('should update a user', function() {
                var load = service.update(credentials);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toEqualData('success');
            });
        });

        describe('User Registration Validation', function() {
            var service, window;
            beforeEach(inject(function($window, UserDetails) {
                window = $window;
                service = UserDetails;
            }));

            afterEach(function() {
                deleteSession(window);
            });

            it('should validate a user registration', function() {
                window.sessionStorage.registered = 'YES';
                expect(service.isUserRegistered()).toBe(true);
            });

            it('should validate a user is not registered', function() {
                window.sessionStorage.registered = 'yes';
                expect(service.isUserRegistered()).toBe(false);
            });
        });

        describe('User Registration Payment Validation', function() {
            var service, window;
            beforeEach(inject(function($window, UserDetails) {
                window = $window;
                service = UserDetails;
            }));

            afterEach(function() {
                deleteSession(window);
            });

            it('should validate a user registration payment', function() {
                window.sessionStorage.paid = 'YES';
                expect(service.isUserPaid()).toBe(true);
            });

            it('should validate a user has not paid for registered', function() {
                window.sessionStorage.paid = 'yes';
                expect(service.isUserPaid()).toBe(false);
            });
        });
    });
});
