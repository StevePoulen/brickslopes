describe('GamesService', function() {
    'use strict';

    var mockBackend, GamesService, data;
    var payload;

    beforeEach(module('brickSlopes'));

    beforeEach(inject(function(
        _$httpBackend_,
        _Games_
    ) {
        mockBackend = _$httpBackend_;
        GamesService = _Games_;
    }));

    describe('Games', function() {
        describe('Get', function() {
            beforeEach(function() {
                mockBackend.expectGET('/controllers/paid/games.php?eventId=2').respond(201, window.games);
            });

            it('should get a list of games and awards for an event', function() {
                GamesService.getList(2).then(function(_data_) {
                    data = _data_;
                });

                mockBackend.flush();
                expect(data[0].game).toBe('Blind Man Build');
                expect(data[0].registration).toBe('Open');
                expect(data[0].showCTAButton).toBe(true);
                expect(data[1].game).toBe('Speed Build');
                expect(data[1].description.$$unwrapTrustedValue()).toBe('Build a LEGO Set as fast as you can.');
                expect(data[1].registration).toBe('Closed');
                expect(data[1].showCTAButton).toBe(false);
                expect(data[2].isAwards).toBe(false);
                expect(data[3].isAwards).toBe(false);
            });

            it('should load the game list count', function() {
                GamesService.getCount(2).then(function(_data_) {
                    data = _data_;
                });

                mockBackend.flush();
                expect(data).toBe(4);
            });
        });

        describe('Create', function() {
            beforeEach(function() {
                payload = {
                    eventId: 2,
                    gameId: 2,
                    type: 'PARTICIPANT'
                };
                mockBackend.expectPOST('/controllers/paid/gameUser.php', payload).respond(201);
            });

            it('should get a list of games and awards for an event', function() {
                GamesService.gameRegistration(payload).then(function(_data_) {
                    data = _data_;
                });

                mockBackend.flush();
                expect(data).toBe(201);
            });
        });

        describe('Get UserGames', function() {
            beforeEach(function() {
                mockBackend.expectGET('/controllers/paid/gameUser.php?eventId=2').respond(window.userGames);
            });

            it('should get a list of games and awards for an event', function() {
                GamesService.getUserGameList(2).then(function(_data_) {
                    data = _data_;
                });

                mockBackend.flush();
                expect(data[1].userId).toBe(3);
            });
        });
    });
});
