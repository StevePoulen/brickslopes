describe('controllers', function() {
    'use strict';
    var scope, controller, location, mockBackend, mockWindow;
    var route, mocDTO;

    beforeEach(module('brickSlopes'));

    beforeEach(inject(function(
        _$controller_,
        _EventSelectionFactory_,
        _$httpBackend_,
        _$location_,
        _$rootScope_,
        _$route_,
        _$window_
    ) {
        mockWindow = _$window_;
        mockWindow.sessionStorage.firstName = 'Cody';
        mockWindow.sessionStorage.lastName = 'Ottley';
        mockBackend = _$httpBackend_;
        controller = _$controller_;

        scope = _$rootScope_.$new();
        route = _$route_;
        route = Object({
            current: Object({
                params: Object({
                    eventId: 2
                })
            })
        });
        location = _$location_;
    }));

    afterEach(function() {
        delete window.sessionStorage.firstName;
        delete window.sessionStorage.lastName;
        delete window.sessionStorage.userId;
    });

    describe('eventMocRegistration Controller', function() {
        beforeEach(function() {
            controller('afolMocRegistration', {
                $scope: scope,
                $mockWindow: mockWindow,
                $route: route
            });
        });

        it('should have default values', function() {
            expect(scope.displayErrorMessage).toBeNull();
            expect(scope.displayMessage).toBeNull();

            expect(scope.isMocUpdate).toBe(false);

            expect(scope.buttonText).toBe('Register My MOC');
            expect(scope.showModal).toBe(false);

            expect(scope.lastName).toBe('Ottley');
            expect(scope.firstName).toBe('Cody');

            expect(scope.data).toEqual(Object({
                eventId: 2,
                displayName: 'Cody Ottley',
                baseplateWidth: 1,
                baseplateDepth: 1,
                theme: null,
                themeId: null,
                title: null,
                mocId: null,
                mocImageUrl: null,
                isSet: 'false',
                isTfol: 'false',
                description: null
            }));

            expect(scope.width.length).toBe(54);
            expect(scope.width[0]).toBe(1);
            expect(scope.width[53]).toBe(54);

            expect(scope.depth.length).toBe(6);
            expect(scope.depth[0]).toBe(1);
            expect(scope.depth[5]).toBe(6);

            expect(scope.theme).toBeUndefined();
            expect(scope.themeId).toBeUndefined();
            expect(scope.themeList).toEqual([]);
        });

        describe('Close Dialog', function() {
            it('should redirect to index page', function() {
                scope.closeDialog();
                expect(location.path()).toBe('/registered/index.html');
            });
        });

        describe('Digest', function() {
            beforeEach(function() {
                mockBackend.expectGET('/controllers/paid/themes.php?eventId=2').respond(window.themes);
                mockBackend.flush();
            });

            it('should populate the themeList variable', function() {
                var expectedThemes = [
                    window.themes[0],
                    window.themes[1]
                ];
                expect(scope.themeList).toEqual(expectedThemes);
            });

            it('should have a theme variable ', function() {
                expect(scope.theme).toEqual(window.themes[0]);
            });

            it('should have an themeId variable ', function() {
                expect(scope.data.themeId).toBe(12);
            });
        });

        describe('Create Moc', function() {
            beforeEach(function() {
                mocDTO = Object({
                    themeId: 14,
                    eventId: 2,
                    title: 'My Fine Title',
                    displayName: 'Cody Ottley',
                    mocImageUrl: 'https://www.smile.com',
                    baseplateWidth: 1,
                    baseplateDepth: 1,
                    description: 'I worked really hard on this MOC'
                });
                mockBackend.expectGET('/controllers/paid/themes.php?eventId=2').respond(window.themes);
                mockBackend.flush();
            });

            it('should create a moc', function() {
                scope.registrationForm = Object({
                    $setPristine: function() {}
                });

                scope.data = angular.copy(mocDTO);
                scope.data.theme = Object({
                    themeId: 14
                });

                scope.submitRegistration();
                mockBackend.expectPOST('/controllers/paid/mocs.php', mocDTO).respond(201);
                mockBackend.expectGET('/controllers/paid/mocs.php?eventId=2').respond(window.mocs);
                mockBackend.flush();
                expect(scope.data).toEqual(Object({
                    displayName: 'Cody Ottley',
                    baseplateWidth: 1,
                    baseplateDepth: 1,
                    theme: window.themes[0],
                    eventId: 2,
                    themeId: null,
                    title: null,
                    mocId: null,
                    mocImageUrl: null,
                    isSet: 'false',
                    isTfol: 'false',
                    description: null
                }));
            });

            it('should display an error', function() {
                scope.data = angular.copy(mocDTO);
                scope.data.theme = Object({
                    themeId: 14
                });
                scope.submitRegistration();
                mockBackend.expectPOST('/controllers/paid/mocs.php').respond(400);
                mockBackend.flush();
                expect(scope.displayErrorMessage).toBe('The MOC travails.');
            });

            it('should display an error', function() {
                scope.data = angular.copy(mocDTO);
                scope.data.theme = Object({
                    themeId: 14
                });
                scope.submitRegistration();
                mockBackend.expectPOST('/controllers/paid/mocs.php', mocDTO).respond(409);
                mockBackend.flush();
                expect(scope.displayErrorMessage).toBeNull();
            });
        });
    });

    describe('eventMocRegistration Controller Update With Available Moc', function() {
        beforeEach(function() {
            route = Object({
                current: Object({
                    params: Object({
                        eventId: 2,
                        mocId: 3
                    })
                })
            });
            mockWindow.sessionStorage.userId = 1;

            controller('afolMocRegistration', {
                $scope: scope,
                $mockWindow: mockWindow,
                $route: route
            });

            mockBackend.expectGET('/controllers/paid/themes.php?eventId=2').respond(window.themes);
            mockBackend.expectGET('/controllers/paid/mocs.php?eventId=2').respond(window.mocs);

            mocDTO = Object({
                mocId: 3,
                themeId: 14,
                eventId: '2',
                title: "Corey's Castle",
                displayName: 'Corey Da Man',
                mocImageUrl: '',
                baseplateWidth: 18,
                baseplateDepth: 3,
                description: 'My out-of-this-world castle with peeps!'
            });
        });

        describe('Update Moc', function() {
            it('should update a moc', function() {
                mockBackend.flush();
                expect(scope.buttonText).toBe('Update My MOC');
                scope.data = angular.copy(mocDTO);
                scope.data.theme = Object({
                    themeId: 14
                });
                scope.registrationForm = {
                    $setPristine: function() {}
                };
                expect(scope.isMocUpdate).toBe(true);

                scope.submitRegistration();
                mockBackend.expectPATCH('/controllers/paid/mocs.php', mocDTO).respond();
                mockBackend.expectGET('/controllers/paid/mocs.php?eventId=2').respond(window.mocs);
                mockBackend.flush();

                expect(scope.data).toEqual(Object({
                    eventId: 2,
                    displayName: 'Cody Ottley',
                    baseplateWidth: 1,
                    baseplateDepth: 1,
                    theme: window.themes[0],
                    themeId: null,
                    title: null,
                    mocId: 3,
                    mocImageUrl: null,
                    isSet: 'false',
                    isTfol: 'false',
                    description: null
                }));
                expect(scope.isMocUpdate).toBe(false);
                expect(scope.buttonText).toBe('Register My MOC');
            });

            it('should update a moc with an error', function() {
                mockBackend.flush();
                expect(scope.isMocUpdate).toBe(true);
                scope.submitRegistration();
                mockBackend.expectPATCH('/controllers/paid/mocs.php').respond(400);
                mockBackend.flush();
                expect(scope.displayErrorMessage).toBe('The MOC travails.');
            });
        });
    });

    describe('eventMocRegistration Controller Update With Available Moc', function() {
        beforeEach(function() {
            route = Object({
                current: Object({
                    params: Object({
                        eventId: 2,
                        mocId: 1
                    })
                })
            });
            mockWindow.sessionStorage.userId = 1;
            controller('afolMocRegistration', {
                $scope: scope,
                $mockWindow: mockWindow,
                $route: route
            });
            mockBackend.expectGET('/controllers/paid/themes.php?eventId=2').respond(window.themes);
            mockBackend.expectGET('/controllers/paid/mocs.php?eventId=2').respond(window.mocs);

            mocDTO = Object({
                mocId: 3,
                themeId: '1',
                eventId: '2',
                title: "Corey's Castle",
                displayName: 'Corey Da Man',
                mocImageUrl: '',
                baseplateWidth: '18',
                baseplateDepth: '3',
                description: 'My out-of-this-world castle with peeps!'
            });
        });

        describe('Update Moc', function() {
            it('should not update a moc if the moc is not defined', function() {
                mockBackend.flush();
                expect(scope.isMocUpdate).toBe(false);
                expect(scope.buttonText).toBe('Register My MOC');
                expect(scope.data).toEqual(Object({
                    eventId: 2,
                    displayName: 'Cody Ottley',
                    baseplateWidth: 1,
                    baseplateDepth: 1,
                    theme: null,
                    themeId: 12,
                    title: null,
                    mocId: 1,
                    mocImageUrl: null,
                    isSet: 'false',
                    isTfol: 'false',
                    description: null
                }));
                scope.registrationForm = {
                    $setPristine: function() {}
                };

                scope.data.theme = Object({
                    themeId: 14
                });

                scope.submitRegistration();
                mockBackend.expectPATCH('/controllers/paid/mocs.php', mocDTO).respond();
                mockBackend.expectGET('/controllers/paid/mocs.php?eventId=2').respond(window.mocs);
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
