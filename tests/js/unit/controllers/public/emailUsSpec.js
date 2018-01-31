describe('controllers', function() {
    'use strict';
    var scope;

    beforeEach(module('brickSlopes'));

    describe('emailUs Controller', function() {
        var mockBackend;
        beforeEach(inject(function(
            _$controller_,
            _$httpBackend_,
            _$rootScope_
        ) {
            scope = _$rootScope_.$new();
            _$controller_('emailUsController', {
                $scope: scope
            });
            mockBackend = _$httpBackend_;
        }));

        describe('Default Values', function() {
            it('should have a comments variable', function() {
                expect(scope.comments).toBe('Comments ...');
            });

            it('should have a captchaInit variable', function() {
                expect(scope.captchaInit).toBe('LeGo1');
            });

            it('should have a timer variable', function() {
                expect(scope.timer).toBe(false);
            });

            it('should have a verifying variable', function() {
                expect(scope.verifying).toBe(false);
            });
        });

        describe('Submit an email', function() {
            beforeEach(function() {
                scope.firstName = 'Cody';
                scope.lastName = 'Ottley';
                scope.email = 'cody.ottley@bs.com';
                scope.comments = 'Everything is Awesome!';
            });

            it('should submit an email on success', function() {
                var dto = {
                    firstName: 'Cody',
                    lastName: 'Ottley',
                    email: 'cody.ottley@bs.com',
                    comments: 'Everything is Awesome!'
                };
                scope.emailUsForm = {
                    $setPristine: function() {}
                };
                scope.submitEmail();
                mockBackend.expectPOST('/controllers/public/emailUs.php', dto).respond(201);
                mockBackend.flush();
                expect(scope.displayMessage).toBe('Your e-mail has been sent.');
                expect(scope.timer).toBe(true);
                expect(scope.firstName).toBe('');
                expect(scope.lastName).toBe('');
                expect(scope.email).toBe('');
                expect(scope.comments).toBe('Comments ...');
                expect(scope.captchaInit).toBe('WylDstYl3');
                expect(scope.captcha).toBe('');
            });
        });
    });
});
