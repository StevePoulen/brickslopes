'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function() {
    var scope, ctrl, location;

    beforeEach(
        module(
            'brickSlopes.controllers',
            'brickSlopes.services'
        )
    );

    beforeEach(function() {
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    describe('afolEventRegistration Controller', function() {
        var mockBackend, loader, window, location, route, response;
        beforeEach(inject(function($controller, $rootScope, _$httpBackend_, $location, $route) {
            scope = $rootScope.$new();
            route = $route;
            route = {current: {params: {eventId: 234}}};
            ctrl = $controller('afolEventRegistration', { $scope: scope, $route: route});
            mockBackend = _$httpBackend_;
            response = {'eventId': 234, 'eventName': 'BrickSlopes 2015'};
            mockBackend.expectGET('/controllers/event.php?eventId=234').respond(201, response);
            location = $location;
        }));

        describe('Close Dialog', function() {
            it('should redirect to index page', function() {
                scope.closeDialog();
                expect(location.path()).toBe('/afol/index.html');
            });
        });

        describe('Default Values', function() {
            it('should have a verifying variable', function() {
                expect(scope.verifying).toBe(false);
            });

            it('should have a displayMessage variable', function() {
                expect(scope.displayMessage).toBe('');
            });

            it('should have a timer variable', function() {
                expect(scope.timer).toBe(false);
            });

            it('should have a success variable', function() {
                expect(scope.success).toBe(true);
            });

            it('should have an eventId variable', function() {
                expect(scope.eventId).toBe(234);
            });

            it('should get event details', function() {

                mockBackend.flush();
                expect(scope.eventDetails).toEqualData(response);
            });
        });

        describe('Submit Registration', function() {
            beforeEach(function() {
                scope.badgeLine1 = 'Hello';
                scope.badgeLine2 = 'World';
                scope.meetAndGreet = 'Yes';
                scope.ageVerification = 'Yes';
                scope.comments = "Can't Wait!";
                scope.type = 'afol';
            });

            it('should submit a valid user event registration', function() {
                var dto = {
                    eventId: 234,
                    badgeLine1: 'Hello',
                    badgeLine2: 'World',
                    meetAndGreet: 'Yes',
                    ageVerification: 'Yes',
                    comments: "Can't Wait!",
                    type: 'afol'
                }
                scope.eventRegistration();
                expect(scope.verifying).toBe(true);
                mockBackend.expectPOST('/controllers/eventRegistration.php', dto).respond(201);
                mockBackend.flush();
                expect(location.path()).toBe('/afol/eventMe.html');
                expect(scope.displayMessage).toBe('');
            });

            it('should handle an invalid user event registration', function() {
                var dto = {
                    eventId: 234,
                    badgeLine1: 'Hello',
                    badgeLine2: 'World',
                    meetAndGreet: 'Yes',
                    ageVerification: 'Yes',
                    comments: "Can't Wait!",
                    type: 'afol'
                }
                scope.eventRegistration();
                expect(scope.verifying).toBe(true);
                mockBackend.expectPOST('/controllers/eventRegistration.php', dto).respond(400);
                mockBackend.flush();
                expect(location.path()).toBe('');
                expect(scope.verifying).toBe(false);
                expect(scope.displayMessage).toBe('There was an error submitting your data. Please try again.');
                expect(scope.success).toBe(false);
                expect(scope.timer).toBe(true);
            });
        });
    });
});
