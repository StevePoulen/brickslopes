describe('Factory', function() {
    'use strict';

    beforeEach(module('brickSlopes'));
    beforeEach(inject(function(_EventSelectionFactory_) {
        spyOn(_EventSelectionFactory_, 'getSelectedEvent').andReturn(2);
    }));

    describe('Registered Games', function() {
        describe('Get', function() {
            var mockBackend, service, data;
            beforeEach(inject(function(_$httpBackend_, RegisteredGames) {
                mockBackend = _$httpBackend_;
                service = RegisteredGames;
                mockBackend.expectGET('/controllers/admin/registeredGames.php?eventId=2').respond(201, registeredGames);
            }));

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
            var mockBackend, service, data;
            beforeEach(inject(function(_$httpBackend_, RegisteredGames) {
                mockBackend = _$httpBackend_;
                service = RegisteredGames;
                mockBackend.expectGET('/controllers/admin/registeredGames.php?eventId=2').respond(201, []);
            }));

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
