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
            var mockBackend, loader, data, themeDetails, eventId;
            beforeEach(inject(function(_$httpBackend_, Themes) {
                eventId = 2;
                themeDetails = {
                    'userId': '1',
                    'eventId': '2'
                };
                mockBackend = _$httpBackend_;
                loader = Themes;
                mockBackend.expectGET('/controllers/themes.php?eventId=2').respond(201, themeDetails);
            }));

            it('should get a list of themes and awards for an event', function() {
                var load = loader.get(2);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toEqualData(themeDetails);
            });
        });
    });
});
