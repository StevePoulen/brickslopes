describe('service', function() {
    'use strict';
    beforeEach(module('brickSlopes.services'));

    beforeEach(inject(function(_EventSelectionFactory_) {
        spyOn(_EventSelectionFactory_, 'getSelectedEvent').andReturn(2);
    }));

    describe('Vendors', function() {
        describe('Get', function() {
            var mockBackend, service, data;
            beforeEach(inject(function(_$httpBackend_, VendorDetails) {
                mockBackend = _$httpBackend_;
                mockBackend.expectGET('/controllers/registered/vendors/vendors.php?eventId=2').respond(201, vendors);
                service = VendorDetails;
            }));

            it('should get a list of vendors for an event', function() {
                var load = service.getList(2);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data[0].storeId).toBe(2);
                expect(data[0].name).toBe("A Boy's Mission");
                expect(data[0].description.$$unwrapTrustedValue()).toBe("All LEGO Bro");
                expect(data[0].url).toBe('http://www.brickshelf.com/abm');
                expect(data[0].hasLogo).toBe(true);
                expect(data[0].logo).toBe('http://www.mylogo.com');
                expect(data[0].tables).toBe(12);
                expect(data[0].hasUrl).toBe(true);

                //Vendor #2
                expect(data[1].storeId).toBe(1);
                expect(data[1].hasLogo).toBe(false);
                expect(data[1].hasUrl).toBe(true);

                //Vendor #3
                expect(data[2].storeId).toBe(3);
                expect(data[2].hasLogo).toBe(true);
                expect(data[2].hasUrl).toBe(false);

                //Vendor #4
                expect(data[3].storeId).toBe(4);
                expect(data[3].hasLogo).toBe(false);
                expect(data[3].hasUrl).toBe(false);

                //Vendor #5
                expect(data[4].storeId).toBe(5);
                expect(data[4].hasLogo).toBe(false);
                expect(data[4].hasUrl).toBe(false);
            });

            it('should load the game list count', function() {
                var load = service.getCount(2);
                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toBe(5);
            });
        });

        describe('Delete Associate', function() {
            var mockBackend, service, data, dto;
            beforeEach(inject(function(_$httpBackend_, VendorDetails) {
                dto = {
                    associateId: 22,
                    userId: 23,
                }
                mockBackend = _$httpBackend_;
                mockBackend.expectDELETE('/controllers/registered/vendors/vendorAssociates.php?associateId=22&eventId=2&userId=23').respond(200, 'Success');
                service = VendorDetails;
            }));

            it('should delete an associate', function() {
                var load = service.deleteAssociate(dto);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toBe(200);
            });
        });

        describe('Create Associate error', function() {
            var mockBackend, service, data, dto;
            beforeEach(inject(function(_$httpBackend_, VendorDetails) {
                dto = {
                    associateId: 22,
                }

                mockBackend = _$httpBackend_;
                mockBackend.expectDELETE('/controllers/registered/vendors/vendorAssociates.php?associateId=22&eventId=2').respond(412, {error: 'this is bad'});
                service = VendorDetails;
            }));

            it('should delete an associate', function() {
                var tableDTO;
                var load = service.deleteAssociate(dto);

                load.then(function(_data) {
                    data = 'This is wrong';
                }, function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toBe(412);
            });
        });

        describe('Create Associate', function() {
            var mockBackend, service, data;
            beforeEach(inject(function(_$httpBackend_, VendorDetails) {
                mockBackend = _$httpBackend_;
                mockBackend.expectPOST('/controllers/registered/vendors/vendorAssociates.php').respond(201, 'Success');
                service = VendorDetails;
            }));

            it('should create a table order for an event', function() {
                var tableDTO;
                var load = service.createAssociate(tableDTO);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toBe('Success');
            });
        });

        describe('Create Associate error', function() {
            var mockBackend, service, data;
            beforeEach(inject(function(_$httpBackend_, VendorDetails) {
                mockBackend = _$httpBackend_;
                mockBackend.expectPOST('/controllers/registered/vendors/vendorAssociates.php').respond(412, {error: 'this is bad'});
                service = VendorDetails;
            }));

            it('should create a table order for an event', function() {
                var tableDTO;
                var load = service.createAssociate(tableDTO);

                load.then(function(_data) {
                    data = 'This is wrong';
                }, function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data.error).toBe('this is bad');
            });
        });

        describe('Get Associate', function() {
            var mockBackend, service, data, storeId;
            beforeEach(inject(function(_$httpBackend_, VendorDetails) {
                storeId = 3;
                mockBackend = _$httpBackend_;
                mockBackend.expectGET('/controllers/registered/vendors/vendorAssociates.php?eventId=2&storeId='+storeId).respond(201, associatesMock);
                service = VendorDetails;
            }));

            it('should get all the associates for an event', function() {
                var load = service.getAssociates(storeId);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data[0].associateId).toBe(2);
                expect(data[0].firstName).toBe('Dorthy');
                expect(data[0].lastName).toBe('Ottley');
                expect(data[0].lineItem).toBe('Associate Pass');
            });
        });

        describe('Create Table', function() {
            var mockBackend, service, data;
            beforeEach(inject(function(_$httpBackend_, VendorDetails) {
                mockBackend = _$httpBackend_;
                mockBackend.expectPOST('/controllers/registered/vendors/tableRegistration.php').respond(201, 'Success');
                service = VendorDetails;
            }));

            it('should create a table order for an event', function() {
                var tableDTO;
                var load = service.createTableOrder(tableDTO);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toBe('Success');
            });
        });

        describe('Update Table', function() {
            var mockBackend, service, data;
            beforeEach(inject(function(_$httpBackend_, VendorDetails) {
                mockBackend = _$httpBackend_;
                mockBackend.expectPATCH('/controllers/registered/vendors/tableRegistration.php').respond(200);
                service = VendorDetails;
            }));

            it('should create a table order for an event', function() {
                var tableDTO;
                var load = service.updateTableOrder(tableDTO);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toBe(200);
            });
        });

        describe('Get Table', function() {
            var mockBackend, service, data;
            beforeEach(inject(function(_$httpBackend_, VendorDetails) {
                mockBackend = _$httpBackend_;
                mockBackend.expectGET('/controllers/registered/vendors/tableRegistration.php?tableId=2').respond(201, tables);
                service = VendorDetails;
            }));

            it('should get a number of tables for an event', function() {
                var load = service.getTableById(2);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data.eventId).toBe(2);
                expect(data.tableId).toBe(3);
                expect(data.storeId).toBe(4);
                expect(data.tables).toBe(12);
            });
        });

        describe('Create a new store', function() {
            var mockBackend, service, data;
            beforeEach(inject(function(_$httpBackend_, VendorDetails) {
                mockBackend = _$httpBackend_;
                mockBackend.expectPOST('/controllers/registered/vendors/vendorRegistration.php').respond(201, 'Success');
                service = VendorDetails;
            }));

            it('should get a list of vendors for an event', function() {
                var vendorDTO;
                var load = service.createStore(vendorDTO);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toBe('Success');
            });
        });

        describe('Get Store', function() {
            var mockBackend, service, data;
            beforeEach(inject(function(_$httpBackend_, VendorDetails) {
                mockBackend = _$httpBackend_;
                mockBackend.expectGET('/controllers/registered/vendors/vendorRegistration.php?storeId=2').respond(201, vendors[0]);
                service = VendorDetails;
            }));

            it('should get a single vendor store', function() {
                var load = service.getStore(2);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data.storeId).toBe(2);
                expect(data.name).toBe("A Boy's Mission");
                expect(data.description.$$unwrapTrustedValue()).toBe("All LEGO Bro");
                expect(data.url).toBe('http://www.brickshelf.com/abm');
                expect(data.hasLogo).toBe(true);
                expect(data.logo).toBe('http://www.mylogo.com');
                expect(data.tables).toBe(12);
                expect(data.hasUrl).toBe(true);
            });
        });

        describe('Update new store', function() {
            var mockBackend, service, data;
            beforeEach(inject(function(_$httpBackend_, VendorDetails) {
                mockBackend = _$httpBackend_;
                mockBackend.expectPATCH('/controllers/registered/vendors/vendorRegistration.php').respond(200);
                service = VendorDetails;
            }));

            it('should get a list of vendors for an event', function() {
                var vendorDTO;
                var load = service.updateStore(vendorDTO);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toBe(200);
            });
        });

        describe('Get Event Me Vendor Information', function() {
            var mockBackend, data;
            beforeEach(inject(function(_$httpBackend_, VendorDetails) {
                mockBackend = _$httpBackend_;
                mockBackend.expectGET('/controllers/registered/vendors/vendorMeInformation.php?eventId=2').respond(201, eventMeVendor);
                var load = VendorDetails.getEventMeVendorInformation();

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
            }));

            describe('Vendor Store', function() {
                it('should get a single vendor store', function() {
                    var store = data.store;
                    expect(store.storeId).toBe('4');
                    expect(store.name).toBe("My Store");
                    expect(store.url).toBe('https://www.brickshelf.com/url');
                    expect(store.logo).toBe('https://www.logo.com/logo');
                    expect(store.creationDate).toBe('2014-08-30 17:16:49');
                });
            });

            describe('Vendor Tables', function() {
                it('should have a tables object', function() {
                    expect(data.hasTables).toBe(true);
                });

                it('should get a count of vendor tables for an event', function() {
                    var tables = data.tables;
                    expect(tables.tableId).toBe('8');
                    expect(tables.tables).toBe('2');
                });
            });

            describe('Store Associates', function() {
                it('should have an associates object', function() {
                    expect(data.hasAssociates).toBe(true);
                });

                it('should get a count of associates', function() {
                    var associates = data.associates;
                    expect(associates[0].associateId).toBe('8');
                    expect(associates[0].fullName).toBe('Ember Pilati');

                    expect(associates[2].associateId).toBe('9');
                    expect(associates[2].fullName).toBe('t h');
                });
            });
        });

        describe('Get Event Me Vendor Information Empty', function() {
            var mockBackend, data;
            beforeEach(inject(function(_$httpBackend_, VendorDetails) {
                mockBackend = _$httpBackend_;
                mockBackend.expectGET('/controllers/registered/vendors/vendorMeInformation.php?eventId=2').respond(201, eventMeVendorEmpty);
                var load = VendorDetails.getEventMeVendorInformation();

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
            }));

            describe('Vendor Store', function() {
                it('should get a single vendor store', function() {
                    var store = data.store;
                    expect(store.storeId).toBe('4');
                    expect(store.name).toBe("My Store");
                    expect(store.url).toBe('https://www.brickshelf.com/url');
                    expect(store.logo).toBe('https://www.logo.com/logo');
                    expect(store.creationDate).toBe('2014-08-30 17:16:49');
                });
            });

            describe('Vendor Tables', function() {
                it('should not have a tables object', function() {
                    expect(data.hasTables).toBe(false);
                });
            });

            describe('Store Associates', function() {
                it('should have an associates object', function() {
                    expect(data.hasAssociates).toBe(false);
                });
            });
        });
    });
});
