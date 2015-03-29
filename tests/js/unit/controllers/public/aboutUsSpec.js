'use strict';

/* jasmine specs for controllers go here */

describe('About Us controllers', function() {
    var scope, ctrl;

    beforeEach (module('Public'));

    describe('aboutUs Controller', function() {
        var mockBackend;
        beforeEach(inject(function($controller, $rootScope) {
            scope = $rootScope.$new();
            var route = {
                current: {
                    params: {
                        eventId: 22
                    }
                }
            };
            ctrl = $controller('aboutUs', {
                $scope: scope,
                $route: route
            });
        }));

        describe('Default Variables', function() {
            it('should have an eventID variable', function() {
                expect(scope.eventId).toBe(22);
            });
        });
    });
});
