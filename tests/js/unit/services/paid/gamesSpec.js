describe('service', function() {
    'use strict';
    beforeEach(module('brickSlopes'));

    beforeEach(inject(function(_EventSelectionFactory_) {
        spyOn(_EventSelectionFactory_, 'getSelectedEvent').andReturn(2);
    }));

    describe('Games', function() {
        describe('Get', function() {
            var mockBackend, service, data, gameDetails, eventId;
            beforeEach(inject(function(_$httpBackend_, Games) {
                eventId = 2;
                mockBackend = _$httpBackend_;
                mockBackend.expectGET('/controllers/paid/games.php?eventId=2').respond(201, games);
                service = Games;
            }));

            it('should get a list of games and awards for an event', function() {
                var load = service.getList(2);

                load.then(function(_data) {
                    data = _data;
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
                var load = service.getCount(2);
                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toBe(4);
            });
        });

        describe('Create', function() {
            var mockBackend, service, data, gameDetails, eventId, payload;
            beforeEach(inject(function(_$httpBackend_, Games) {
                eventId = 2;
                mockBackend = _$httpBackend_;
                payload = {
                    eventId: 2,
                    gameId: 2,
                    type: 'PARTICIPANT'
                };
                mockBackend.expectPOST('/controllers/paid/gameUser.php', payload).respond(201);
                service = Games;
            }));

            it('should get a list of games and awards for an event', function() {
                var load = service.gameRegistration(payload);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toBe(201);
            });
        });

        describe('Get UserGames', function() {
            var mockBackend, service, data;
            beforeEach(inject(function(_$httpBackend_, Games) {
                mockBackend = _$httpBackend_;
                mockBackend.expectGET('/controllers/paid/gameUser.php?eventId=2').respond(userGames);
                service = Games;
            }));

            it('should get a list of games and awards for an event', function() {
                var load = service.getUserGameList(2);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data[1].userId).toBe(3);
            });
        });
    });
});
