describe('controllers', function() {
    'use strict';
    var scope, ctrl, location, mockBackend, window, originalSessionStorage;

    beforeEach(module('brickSlopes.controllers'));

    beforeEach(inject(function(_EventSelectionFactory_, _$httpBackend_, _$window_) {
        window = _$window_;
        originalSessionStorage = window.sessionStorage;
        spyOn(_EventSelectionFactory_, 'getSelectedEvent').andReturn(2);
        mockBackend = _$httpBackend_;
    }));

    afterEach(function() {
        window.sessionStorage = originalSessionStorage;
    });

    describe('eventMocRegistration Controller', function() {
        var loader, location, response, route;

        beforeEach(inject(function($controller, $rootScope, $location, $route) {
            route = $route;
            route = {current: {params:{eventId:2}}};
            scope = $rootScope.$new();
            window.sessionStorage.firstName = 'Cody';
            window.sessionStorage.lastName = 'Ottley';
            ctrl = $controller('afolMocRegistration', { $scope: scope, $window: window, $route: route});
            location = $location;
        }));

        describe('Default Values', function() {
            it('should have a displayErrorMessage variable ', function() {
                expect(scope.displayErrorMessage).toBeUndefined();
            });

            it('should have a displayMessage variable ', function() {
                expect(scope.displayMessage).toBeUndefined();
            });

            it('should have a isMocUpdate variable ', function() {
                expect(scope.isMocUpdate).toBe(false);
            });

            it('should have a buttonText variable ', function() {
                expect(scope.buttonText).toBe('Register My MOC');
            });

            it('should have a showModal variable ', function() {
                expect(scope.showModal).toBe(false);
            });

            it('should have a lastName variable ', function() {
                expect(scope.lastName).toBe('Ottley');
            });
            it('should have a firstName variable ', function() {
                expect(scope.firstName).toBe('Cody');
            });

            it('should have a displayName variable ', function() {
                expect(scope.displayName).toBe('Cody Ottley');
            });

            it('should have a baseplateWidth variable ', function() {
                expect(scope.baseplateWidth).toBe(1);
            });

            it('should have a baseplateDepth variable ', function() {
                expect(scope.baseplateDepth).toBe(1);
            });

            it('should have a title variable', function() {
                expect(scope.title).toBeUndefined();
            });

            it('should have a mocImageUrl variable', function() {
                expect(scope.mocImageUrl).toBeUndefined();
            });

            it('should have a description variable', function() {
                expect(scope.description).toBeUndefined();
            });

            it('should have a width variable ', function() {
                expect(scope.width.length).toBe(54);
                expect(scope.width[0]).toBe(1);
                expect(scope.width[53]).toBe(54);
            });

            it('should have a height variable ', function() {
                expect(scope.depth.length).toBe(6);
                expect(scope.depth[0]).toBe(1);
                expect(scope.depth[5]).toBe(6);
            });

            it('should have an eventId variable ', function() {
                expect(scope.eventId).toBe(2);
            });

            it('should have an mocId variable ', function() {
                expect(scope.mocId).toBeUndefined();
            });

            it('should have a theme variable ', function() {
                expect(scope.theme).toBeUndefined();
            });

            it('should have an themeId variable ', function() {
                expect(scope.themeId).toBeUndefined;
            });

            it('should have a themeList collection', function() {
                expect(scope.themeList).toEqual([]);
            });

        });

        describe('Close Dialog', function() {
            it('should redirect to index page', function() {
                scope.closeDialog();
                expect(location.path()).toBe('/registered/index.html');
            });
        });

        describe('Digest', function() {
            beforeEach(function() {
                mockBackend.expectGET('/controllers/paid/themes.php?eventId=2').respond(themes);
                mockBackend.flush();
            });

            it('should populate the themeList variable', function() {
                var expectedThemes = [
                    themes[0],
                    themes[1]
                ];
                expect(scope.themeList).toEqual(expectedThemes);
            });

            it('should have a theme variable ', function() {
                expect(scope.theme).toEqual(themes[0]);
            });

            it('should have an themeId variable ', function() {
                expect(scope.themeId).toBe(12);
            });
        });

        describe('Create Moc', function() {
            var mocDto;
            beforeEach(function() {
                mocDto = {
                    themeId: 12,
                    eventId: 2,
                    title: 'My Fine Title',
                    displayName: 'Cody Ottley',
                    mocImageUrl: 'https://www.smile.com',
                    baseplateWidth: 1,
                    baseplateDepth: 1,
                    description: 'I worked really hard on this MOC'
                }
                mockBackend.expectGET('/controllers/paid/themes.php?eventId=2').respond(themes);
                mockBackend.flush();
            });

            it('should create a moc', function() {
                scope.registrationForm = {'$setPristine': function() {}};
                scope.title = 'My Fine Title';
                scope.mocImageUrl = 'https://www.smile.com';
                scope.description = 'I worked really hard on this MOC';
                scope.submitRegistration();
                mockBackend.expectPOST('/controllers/paid/mocs.php', mocDto).respond(201);
                mockBackend.expectGET('/controllers/paid/mocs.php?eventId=2').respond(mocs);
                mockBackend.flush();
                expect(scope.displayName).toBe('Cody Ottley');
                expect(scope.baseplateWidth).toBe(1);
                expect(scope.baseplateDepth).toBe(1);
                expect(scope.theme).toEqual(themes[0]);
                expect(scope.themeId).toBeUndefined();
                expect(scope.title).toBeUndefined();
                expect(scope.mocImageUrl).toBeUndefined();
                expect(scope.description).toBeUndefined();
            });

            it('should display an error', function() {
                scope.title = 'My Fine Title';
                scope.mocImageUrl = 'https://www.smile.com';
                scope.description = 'I worked really hard on this MOC';
                scope.submitRegistration();
                mockBackend.expectPOST('/controllers/paid/mocs.php', mocDto).respond(400);
                mockBackend.flush();
                expect(scope.displayErrorMessage).toBe('The MOC travails.');
            });
        });
    });

    describe('eventMocRegistration Controller Update With Available Moc', function() {
        var loader, location, response, route, mocDTO;

        beforeEach(inject(function($controller, $rootScope, $location, $route) {
            route = $route;
            route = {current: {params:{eventId:2, mocId:3}}};
            scope = $rootScope.$new();
            window.sessionStorage.userId = 1;
            ctrl = $controller('afolMocRegistration', { $scope: scope, $window: window, $route: route});
            location = $location;
            mockBackend.expectGET('/controllers/paid/themes.php?eventId=2').respond(themes);
            mockBackend.expectGET('/controllers/paid/mocs.php?eventId=2').respond(mocs);

            mocDTO = {
                mocId: 3,
                themeId: 3,
                eventId: '2',
                title: "Corey's Castle",
                displayName: 'Corey Da Man',
                mocImageUrl: '',
                baseplateWidth: 18,
                baseplateDepth: 3,
                description: 'My out-of-this-world castle with peeps!'
            }
        }));

        describe('Update Moc', function() {
            it('should update a moc', function() {
                mockBackend.flush();
                expect(scope.buttonText).toBe('Update My MOC');
                expect(scope.mocId).toBe(3);
                expect(scope.themeId).toBe(3);
                expect(scope.eventId).toBe('2');
                expect(scope.title).toBe("Corey's Castle");
                expect(scope.displayName).toBe('Corey Da Man');
                expect(scope.mocImageUrl).toBe('');
                expect(scope.baseplateWidth).toBe(18);
                expect(scope.baseplateDepth).toBe(3);
                expect(scope.description).toBe('My out-of-this-world castle with peeps!');
                scope.registrationForm = {'$setPristine': function() {}};
                expect(scope.isMocUpdate).toBe(true);

                scope.submitRegistration();
                mockBackend.expectPATCH('/controllers/paid/mocs.php', mocDTO).respond(200);
                mockBackend.expectGET('/controllers/paid/mocs.php?eventId=2').respond(mocs);
                mockBackend.flush();

                expect(scope.displayName).toBe('Cody Ottley');
                expect(scope.baseplateWidth).toBe(1);
                expect(scope.baseplateDepth).toBe(1);
                expect(scope.theme).toEqual(themes[0]);
                expect(scope.mocId).toBeUndefined();
                expect(scope.themeId).toBe(12);
                expect(scope.title).toBeUndefined();
                expect(scope.mocImageUrl).toBeUndefined();
                expect(scope.description).toBeUndefined();
                expect(scope.isMocUpdate).toBe(false);
                expect(scope.buttonText).toBe('Register My MOC');
            });

            it('should update a moc with an error', function() {
                mockBackend.flush();
                expect(scope.isMocUpdate).toBe(true);
                scope.submitRegistration();
                mockBackend.expectPATCH('/controllers/paid/mocs.php', mocDTO).respond(400);
                mockBackend.flush();
                expect(scope.displayErrorMessage).toBe('The MOC travails.');
            });
        });
    });

    describe('eventMocRegistration Controller Update With Available Moc', function() {
        var loader, location, response, route, mocDTO;

        beforeEach(inject(function($controller, $rootScope, $location, $route) {
            route = $route;
            route = {current: {params:{eventId:2, mocId:1}}};
            scope = $rootScope.$new();
            window.sessionStorage.userId = 1;
            ctrl = $controller('afolMocRegistration', { $scope: scope, $window: window, $route: route});
            location = $location;
            mockBackend.expectGET('/controllers/paid/themes.php?eventId=2').respond(themes);
            mockBackend.expectGET('/controllers/paid/mocs.php?eventId=2').respond(mocs);

            mocDTO = {
                mocId: 3,
                themeId: '1',
                eventId: '2',
                title: "Corey's Castle",
                displayName: 'Corey Da Man',
                mocImageUrl: '',
                baseplateWidth: '18',
                baseplateDepth: '3',
                description: 'My out-of-this-world castle with peeps!'
            }
        }));

        describe('Update Moc', function() {
            it('should not update a moc if the moc is not defined', function() {
                mockBackend.flush();
                expect(scope.isMocUpdate).toBe(false);
                expect(scope.buttonText).toBe('Register My MOC');
                expect(scope.displayName).toBe('Cody Ottley');
                expect(scope.baseplateWidth).toBe(1);
                expect(scope.baseplateDepth).toBe(1);
                expect(scope.theme).toEqual(themes[0]);
                expect(scope.themeId).toBe(12);
                expect(scope.title).toBeUndefined();
                expect(scope.mocImageUrl).toBeUndefined();
                expect(scope.description).toBeUndefined();
                scope.registrationForm = {'$setPristine': function() {}};

                scope.submitRegistration();
                mockBackend.expectPATCH('/controllers/paid/mocs.php', mocDTO).respond(200);
                mockBackend.expectGET('/controllers/paid/mocs.php?eventId=2').respond(mocs);
                try {
                    mockBackend.flush();
                    expect(false).toBe(true);
                } catch (err) {
                    expect('test passed by error').toBe('test passed by error');
                }

            });
        });
    });
});
