'use strict';

/* jasmine specs for services go here */

describe('service', function() {
    beforeEach(module('brickSlopes.services'));

    beforeEach(function() {
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    describe('Games', function() {
        describe('Get', function() {
            var mockBackend, service, data, gameDetails, eventId;
            beforeEach(inject(function(_$httpBackend_, Games) {
                eventId = 2;
                mockBackend = _$httpBackend_;
                mockBackend.expectGET('/controllers/registered/games.php?eventId=2').respond(201, games);
                service = Games;
            }));

            it('should get a list of games and awards for an event', function() {
                var load = service.getList(2);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data[0].game).toEqualData('Blind Man Build');
                expect(data[0].registration).toBe('Open');
                expect(data[0].showCTAButton).toBe(true);
                expect(data[1].game).toBe('Speed Build');
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
                expect(data).toEqualData(4);
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
                mockBackend.expectPOST('/controllers/registered/gameUser.php', payload).respond(201);
                service = Games;
            }));

            it('should get a list of games and awards for an event', function() {
                var load = service.gameRegistration(payload);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toEqualData(201);
            });
        });
    });
});
