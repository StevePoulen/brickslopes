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
                mockBackend.expectGET('/controllers/user.php').respond(singleUser);
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
    });
});