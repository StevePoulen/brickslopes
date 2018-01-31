describe('controllers', function() {
    'use strict';
    var scope, ctrl;

    beforeEach(module('brickSlopes'));

    beforeEach(inject(function(
        _$templateCache_
    ) {
        var template = _$templateCache_.get('partials/registered/eventPayment.html');
        _$templateCache_.put('/partials/registered/eventPayment.html', template);
    }));

    describe('afolEventRegistration Controller', function() {
        var mockBackend, loader, window, location, route;
        beforeEach(inject(function($controller, $rootScope, _$httpBackend_, $location, $route) {
            scope = $rootScope.$new();
            route = $route;
            route = {
                current: {
                    params: {
                        eventId: 2
                    }
                }
            };
            ctrl = $controller('afolEventRegistration', {
                $scope: scope,
                $route: route
            });
            mockBackend = _$httpBackend_;
            mockBackend.expectGET('/controllers/public/eventDates.php').respond(201, eventDates);
            mockBackend.expectGET('/controllers/public/event.php?eventId=2').respond(201, eventDetails);
            location = $location;
        }));

        describe('Close Dialog', function() {
            it('should redirect to index page', function() {
                scope.closeDialog();
                expect(location.path()).toBe('/registered/index.html');
            });
        });

        describe('Default Values', function() {
            it('should have a shirt sizes variable', function() {
                expect(scope.shirtSizes).toEqual(
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

            it('should have a draftOne variable', function() {
                expect(scope.draftOne).toBe('YES');
            });

            it('should have a draftTwo variable', function() {
                expect(scope.draftTwo).toBe('YES');
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
                mockBackend.expectGET('/controllers/registered/eventRegistration.php').respond(200, eventRegistration);
                mockBackend.flush();
                expect(scope.eventDetails.costs.eventCost).toBe('65.00');
                expect(scope.discountDate).toBe('March 25th, 2015');
                expect(scope.passType).toBe('4-Day');
                expect(scope.passDates).toBe('May 14th thru 17th');
                expect(scope.eventYear).toBe('2015');
                expect(scope.meetAndGreetDinnerDate).toBe('Thursday, May 14th');
                expect(scope.draftOneId).toBe(23);
                expect(scope.draftTwoId).toBe(24);
            });
        });

        describe('Should redirect a registered user', function() {
            beforeEach(function() {
                mockBackend.expectGET('/controllers/registered/eventRegistration.php').respond(200, eventRegistration);
                mockBackend.flush();
            });

            it('should deserialize a valid user event registration', function() {
                expect(scope.registrationId).toBe(27);
                expect(scope.badgeLine2).toBe('Owner - Badge Line Two');
                expect(scope.badgeLine3).toBe('Badge Line Three');
                expect(scope.nameBadge).toBe('YES');
                expect(scope.meetAndGreet).toBe('YES');
                expect(scope.draftOne).toBe('YES');
                expect(scope.draftTwo).toBe('YES');
                expect(scope.ageVerification).toBe('YES');
                expect(scope.tShirtSize).toBe('X-Large');
                expect(scope.comments).toBe('This is my comment');
            });

            it('should patch a valid user event registration', function() {
                var dto = {
                    registrationId: 27,
                    eventId: 2,
                    badgeLine1: '2015 BrickSlopes',
                    badgeLine2: 'Owner - Badge Line Two',
                    badgeLine3: 'Badge Line Three',
                    nameBadge: 'YES',
                    meetAndGreet: 'YES',
                    draftOne: 'YES',
                    draftOneId: 23,
                    draftTwo: 'YES',
                    draftTwoId: 24,
                    ageVerification: 'YES',
                    tShirtSize: 'X-Large',
                    comments: 'This is my comment',
                    type: 'afol',
                    discountDate: '2015-03-25 14:23:22',
                    isOwner: 'YES'
                }
                scope.submitRegistration();
                mockBackend.expectPATCH('/controllers/registered/eventRegistration.php', dto).respond(200);
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
                scope.draftOne = 'Yes';
                scope.draftTwo = 'Yes';
                scope.ageVerification = 'Yes';
                scope.tShirtSize = 'X-Large';
                scope.comments = 'Can\'t Wait!';
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
                    draftOne: 'Yes',
                    draftOneId: 23,
                    draftTwo: 'Yes',
                    draftTwoId: 24,
                    ageVerification: 'Yes',
                    tShirtSize: 'X-Large',
                    comments: 'Can\'t Wait!',
                    type: 'afol',
                    discountDate: '2015-03-25 14:23:22',
                    isOwner: 'YES'
                }
                mockBackend.expectGET('/controllers/registered/eventRegistration.php').respond(200, {});
                mockBackend.flush();
                scope.submitRegistration();
                expect(scope.verifying).toBe(true);
                mockBackend.expectPOST('/controllers/registered/eventRegistration.php', dto).respond(201);
                mockBackend.flush();
                expect(location.path()).toBe('/registered/eventPayment.html');
                expect(scope.displayMessage).toBe('');
            });

            it('should handle an invalid user event registration', function() {
                scope.submitRegistration();
                expect(scope.verifying).toBe(true);
                mockBackend.expectGET('/controllers/registered/eventRegistration.php').respond(200, {});
                mockBackend.expectPOST('/controllers/registered/eventRegistration.php').respond(400);
                mockBackend.flush();
                expect(location.path()).toBe('/');
                expect(scope.verifying).toBe(false);
                expect(scope.displayMessage).toBe('There was an error submitting your data. Please try again.');
                expect(scope.success).toBe(false);
                expect(scope.timer).toBe(true);
            });
        });

        describe('Validate the nameBadge watcher', function() {
            beforeEach(function() {
                mockBackend.expectGET('/controllers/registered/eventRegistration.php').respond(200, {});
            });

            it('should change the badgeName to NO and undefined badgeLine1 and badgeLine2', function() {
                scope.badgeLine2 = 'hello';
                scope.badgeLine3 = 'there';
                expect(scope.nameBadge).toBe('NO');
                scope.$digest();
                scope.nameBadge = 'NO';
                scope.$digest();
                expect(scope.nameBadge).toBe('NO');
                expect(scope.badgeLine2).toBeUndefined();
                expect(scope.badgeLine3).toBeUndefined();
            });

            it('should change the badgeName to YES and no change to badgeLine1 and badgeLine2', function() {
                scope.badgeLine2 = 'hello';
                scope.badgeLine3 = 'there';
                expect(scope.nameBadge).toBe('NO');
                scope.$digest();
                scope.nameBadge = 'YES';
                scope.$digest();
                expect(scope.nameBadge).toBe('YES');
                expect(scope.badgeLine2).toBe('hello');
                expect(scope.badgeLine3).toBe('there');
            });
        });

        describe('Validate the badgeLine2 and badgeLine3 watcher', function() {
            beforeEach(function() {
                mockBackend.expectGET('/controllers/registered/eventRegistration.php').respond(200, {});
            });

            it('should change the badgeName to YES when badgeLine2 is changed', function() {
                expect(scope.nameBadge).toBe('NO');
                scope.badgeLine2 = 'hello';
                scope.$digest();
                expect(scope.nameBadge).toBe('YES');
            });

            it('should change the badgeName to YES when badgeLine3 is changed', function() {
                expect(scope.nameBadge).toBe('NO');
                scope.badgeLine3 = 'there';
                scope.$digest();
                expect(scope.nameBadge).toBe('YES');
            });

            it('should change the badgeName to YES when badgeLine2 is empty', function() {
                expect(scope.nameBadge).toBe('NO');
                scope.badgeLine2 = undefined;
                scope.badgeLine3 = 'Hello';
                scope.$digest();
                expect(scope.nameBadge).toBe('YES');
            });

            it('should change the badgeName to YES when badgeLine3 is empty', function() {
                expect(scope.nameBadge).toBe('NO');
                scope.badgeLine2 = 'Hello';
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
