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

    describe('afolAdmin Controller', function() {
        var mockBackend;
        beforeEach(inject(function($controller, $rootScope, $location, _$httpBackend_) {
            scope = $rootScope.$new();
            ctrl = $controller('afolAdmin', { $scope: scope});
            location = $location;
            mockBackend = _$httpBackend_;
            mockBackend.expectGET('/controllers/admin/registeredUsers.php').respond(201, registeredUsers);
            mockBackend.expectGET('/controllers/registeredAfols.php?eventId=2').respond(201, registeredAfols);
        }));

        describe('Default Variables', function() {
            it('should have a userCount variable', function() {
                expect(scope.userCount).toBe(0);
            });

            it('should have a registeredCount variable', function() {
                expect(scope.registeredCount).toBe(0);
            });

            it('should have an eventId variable', function() {
                expect(scope.eventId).toBe(2);
            });

            it('should have a userCount variable', function() {
                mockBackend.flush();
                expect(scope.userCount).toBe(2);
            });

            it('should have a registeredCount variable', function() {
                mockBackend.flush();
                expect(scope.registeredCount).toBe(2);
            });
        });

        describe('Click Registrations', function() {
            it('should redirect to the registeredAfols page', function() {
                scope.clickRegistrations();
                expect(location.path()).toBe('/admin/registeredAfols.html');
            });
        });

        describe('Click Users', function() {
            it('should redirect to the registeredUsers page', function() {
                scope.clickUsers();
                expect(location.path()).toBe('/admin/registeredUsers.html');
            });
        });
    });
});
