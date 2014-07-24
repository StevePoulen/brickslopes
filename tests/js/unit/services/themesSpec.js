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

    describe('Themes', function() {
        describe('Get', function() {
            var mockBackend, service, data, eventId;
            beforeEach(inject(function(_$httpBackend_, Themes) {
                eventId = 2;
                mockBackend = _$httpBackend_;
                service = Themes;
                mockBackend.expectGET('/controllers/registered/themes.php?eventId=2').respond(201, themes);
            }));

            it('should get a list of themes and awards for an event', function() {
                var load = service.getList(2);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data[0].theme).toEqualData('Adventure');
            });

            it('should load the game list count', function() {
                var load = service.getCount(2);
                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toEqualData(3);
            });
        });
    });
});
