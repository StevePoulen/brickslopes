'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function() {
    var scope, ctrl, location;

    beforeEach (module('Admin'));

    describe('afolAdmin Controller', function() {
        var mockBackend;
        beforeEach(inject(function($controller, $rootScope, $location, _$httpBackend_) {
            scope = $rootScope.$new();
            ctrl = $controller('afolAdmin', { $scope: scope});
            location = $location;
            mockBackend = _$httpBackend_;
            mockBackend.expectGET('/controllers/admin/registeredUsers.php').respond(201, registeredUsers);
            mockBackend.expectGET('/controllers/registered/registeredAfols.php?eventId=2').respond(201, registeredAfols);
            mockBackend.expectGET('/controllers/paid/mocs.php?eventId=2').respond(201, mocs);
            mockBackend.expectGET('/controllers/admin/registeredGames.php?eventId=2').respond(201, registeredGames);
        }));

        describe('Default Variables', function() {
            it('should have a userCount variable', function() {
                expect(scope.userCount).toBe(0);
            });

            it('should have a registeredCount variable', function() {
                expect(scope.registeredCount).toBe(0);
            });

            it('should have a mocCount variable', function() {
                expect(scope.mocCount).toBe(0);
            });

            it('should have a gamesCount variable', function() {
                expect(scope.gamesCount).toBe(0);
            });

            it('should have an eventId variable', function() {
                expect(scope.eventId).toBe(2);
            });

            it('should have a userCount variable', function() {
                mockBackend.flush();
                expect(scope.userCount).toBe(2);
            });

            it('should have a registeredCount variable', function() {
                mockBackend.flush();
                expect(scope.registeredCount).toBe(2);
            });

            it('should have a mocCount variable', function() {
                mockBackend.flush();
                expect(scope.mocCount).toBe(3);
            });

            it('should have a gamesCount variable', function() {
                mockBackend.flush();
                expect(scope.gamesCount).toBe(3);
            });
        });

        describe('Click Feedback', function() {
            it('should redirect to the feedback page', function() {
                scope.clickFeedback();
                expect(location.path()).toBe('/admin/feedback.html');
            });
        });

        describe('Click Registrations', function() {
            it('should redirect to the registeredAfols page', function() {
                scope.clickRegistrations();
                expect(location.path()).toBe('/admin/registeredAfols.html');
            });
        });

        describe('Click Users', function() {
            it('should redirect to the registeredUsers page', function() {
                scope.clickUsers();
                expect(location.path()).toBe('/admin/registeredUsers.html');
            });
        });

        describe('Click MOCs', function() {
            it('should redirect to the registeredMocs page', function() {
                scope.clickMocs();
                expect(location.path()).toBe('/admin/registeredMocs.html');
            });
        });

        describe('Click Event Registration Email', function() {
            it('should redirect to the email page', function() {
                scope.clickEventRegistrationEmail();
                expect(location.path()).toBe('/admin/eventRegistration/emails');
            });
        });

        describe('Click Vendor Registration Email', function() {
            it('should redirect to the email page', function() {
                scope.clickVendorRegistrationEmail();
                expect(location.path()).toBe('/admin/vendorRegistration/emails');
            });
        });

        describe('Click Site News Email', function() {
            it('should redirect to the email page', function() {
                scope.clickSiteNewsEmail();
                expect(location.path()).toBe('/admin/previewSiteNews/emails');
            });
        });

        describe('Click User Registration Email', function() {
            it('should redirect to the email page', function() {
                scope.clickUserRegistrationEmail();
                expect(location.path()).toBe('/admin/userRegistration/emails');
            });
        });

        describe('Click Registration Paid Email', function() {
            it('should redirect to the email page', function() {
                scope.clickRegistrationPaidEmail();
                expect(location.path()).toBe('/admin/registrationPaidDisplay/emails');
            });
        });

        describe('Click Reset Password Email', function() {
            it('should redirect to the email page', function() {
                scope.clickResetPasswordEmail();
                expect(location.path()).toBe('/admin/resetPassword/emails');
            });
        });
    });
});
