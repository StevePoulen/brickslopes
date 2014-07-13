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
                    'discountDate': '2015-05-16 08:00:00',
                    'cost': '65.00',
                    'discount': '60.00',
                    'meetAndGreetCost': '15.00',
                    'meetAndGreetDiscount': '10.00',
                    'tShirtCost': '20.00',
                    'tShirtDiscount': '15.00'
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
                    ['No Thanks', 'Small', 'Medium', 'Large', 'X-Large', 'XX-Large', 'XXX-Large']
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

            it('should have a eventYear variable', function() {
                expect(scope.eventYear).toBe(undefined);
            });

            it('should have a passDates variable', function() {
                expect(scope.passDates).toBe(undefined);
            });

            it('should have a passType variable', function() {
                expect(scope.passType).toBe(undefined);
            });

            it('should have a meetAndGreet variable', function() {
                expect(scope.meetAndGreet).toBe('YES');
            });

            it('should have a nameBadge variable', function() {
                expect(scope.nameBadge).toBe('NO');
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

            it('should have an registrationId variable', function() {
                expect(scope.registrationId).toBeUndefined();
            });

            it('should have an eventId variable', function() {
                expect(scope.eventId).toBe(2);
            });

            it('should have an isCreate variable', function() {
                expect(scope.isCreate).toBe(true);
            });

            it('should get event details', function() {
                mockBackend.expectGET('/controllers/eventRegistration.php').respond(200, eventRegistration);
                mockBackend.flush();
                expect(scope.eventDetails).toEqualData(response.data);
                expect(scope.discountDate).toEqualData('May 16th, 2015');
                expect(scope.passType).toBe('4-Day');
                expect(scope.passDates).toBe('May 14th thru 17th');
                expect(scope.eventYear).toBe('2015');
                expect(scope.meetAndGreetDinnerDate).toBe('Thursday, May 14th');
            });
        });

        describe('Should redirect a registered user', function() {
            beforeEach(function() {
                mockBackend.expectGET('/controllers/eventRegistration.php').respond(200, eventRegistration);
                mockBackend.flush();
            });

            it('should deserialize a valid user event registration', function() {
                expect(scope.registrationId).toEqualData(27);
                expect(scope.badgeLine2).toBe('Badge Line Two');
                expect(scope.badgeLine3).toBe('Badge Line Three');
                expect(scope.nameBadge).toBe('YES');
                expect(scope.meetAndGreet).toBe('YES');
                expect(scope.ageVerification).toBe('YES');
                expect(scope.tShirtSize).toBe('X-Large');
                expect(scope.comments).toBeUndefined();
            });

            it('should patch a valid user event registration', function() {
                var dto = {
                    registrationId: 27,
                    eventId: 2,
                    badgeLine1: '2015 BrickSlopes',
                    badgeLine2: 'Badge Line Two',
                    badgeLine3: 'Badge Line Three',
                    nameBadge: 'YES',
                    meetAndGreet: 'YES',
                    ageVerification: 'YES',
                    tShirtSize: 'X-Large',
                    //comments: "Can't Wait!",
                    type: 'afol',
                    discountDate: '2015-05-16 08:00:00',
                    eventCost: '65.00',
                    eventDiscount: '60.00',
                    meetAndGreetCost: '15.00',
                    meetAndGreetDiscount: '10.00',
                    tShirtCost: '20.00',
                    tShirtDiscount: '15.00'
                }
                scope.submitRegistration();
                mockBackend.expectPATCH('/controllers/eventRegistration.php', dto).respond(200);
                mockBackend.flush();
            });
        });

        describe('Submit Registration', function() {
            beforeEach(function() {
                scope.eventYear = 2015;
                scope.badgeLine1 = '2015 BrickSlopes';
                scope.badgeLine2 = 'Hello';
                scope.badgeLine3 = 'World';
                scope.nameBadge = 'NO';
                scope.meetAndGreet = 'Yes';
                scope.ageVerification = 'Yes';
                scope.tShirtSize = 'X-Large';
                scope.comments = "Can't Wait!";
                scope.type = 'afol';
            });

            it('should submit a valid user event registration', function() {
                var dto = {
                    eventId: 2,
                    badgeLine1: '2015 BrickSlopes',
                    badgeLine2: 'Hello',
                    badgeLine3: 'World',
                    nameBadge: 'YES',
                    meetAndGreet: 'Yes',
                    ageVerification: 'Yes',
                    tShirtSize: 'X-Large',
                    comments: "Can't Wait!",
                    type: 'afol',
                    discountDate: '2015-05-16 08:00:00',
                    eventCost: '65.00',
                    eventDiscount: '60.00',
                    meetAndGreetCost: '15.00',
                    meetAndGreetDiscount: '10.00',
                    tShirtCost: '20.00',
                    tShirtDiscount: '15.00'
                }
                mockBackend.expectGET('/controllers/eventRegistration.php').respond(200, {});
                mockBackend.flush();
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
                    badgeLine1: '2015 BrickSlopes',
                    badgeLine2: 'Hello',
                    badgeLine3: 'World',
                    nameBadge: 'NO',
                    meetAndGreet: 'Yes',
                    ageVerification: 'Yes',
                    tShirtSize: 'X-Large',
                    comments: "Can't Wait!",
                    type: 'afol'
                }
                scope.submitRegistration();
                expect(scope.verifying).toBe(true);
                mockBackend.expectGET('/controllers/eventRegistration.php').respond(200, {});
                mockBackend.expectPOST('/controllers/eventRegistration.php', dto).respond(400);
                mockBackend.flush();
                expect(location.path()).toBe('');
                expect(scope.verifying).toBe(false);
                expect(scope.displayMessage).toBe('There was an error submitting your data. Please try again.');
                expect(scope.success).toBe(false);
                expect(scope.timer).toBe(true);
            });
        });

        describe('Validate the badgeLine2 and badgeLine3 watcher', function() {
            beforeEach(function() {
                mockBackend.expectGET('/controllers/eventRegistration.php').respond(200, {});
            });

            it('should change the badgeName to YES when badgeLine2 is changed', function() {
                expect(scope.nameBadge).toBe('NO');
                scope.badgeLine2 = "hello";
                scope.$digest();
                expect(scope.nameBadge).toBe('YES');
            });

            it('should change the badgeName to YES when badgeLine3 is changed', function() {
                expect(scope.nameBadge).toBe('NO');
                scope.badgeLine3 = "there";
                scope.$digest();
                expect(scope.nameBadge).toBe('YES');
            });

            it('should change the badgeName to YES when badgeLine2 is empty', function() {
                expect(scope.nameBadge).toBe('NO');
                scope.badgeLine2 = undefined;
                scope.badgeLine3 = "Hello";
                scope.$digest();
                expect(scope.nameBadge).toBe('YES');
            });

            it('should change the badgeName to YES when badgeLine3 is empty', function() {
                expect(scope.nameBadge).toBe('NO');
                scope.badgeLine2 = "Hello";
                scope.badgeLine3 = undefined;
                scope.$digest();
                expect(scope.nameBadge).toBe('YES');
            });

            it('should change the badgeName to NO when badgeLine2 and badgeLine3 is empty', function() {
                scope.nameBadge = 'YES';
                expect(scope.nameBadge).toBe('YES');
                scope.badgeLine2 = undefined;
                scope.badgeLine3 = undefined;
                scope.$digest();
                expect(scope.nameBadge).toBe('NO');
            });
        });
    });
});
