describe('Factory', function() {
    'use strict';

    var mockBackend, service, data;

    beforeEach(module('brickSlopes'));

    beforeEach(inject(function(_$httpBackend_, RegisteredGames) {
        mockBackend = _$httpBackend_;
        service = RegisteredGames;
    }));

    describe('Registered Games', function() {
        describe('Get', function() {
            beforeEach(function() {
                mockBackend.expectGET('/controllers/admin/registeredGames.php?eventId=2').respond(201, registeredGames);
            });

            it('should load registered games count', function() {
                var load = service.getCount(2);
                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toBe(3);
            });

            it('should get all of the registered games', function() {
                var load = service.get(2);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toEqual(registeredGames);
            });
        });

        describe('Get - No Games', function() {
            beforeEach(function() {
                mockBackend.expectGET('/controllers/admin/registeredGames.php?eventId=2').respond(201, []);
            });

            it('should load registered games count', function() {
                var load = service.getCount(2);
                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toEqual(0);
            });

            it('should get all of the registered games', function() {
                var load = service.get(2);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toEqual([]);
            });
        });
    });
});
