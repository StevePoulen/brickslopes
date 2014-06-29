'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function() {
    var scope, ctrl, location;

    beforeEach(
        module(
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

    describe('afolEventRegistration Controller', function() {
        var mockBackend, loader, window, location, route, response;
        beforeEach(inject(function($controller, $rootScope, _$httpBackend_, $location, $route) {
            scope = $rootScope.$new();
            route = $route;
            route = {current: {params: {eventId: 2}}};
            ctrl = $controller('afolEventRegistration', { $scope: scope, $route: route});
            mockBackend = _$httpBackend_;
            response = {
                data: {
                    'eventId': 2,
                    'eventName': 'BrickSlopes 2015',
                    'discountDate': '2015-05-16 08:00:00'
                }
            };
            mockBackend.expectGET('/controllers/eventDates.php').respond(201, eventDates);
            mockBackend.expectGET('/controllers/event.php?eventId=2').respond(201, response);
            location = $location;
        }));

        describe('Close Dialog', function() {
            it('should redirect to index page', function() {
                scope.closeDialog();
                expect(location.path()).toBe('/afol/index.html');
            });
        });

        describe('Default Values', function() {
            it('should have a shirt sizes variable', function() {
                expect(scope.shirtSizes).toEqualData(
                    ['No Thanks', 'Small', 'Medium', 'Large', 'X-Large', 'XX-Large']
                );
            });

            it('should have a default tShirtSize variable', function() {
                expect(scope.tShirtSize).toBe('X-Large');
            });

            it('should have a verifying variable', function() {
                expect(scope.verifying).toBe(false);
            });

            it('should have a displayMessage variable', function() {
                expect(scope.displayMessage).toBe('');
            });

            it('should have a discountDate variable', function() {
                expect(scope.discountDate).toBe(undefined);
            });

            it('should have a passDates variable', function() {
                expect(scope.passDates).toBe(undefined);
            });

            it('should have a passType variable', function() {
                expect(scope.passType).toBe(undefined);
            });

            it('should have a meetAndGreetDinnerDate variable', function() {
                expect(scope.meetAndGreetDinnerDate).toBe(undefined);
            });

            it('should have a timer variable', function() {
                expect(scope.timer).toBe(false);
            });

            it('should have a success variable', function() {
                expect(scope.success).toBe(true);
            });

            it('should have an eventId variable', function() {
                expect(scope.eventId).toBe(2);
            });

            it('should get event details', function() {
                mockBackend.flush();
                expect(scope.eventDetails).toEqualData(response.data);
                expect(scope.discountDate).toEqualData('May 16th, 2015');
                expect(scope.passType).toBe('4-Day');
                expect(scope.passDates).toBe('May 14th thru 17th');
                expect(scope.meetAndGreetDinnerDate).toBe('Thursday, May 14th');
            });
        });

        describe('Submit Registration', function() {
            beforeEach(function() {
                scope.badgeLine1 = 'Hello';
                scope.badgeLine2 = 'World';
                scope.meetAndGreet = 'Yes';
                scope.ageVerification = 'Yes';
                scope.tShirtSize = 'X-Large';
                scope.comments = "Can't Wait!";
                scope.type = 'afol';
            });

            it('should submit a valid user event registration', function() {
                var dto = {
                    eventId: 2,
                    badgeLine1: 'Hello',
                    badgeLine2: 'World',
                    meetAndGreet: 'Yes',
                    ageVerification: 'Yes',
                    tShirtSize: 'X-Large',
                    comments: "Can't Wait!",
                    type: 'afol'
                }
                scope.submitRegistration();
                expect(scope.verifying).toBe(true);
                mockBackend.expectPOST('/controllers/eventRegistration.php', dto).respond(201);
                mockBackend.flush();
                expect(location.path()).toBe('/afol/eventPayment.html');
                expect(scope.displayMessage).toBe('');
            });

            it('should handle an invalid user event registration', function() {
                var dto = {
                    eventId: 2,
                    badgeLine1: 'Hello',
                    badgeLine2: 'World',
                    meetAndGreet: 'Yes',
                    ageVerification: 'Yes',
                    tShirtSize: 'X-Large',
                    comments: "Can't Wait!",
                    type: 'afol'
                }
                scope.submitRegistration();
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
