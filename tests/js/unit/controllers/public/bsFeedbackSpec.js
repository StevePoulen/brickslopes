describe('controllers', function() {
    'use strict';
    var scope, ctrl, location;

    beforeEach(module('brickSlopes.controllers'));

    afterEach(function() {
        $('body').html();
    });

    describe('bsFeedback Default Variables', function() {
        beforeEach(inject(function($controller, $rootScope) {
            scope = $rootScope.$new();
            ctrl = $controller('bsFeedback', { $scope: scope});
        }));

        it('should have a feedbackOpen variable', function() {
            expect(scope.feedbackOpen).toBe(false);
        });

        it('should have a timer variable', function() {
            expect(scope.timer).toBe(false);
        });

        it('should have a verifying variable', function() {
            expect(scope.verifying).toBe(false);
        });
    });

    describe('bsFeedback Click Handlers', function() {
        beforeEach(inject(function($controller, $rootScope, $location)  {
            scope = $rootScope.$new();
            location = $location;
            ctrl = $controller('bsFeedback', { $scope: scope});
            jasmine.Clock.useMock();
            jQuery.fx.off = true;
        }));

        it('should open the feedback form', function() {
            scope.feedbackOpen = false;
            $('body').append('<div class="feedbackPanel"></div>');
            $($('.feedbackPanel')).css('left', '-426px');
            scope.clickFeedbackTab();
            expect(location.path()).toBe('');
            expect($($('.feedbackPanel')).css('left')).toBe('0px');
            expect(scope.feedbackOpen).toBe(true);
        });

        it('should close the feedback form', function() {
            scope.feedbackOpen = true;
            $('body').append('<div class="feedbackPanel"></div>');
            $($('.feedbackPanel')).css('left', '426px');
            scope.clickFeedbackTab();
            expect(location.path()).toBe('');
            expect($($('.feedbackPanel')).css('left')).toBe('0px');
            expect(scope.feedbackOpen).toBe(false);
        });

        it('should close the feedback form with the mask', function() {
            scope.feedbackOpen = true;
            $('body').append('<div class="feedbackPanel"></div>');
            $($('.feedbackPanel')).css('left', '426px');
            scope.clickMask();
            expect(location.path()).toBe('');
            expect($($('.feedbackPanel')).css('left')).toBe('0px');
            expect(scope.feedbackOpen).toBe(false);
        });
    });

    describe('bsFeedback Flush', function() {
        var mockBackend;
        beforeEach(inject(function($controller, $rootScope) {
            scope = $rootScope.$new();
            ctrl = $controller('bsFeedback', { $scope: scope});
            scope.$digest();
        }));

        it('should set the email variable', function() {
            expect(scope.email).toBe('');
        });

        it('should set the feedback variable', function() {
            expect(scope.feedback).toBe('');
        });

        it('should set the captchaInit variable', function() {
            expect(scope.captchaInit).toBe('D@rKGr3y');
        });

        it('should set the captcha variable', function() {
            expect(scope.captcha).toBe('');
        });
    });

    describe('Submit Feedback', function() {
        var mockBackend;
        beforeEach(inject(function($controller, $rootScope, _$httpBackend_) {
            scope = $rootScope.$new();
            ctrl = $controller('bsFeedback', { $scope: scope});
            mockBackend = _$httpBackend_;
            var dto = {
                'email': 'steve@brickslopes.com',
                'feedback': 'This sight rox!'
            }

            mockBackend.expectPOST('/controllers/public/feedback.php', dto).respond(201);
        }));

        it('should submit a user feedback form', function() {
            scope.feedbackForm = {'$setPristine': function() {}};
            scope.email = 'steve@brickslopes.com';
            scope.feedback = 'This sight rox!';
            scope.submitFeedback();
            expect(scope.verifying).toBe(true);
            mockBackend.flush();
            expect(scope.displayMessage).toBe('Your feedback has been received.');
            expect(scope.verifying).toBe(false);
            expect(scope.captchaInit).toBe('B#tm@n');
            expect(scope.captcha).toBe('');
            expect(scope.email).toBe('');
            expect(scope.feedback).toBe('');
            expect(scope.timer).toBe(true);
        });
    });
});
