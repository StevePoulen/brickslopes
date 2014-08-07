'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function() {
    var scope, ctrl, location;

    beforeEach (
        module (
            'brickSlopes.controllers'
        )
    );

    beforeEach(function() {
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    describe('afolEditProfile Controller', function() {
        var mockBackend, loader;
        beforeEach(inject(function($controller, $rootScope, $location, _$httpBackend_) {
            scope = $rootScope.$new();
            ctrl = $controller('afolEditProfile', { $scope: scope});
            location = $location;
            mockBackend = _$httpBackend_;
        }));

        describe('Close Dialog', function() {
            it('should redirect to admin index page', function() {
                scope.closeDialog();
                expect(location.path()).toBe('/registered/eventMe.html');
            });
        });

        describe('Default Values', function() {
            it('should have a userObject variable', function() {
                expect(scope.userObject).toBeUndefined();
            });

            it('should have a verifying variable', function() {
                expect(scope.verifying).toBe(false);
            });

            it('should have a displayErrorMessage variable', function() {
                expect(scope.displayErrorMessage).toBe("");
            });

            it('should hydrate the userObject variable', function() {
                mockBackend.expectGET('/controllers/public/user.php').respond(200, singleUser);
                mockBackend.flush();
                singleUser.memberSince = 'May 16th, 2014';
                expect(scope.userObject).toEqualData(singleUser);
            });
        });

        describe('Update Profile', function() {
            beforeEach(function() {
                scope.userObject = singleUser;
                scope.submitProfile();
                mockBackend.expectGET('/controllers/public/user.php').respond(400, singleUser);
                mockBackend.expectPATCH('/controllers/public/user.php').respond(201, sessionData);
                mockBackend.flush();
            });

            it('should update an existing user', function() {
                expect(location.path()).toBe('/registered/eventMe.html');
            });

            it('should have a blank displayErrorMessage', function() {
                expect(scope.displayErrorMessage).toBe("");
            });

            it('should have a true verifying message', function() {
                expect(scope.verifying).toBe(false);
            });

            it('should have a window.sessionStorage.token variables', function() {
                expect(window.sessionStorage.token).toBe('1234567890');
            });

            it('should have a window.sessionStorage.firstName variables', function() {
                expect(window.sessionStorage.firstName).toBe('Ember');
            });

            it('should have a window.sessionStorage.lastName variables', function() {
                expect(window.sessionStorage.lastName).toBe('Pilati');
            });

            it('should have a window.sessionStorage.admin variables', function() {
                expect(window.sessionStorage.admin).toBe('NO');
            });

            it('should have a window.sessionStorage.registered variables', function() {
                expect(window.sessionStorage.registered).toBe('YES');
            });

            it('should have a window.sessionStorage.paid variables', function() {
                expect(window.sessionStorage.paid).toBe('YES');
            });

            it('should have a window.sessionStorage.userId variables', function() {
                expect(window.sessionStorage.userId).toBe('080898');
            });
        });

        describe('Update - Email in use', function() {
            it('should redirect for an existing user', function() {
                scope.userObject = singleUser;
                scope.submitProfile();
                expect(scope.verifying).toBe(true);
                var response = {
                    data: 'Duplicate E-mail',
                    status: 400
                }

                mockBackend.expectGET('/controllers/public/user.php').respond(400, singleUser);
                mockBackend.expectPATCH('/controllers/public/user.php').respond(400, response);
                mockBackend.flush();
                expect(location.path()).toBe('');
                expect(scope.verifying).toBe(false);
                expect(scope.displayErrorMessage).toBe('The email is already in our system.');
            });
        });

    });
});

