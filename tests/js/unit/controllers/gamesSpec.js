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

    describe('afolEventGames Controller', function() {
        var mockBackend, location;
        beforeEach(inject(function($controller, $rootScope, _$httpBackend_, $location) {
            scope = $rootScope.$new();
            ctrl = $controller('afolEventGames', { $scope: scope});
            mockBackend = _$httpBackend_;
            mockBackend.expectGET('/controllers/registered/games.php?eventId=2').respond(201, games);
            location = $location;
        }));

        describe('Close Dialog', function() {
            it('should redirect to index page', function() {
                scope.closeDialog();
                expect(location.path()).toBe('/afol/index.html');
            });
        });

        describe('Defult Values', function() {
            it('should have an eventId variable', function() {
                expect(scope.eventId).toBe(2);
            });

            it('should have a verifying variable', function() {
                expect(scope.verifying).toBe(false);
            });

            it('should have a showModal variable', function() {
                expect(scope.showModal).toBe(false);
            });

            it('should have an eventId variable', function() {
                expect(scope.gameList).toEqualData([]);
            });

            it('should get game details', function() {
                mockBackend.flush();
                expect(scope.gameList[0].game).toBe('Blind Man Build');
            });
        });
    });

    describe('Game Registration', function() {
        var mockBackend;
        beforeEach(inject(function($controller, $rootScope, _$httpBackend_) {
            scope = $rootScope.$new();
            ctrl = $controller('afolEventGames', { $scope: scope});
            mockBackend = _$httpBackend_;
            var expectedPayload = {
                eventId: 2,
                gameId: 1,
                type: 'PARTICIPANT'
            }
            mockBackend.expectGET('/controllers/registered/games.php?eventId=2').respond(201, games);
            mockBackend.expectPOST('/controllers/registered/gameUser.php', expectedPayload).respond(201);
        }));

        it('should register for a game', function() {
            scope.game = {
                gameId: 1
            }
            scope.clickGameRegistration();
            expect(scope.verifying).toBe(true);
            mockBackend.flush();
            expect(scope.showModal).toBe(true);
            expect(scope.verifying).toBe(false);
        });
    });
});
