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
            });

            it('should load the game list count', function() {
                var load = service.getCount(2);
                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toEqualData(2);
            });
        });

        describe('Create', function() {
            var mockBackend, service, data, gameDetails, eventId, payload;
            beforeEach(inject(function(_$httpBackend_, Games) {
                eventId = 2;
                mockBackend = _$httpBackend_;
                payload = {
                    eventId: 2,
                    gameId: 2
                };
                mockBackend.expectPOST('/controllers/registered/games.php', payload).respond(201);
                service = Games;
            }));

            it('should get a list of games and awards for an event', function() {
                var load = service.create(payload);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toEqualData(201);
            });
        });
    });
});
