describe('controllers', function() {
    'use strict';
    var scope, controller;
    var mockBackend, location;

    beforeEach(module('brickSlopes'));

    beforeEach(inject(function(
        _$controller_,
        _$rootScope_,
        _$httpBackend_,
        _$location_
    ) {
        scope = _$rootScope_.$new();
        controller = _$controller_;
        mockBackend = _$httpBackend_;
        location = _$location_;
    }));

    describe('afolEventGames Controller', function() {
        beforeEach(function() {
            controller('afolEventGames', {
                $scope: scope
            });
            mockBackend.expectGET('/controllers/paid/games.php?eventId=2').respond(201, window.games);
            mockBackend.expectGET('/controllers/paid/gameUser.php?eventId=2').respond(window.userGames);
        });

        describe('Close Dialog', function() {
            it('should redirect to index page', function() {
                scope.closeDialog();
                expect(location.path()).toBe('/registered/index.html');
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
                expect(scope.gameList).toEqual([]);
            });

            it('should have an userGameList variable', function() {
                expect(scope.userGameList).toEqual([]);
            });

            it('should get game details', function() {
                mockBackend.flush();
                expect(scope.gameList[0].game).toBe('Blind Man Build');
                expect(scope.userGameList[1].userId).toBe(3);
            });
        });
    });

    describe('Game Registration', function() {
        beforeEach(function() {
            controller('afolEventGames', {
                $scope: scope
            });
            var expectedPayload = Object({
                eventId: 2,
                gameId: 1,
                type: 'PARTICIPANT'
            });
            mockBackend.expectGET('/controllers/paid/games.php?eventId=2').respond(201, window.games);
            mockBackend.expectGET('/controllers/paid/gameUser.php?eventId=2').respond(window.userGames);
            mockBackend.expectPOST('/controllers/paid/gameUser.php', expectedPayload).respond(201);
        });

        it('should register for a game', function() {
            scope.game = Object({
                gameId: 1,
                fee: 'NO'
            });
            scope.clickGameRegistration();
            expect(scope.verifying).toBe(true);
            mockBackend.flush();
            expect(scope.showModal).toBe(true);
            expect(scope.verifying).toBe(false);
            expect(location.path()).toBe('/');
        });

        it('should register for a game and redirect to payments', function() {
            scope.game = Object({
                gameId: 1,
                fee: 'YES'
            });
            scope.clickGameRegistration();
            expect(scope.verifying).toBe(true);
            mockBackend.flush();
            expect(scope.showModal).toBe(false);
            expect(scope.verifying).toBe(false);
            expect(location.path()).toBe('/registered/eventPayment.html');
        });
    });

    describe('Game Deletion', function() {
        beforeEach(function() {
            controller('afolEventGames', {
                $scope: scope
            });
            mockBackend.expectGET('/controllers/paid/games.php?eventId=2').respond(201, window.games);
            mockBackend.expectGET('/controllers/paid/gameUser.php?eventId=2').respond(window.userGames);
            mockBackend.expectDELETE('/controllers/paid/gameUser.php?eventId=2&gameId=1').respond();
        });

        it('should delete a game', function() {
            scope.game = Object({
                gameId: 1
            });
            scope.clickGameDeletion();
            expect(scope.verifying).toBe(true);
            mockBackend.flush();
            expect(scope.showModal).toBe(true);
            expect(scope.verifying).toBe(false);
            expect(scope.userGameList['1'].eventId).toBe(2);
        });
    });
});
