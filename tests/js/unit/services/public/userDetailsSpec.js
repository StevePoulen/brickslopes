describe('userDetailsService', function() {
    'use strict';

    var mockBackend, userDetailsService, data, credentials;
    var mockWindow;

    beforeEach(module('brickSlopes'));

    beforeEach(inject(function(
        _$httpBackend_,
        _UserDetails_,
        _$window_
    ) {
        mockBackend = _$httpBackend_;
        userDetailsService = _UserDetails_;
        mockWindow = _$window_;
    }));

    afterEach(function() {
        window.deleteSession(window);
    });

    describe('User Details', function() {
        describe('Get', function() {
            beforeEach(function() {
                mockBackend.expectGET('/controllers/public/user.php').respond(window.singleUser);
            });

            it('should get userdetails', function() {
                userDetailsService.getUser().then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                window.singleUser.memberSince = 'May 16th, 2014';
                expect(data).toEqual(window.singleUser);
            });
        });

        describe('Get All', function() {
            beforeEach(function() {
                mockBackend.expectGET('/controllers/admin/registeredUsers.php').respond(window.registeredUsers);
            });

            it('should load registered users count', function() {
                userDetailsService.getCount(2).then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toBe(2);
            });

            it('should get all userdetails', function() {
                userDetailsService.getAll().then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                window.registeredUsers[0].memberSince = 'May 16th, 2014';
                window.registeredUsers[1].memberSince = 'May 16th, 2013';
                expect(data).toEqual(window.registeredUsers);
            });
        });

        describe('Register', function() {
            beforeEach(function() {
                credentials = {
                    firstName: 'Steve',
                    lastName: 'Poulsen',
                    email: 'steve@bs.com',
                    password: 'LEGO'
                };
                mockBackend.expectPOST('/controllers/public/user.php', credentials).respond('success');
            });

            it('should register a user', function() {
                userDetailsService.register(credentials).then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toBe('success');
            });
        });

        describe('Hide Tour', function() {
            it('should NOT hide (show) the user tour', function() {
                mockBackend.expectGET('/controllers/public/user.php').respond(window.getUser(0));
                userDetailsService.hideTour().then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toBe(false);
            });

            it('should NOT hide the user tour', function() {
                mockBackend.expectGET('/controllers/public/user.php').respond(window.getUser(1));
                userDetailsService.hideTour().then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toBe(true);
            });
        });

        describe('Tour Started', function() {
            beforeEach(function() {
                mockBackend.expectGET('/controllers/public/user.php').respond(window.singleUser);
            });

            it('should determine if a tour is started', function() {
                userDetailsService.getUser();
                mockBackend.flush();

                expect(userDetailsService.tourStarted()).toBe(true);
                expect(userDetailsService.tourStarted()).toBe(false);
            });
        });

        describe('Update Tour', function() {
            beforeEach(function() {
                mockBackend.expectGET('/controllers/public/user.php').respond(window.singleUser);
                mockBackend.expectPATCH('/controllers/registered/tour.php', {
                    tourOption: 'YES'
                }).respond(200);
            });

            it('should update a user tour', function() {
                userDetailsService.getUser();

                userDetailsService.updateTour('YES').then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toBe(200);
            });
        });

        describe('Update Profile', function() {
            beforeEach(function() {
                credentials = {
                    firstName: 'Steve',
                    lastName: 'Poulsen',
                    email: 'steve@bs.com',
                    password: 'LEGO'
                };
                mockBackend.expectPATCH('/controllers/public/user.php', credentials).respond('success');
            });

            it('should update a user', function() {
                userDetailsService.update(credentials).then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toBe('success');
            });
        });

        describe('User Registration Validation', function() {
            it('should validate a user registration', function() {
                mockWindow.sessionStorage.registered = 'YES';
                expect(userDetailsService.isUserRegistered()).toBe(true);
            });

            it('should validate a user is not registered', function() {
                mockWindow.sessionStorage.registered = 'yes';
                expect(userDetailsService.isUserRegistered()).toBe(false);
            });
        });

        describe('User Registration Payment Validation', function() {
            it('should validate a user registration payment', function() {
                mockWindow.sessionStorage.paid = 'YES';
                expect(userDetailsService.isUserPaid()).toBe(true);
            });

            it('should validate a user has not paid for registered', function() {
                mockWindow.sessionStorage.paid = 'yes';
                expect(userDetailsService.isUserPaid()).toBe(false);
            });
        });
    });
});
