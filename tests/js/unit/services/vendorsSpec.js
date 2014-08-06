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

    describe('Vendors', function() {
        describe('Get', function() {
            var mockBackend, service, data, eventId;
            beforeEach(inject(function(_$httpBackend_, VendorDetails) {
                eventId = 2;
                mockBackend = _$httpBackend_;
                mockBackend.expectGET('/controllers/vendors.php?eventId=2').respond(201, vendors);
                service = VendorDetails;
            }));

            it('should get a list of vendors for an event', function() {
                var load = service.getList(2);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data[0].vendorId).toEqualData(2);
                expect(data[0].name).toBe("A Boy's Mission");
                expect(data[0].description.$$unwrapTrustedValue()).toBe("All LEGO Bro");
                expect(data[0].url).toBe('http://www.brickshelf.com/abm');
                expect(data[0].hasLogo).toBe(true);
                expect(data[0].logo).toBe('http://www.mylogo.com');
                expect(data[0].tables).toBe(12);
                expect(data[1].hasUrl).toBe(true);

                //Vendor #2
                expect(data[1].vendorId).toEqualData(1);
                expect(data[1].hasLogo).toBe(false);
                expect(data[1].hasUrl).toBe(true);

                //Vendor #3
                expect(data[2].vendorId).toEqualData(3);
                expect(data[2].hasLogo).toBe(true);
                expect(data[2].hasUrl).toBe(false);
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
