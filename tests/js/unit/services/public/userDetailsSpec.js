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

    describe('User Details', function() {
        describe('Get', function() {
            var mockBackend, service, data;
            beforeEach(inject(function(_$httpBackend_, UserDetails) {
                mockBackend = _$httpBackend_;
                service = UserDetails;
                mockBackend.expectGET('/controllers/public/user.php').respond(singleUser);
            }));

            it('should get userdetails', function() {
                var load = service.getUser();

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
                expect(data).toBe(2);
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
                expect(data).toBe('success');
            });
        });

        describe('Hide Tour', function() {
            var mockBackend, service, data;
            beforeEach(inject(function(_$httpBackend_, UserDetails) {
                mockBackend = _$httpBackend_;
                service = UserDetails;
            }));

            it('should NOT hide (show) the user tour', function() {
                mockBackend.expectGET('/controllers/public/user.php').respond(getUser(0));
                var load = service.hideTour();

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toBe(false);
            });

            it('should NOT hide the user tour', function() {
                mockBackend.expectGET('/controllers/public/user.php').respond(getUser(1));
                var load = service.hideTour();

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toBe(true);
            });
        });

        describe('Tour Started', function() {
            var mockBackend, service, data, user;
            beforeEach(inject(function(_$httpBackend_, UserDetails) {
                mockBackend = _$httpBackend_;
                service = UserDetails;
                mockBackend.expectGET('/controllers/public/user.php').respond(singleUser);
            }));

            it('should determine if a tour is started', function() {
                service.getUser().then(function(_user_) {
                    user = _user_;
                });
                mockBackend.flush();

                expect(service.tourStarted()).toBe(true);
                expect(service.tourStarted()).toBe(false);
            });
        });

        describe('Update Tour', function() {
            var mockBackend, service, data, user;
            beforeEach(inject(function(_$httpBackend_, UserDetails) {
                mockBackend = _$httpBackend_;
                service = UserDetails;
                mockBackend.expectGET('/controllers/public/user.php').respond(singleUser);
                mockBackend.expectPATCH('/controllers/registered/tour.php', {
                    tourOption: 'YES'
                }).respond(200);
            }));

            it('should update a user tour', function() {
                service.getUser().then(function(_user_) {
                    user = _user_;
                });
                var load = service.updateTour('YES');

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toBe(200);
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
                expect(data).toBe('success');
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
