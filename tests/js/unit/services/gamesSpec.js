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
                gameDetails = {
                    'userId': '1',
                    'eventId': '2'
                };
                mockBackend = _$httpBackend_;
                service = Games;
            }));

            it('should get a list of games and awards for an event', function() {
                mockBackend.expectGET('/controllers/registered/games.php?eventId=2').respond(201, gameDetails);
                var load = service.get({eventId: 2}, function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toEqualData(gameDetails);
            });

            it('should get a list of games and awards for an event', function() {
                mockBackend.expectGET('/controllers/registered/games.php?eventId=2').respond(403, gameDetails);
                var load = service.get({eventId: 2}, function(_data) {
                    data = "this should never happen";
                }, function(_data) {
                    data = _data.status;
                });

                mockBackend.flush();
                expect(data).toBe(403);
            });
        });
    });
});
