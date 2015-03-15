'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function() {
    var scope, ctrl, location;

    beforeEach(module('Admin'));

    describe('adminRegisteredGames Controller', function() {
        var mockBackend;
        beforeEach(inject(function($controller, $rootScope, $location, _$httpBackend_) {
            scope = $rootScope.$new();
            ctrl = $controller('adminRegisteredGames', { $scope: scope});
            location = $location;
            mockBackend = _$httpBackend_;
            mockBackend.expectGET('/controllers/admin/registeredGames.php?eventId=2').respond(201, registeredGames);
        }));

        describe('Close Dialog', function() {
            it('should redirect to index page', function() {
                scope.closeDialog();
                expect(location.path()).toBe('/admin/index.html');
            });
        });

        describe('Default Variables', function() {
            it('should have a predicate variable', function() {
                expect(scope.predicate).toBe('gameName');
            });

            it('should have a reverse variable', function() {
                expect(scope.reverse).toBe(false);
            });

            it('should have a showModal variable', function() {
                expect(scope.showModal).toBe(false);
            });

            it('should have an eventId variable', function() {
                expect(scope.eventId).toBe(2);
            });

            it('should have an eventName variable', function() {
                expect(scope.eventId).toBeUndefined;
            });

            it('should have an eventName variable', function() {
                mockBackend.flush();
                expect(scope.registeredGames).toEqual(registeredGames);
            });
        });
    });
});
