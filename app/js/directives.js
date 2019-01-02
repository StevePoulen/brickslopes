'use strict';

/* Directives */
angular.module('brickSlopes')
.directive('bsHeader', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/public/header.html'
    }
})
.directive('bsLogo', ['BrickSlopesText', '$sce', function(brickSlopesText, $sce) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            fontColor: '@',
            fontSize: '@',
            text: '@'
        },
        template: '<span ng-bind-html="bsText"></span>',
        link: function(scope, element, attrs) {
            scope.bsText = $sce.trustAsHtml(
                brickSlopesText.createText('Brick', scope.fontSize, scope.fontColor, undefined) +
                brickSlopesText.createText('Slopes', scope.fontSize, scope.fontColor, undefined)
            );
            scope.$watch("text", function() {
                if (angular.isDefined(scope.text)) {
                    scope.bsText = $sce.trustAsHtml(
                        brickSlopesText.createText('Brick', scope.fontSize, scope.fontColor, undefined) +
                        brickSlopesText.createText('Slopes', scope.fontSize, scope.fontColor, undefined) + ' ' +
                        (scope.text ? brickSlopesText.createText(scope.text, scope.fontSize, scope.fontColor, undefined) : "")
                    );
                }
            });
        }
    }
}])
.directive('bsEventLocked', ['UserDetails', function(UserDetails) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/directives/eventLocked.html',
        link: function(scope, element, attrs) {
            scope.bottom = attrs.bottom || "eventLockedIndex";
            scope.isUserRegistered = UserDetails.isUserRegistered();
            scope.isUserPaid = UserDetails.isUserRegistered() && UserDetails.isUserPaid();
        }
    }
}])
.directive('bsModal', [function() {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        templateUrl: 'partials/directives/modal.html',
        link: function(scope, element, attrs) {
            calculateWidth();
            scope.modalTitle = attrs.title;
            scope.closeModal = function() {
                scope.showModal = false;
            }

            function calculateWidth() {
                var windowWidth = $( $('.bsModal').parent()).width()/2;
                var modalWidth = $('.bsModal').width()/2;
                $('.bsModal').css('left', windowWidth - modalWidth);
            }
        }
    }
}])
.directive('bsText', ['BrickSlopesText', '$sce',  function(brickSlopesText, $sce) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            fontColor: '@',
            fontSize: '@',
            text: '@',
            maxSize: '@'
        },
        template: '<span ng-bind-html="bsText"></span>',
        link: function(scope, element, attrs) {
            scope.$watch("text", function() {
                scope.bsText = $sce.trustAsHtml(brickSlopesText.createText(attrs.text, attrs.fontSize, attrs.fontColor, attrs.maxSize));
            });
        }
    }
}])
.directive('bsFooter', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/public/footer.html'
    }
})
.directive('equals', function() {
    /*
        A big thanks to Jan laussman
        http://stackoverflow.com/questions/14012239/password-check-directive-in-angularjs
    */
    return {
        restrict: 'A', // only activate on element attribute
        require: '?ngModel', // get a hold of NgModelController
        link: function(scope, elem, attrs, ngModel) {
            if(!ngModel) return; // do nothing if no ng-model

            // watch own value and re-validate on change
            scope.$watch(attrs.ngModel, function() {
                validate();
            });

            // observe the other value and re-validate on change
            attrs.$observe('equals', function(val) {
                validate();
            });

            var validate = function() {
                // values
                var val1 = ngModel.$viewValue;
                var val2 = attrs.equals;

                // set validity
                ngModel.$setValidity('equals', val1 === val2);
            };
        }
    }
})
/*LOGIN*/
.directive('bsLoginForm', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/public/login/loginForm.html'
    }
})
.directive('bsSignupForm', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/public/login/signUpForm.html'
    }
})
.directive('bsResetPassword', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/public/login/resetPasswordForm.html'
    }
})
.directive('bsSignupText', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/public/login/signUpText.html'
    }
})
.directive('bsUserInformation', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/registered/eventPanes/userInformation.html'
    }
})
.directive('bsChangePassword', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/registered/eventPanes/changePassword.html'
    }
})
.directive('bsEventGames', function() {
    return {
        restrict: 'E',
        scope: true,
        replace: true,
        templateUrl: 'partials/registered/eventPanes/eventGames.html'
    }
})
.directive('bsEventVendors', function() {
    return {
        restrict: 'E',
        scope: true,
        replace: true,
        templateUrl: 'partials/registered/eventPanes/eventVendors.html'
    }
})
.directive('bsEventMocs', function() {
    return {
        restrict: 'E',
        scope: true,
        replace: true,
        templateUrl: 'partials/registered/eventPanes/eventMocs.html'
    }
})
.directive('bsEventMocsCta', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/registered/eventPanes/eventMocsCTA.html'
    }
})
.directive('bsRegisteredEvents', function() {
    return {
        restrict: 'E',
        scope: true,
        replace: true,
        templateUrl: 'partials/registered/eventPanes/registeredEvents.html'
    }
}).directive('bsEventRegistrationCta', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/registered/eventPanes/registerEventsCTA.html'
    }
}).directive('bsTheme', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/paid/eventThemesDirective.html',
        link: function(scope, element, attrs) {
            scope.color = attrs.color;
        }
    }
}).directive('bsSplashPageCta', [
    'Environment',
    '$location',
    function(
        Environment,
        $location
    ) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/directives/splashPageCTA.html',
        link: function($scope) {
            ringer.init();

            $scope.displayTickets = function() {
                return Environment.displayTickets;
            };

            $scope.makeACalculation = function() {
                if (
                    $location.path().match('\/registered\/.*') ||
                    $location.path().match('\/admin\/.*') ||
                    $location.path().match('\/aboutus\/.*') ||
                    $location.path().match('\/topten\/.*') ||
                    $location.path().match('\/paid\/.*') ||
                    $location.path().match('\/schedule') ||
                    $location.path().match('\/error.html')
                ) {
                    return false;
                } else {
                    return true;
                }
            }
        }
    }
}])
.directive('bsFeedback', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/public/feedback.html',
    }
})
.directive('bsGameRegistration', [
    'Environment',
    function(
        Environment
    ) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/paid/bsGameRegistration.html',
        link: function(scope) {
            scope.$watch("userGameList", function() {
                scope.isRegistered = (scope.userGameList[scope.game.gameId] ? true : false);
            });
            
            scope.canRegister = function() {
                return Environment.registerGames;
            }
        }
    }
}])
.directive('bsTour', ['$rootScope', 'UserDetails', '$window', '$sce', 'BrickSlopesText', '$timeout', 'EventDetailsService', function($rootScope, UserDetails, $window, $sce, BrickSlopesText, $timeout, EventDetailsService) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/directives/tour.html',
        link: function($scope, $elem, $attrs) {
            var stepCounter = 1;
            var totalSteps = 8;
            var window = angular.element($window);

            $scope.isHideTour = true;
            $scope.buttonText = "Next";
            setStepDisplay(1);

            function setStepDisplay() {
                $scope.stepDisplay = "Step " + stepCounter + " of " + totalSteps;
            }

            $scope.closeTour = function() {
                unBindResize();
                $scope.isHideTour = true;
            };

            $scope.updateTour = function() {
                unBindResize();
                UserDetails.updateTour('NO').then(function(response) {});
                $scope.isHideTour = true;
            };

            $rootScope.$on('show-tour', function(event) {
                event.stopPropagation();
                $timeout(function() {
                    $scope.isHideTour = false;
                    UserDetails.getUser().then(function(user) {
                        $scope.tourUserName = user.firstName;
                        $scope.initializeMask();
                    });

                    EventDetailsService.get().then(function(data) {
                        $scope.eventName = data.name;
                        $scope.eventYear = data.year;
                        $scope.discountDate = moment(data.discountDate).format('MMMM Do, YYYY');
                    });
                }, 1000);
            });

            $scope.buttonClick = function() {
                if (stepCounter < totalSteps) {
                    $scope.nextStep();
                } else {
                    $scope.closeTour();
                }
            }

            $scope.nextStep = function() {
                if (stepCounter === 1) {
                    stepOne();
                } else if (stepCounter === 2) {
                    stepTwo();
                } else if (stepCounter === 3) {
                    toggleTourWindow();
                    $timeout(function() {
                        $('#tourMySite').click();
                    }, 100);
                    $timeout(function() {
                        toggleTourWindow();
                        stepThree();
                    }, 1500);
                } else if (stepCounter === 4) {
                    toggleTourWindow();
                    $timeout(function() {
                        $('#dashboardCloseButton').click();
                    }, 100);
                    $timeout(function() {
                        toggleTourWindow();
                        stepFour();
                    }, 1500);
                } else if (stepCounter === 5) {
                    toggleTourWindow();
                    $timeout(function() {
                        $('#tourRegistration').click();
                    }, 100);
                    $timeout(function() {
                        stepFive();
                        toggleTourWindow();
                    }, 1500);
                } else if (stepCounter === 6) {
                    toggleTourWindow();
                    $timeout(function() {
                        $('#dashboardCloseButton').click();
                    }, 100);
                    $timeout(function() {
                        $('.feedbackTab').click();
                        $timeout(function() {
                            toggleTourWindow();
                            stepSix();
                        }, 1000);
                    }, 1000);
                } else if (stepCounter === 7) {
                    toggleTourWindow();
                    $timeout(function() {
                        $('.feedbackTab').click();
                    }, 100);
                    $timeout(function() {
                        toggleTourWindow();
                        stepSeven();
                    }, 1500);
                    $scope.buttonText = "Close";
                }

                stepCounter++;
                setStepDisplay();
            }

            $scope.initializeMask = function() {
                $('body').append('<div id="tourMask"></div>');
                setMaskSize();
                bindResize();
                stepStart();

                function setMaskSize() {
                    $('#tourMask').height(window.height());
                    $('#tourMask').width(window.width());
                }

                function bindResize() {
                    window.bind('resize', function() {
                        setMaskSize();
                    });
                }

            }

            function unBindResize() {
                stepCounter = 1;
                $scope.buttonText = "Next";
                setStepDisplay();
                window.unbind('resize');
                $('#tourMask').remove();
            }

            function setTitle(text) {
                $scope.tourTitle = $sce.trustAsHtml(text);
            }

            function setText(text) {
                $scope.tourText = $sce.trustAsHtml(text);
            }

            function toggleTourWindow() {
                $('#tourContainer').toggle();
            }

            function setTourWindow(conObj) {
                var tourContainer = $('#tourContainer');
                var position = $(conObj.element).offset();
                tourContainer.css(
                    {
                        'top': position.top + conObj.topOffset,
                        'left': position.left + conObj.leftOffset
                    }
                );
                setIcon(conObj);
            }

            function setIcon(conObj) {
                if (conObj.iconPlacement === 'left') {
                    $('#arrow').css({'left': '0px'});
                    $('.bsTour').css({'left': '100px'});
                } else {
                    $('#arrow').css({'left': '480px'});
                    $('.bsTour').css({'left': '0px'});
                }

                function removeArrowIcons() {
                    $('#arrowIcon').removeClass('icons-arrow-right');
                    $('#arrowIcon').removeClass('icons-arrow-left');
                    $('#arrowIcon').removeClass('icons-arrow-up');
                    $('#arrowIcon').removeClass('icons-arrow-down');
                }

                removeArrowIcons();
                $('#arrowIcon').addClass('icons-arrow-' + conObj.icon);
            }

            function getText(text) {
                return BrickSlopesText.createText(text);
            }

            function getLogoText(text) {
                return getText('BrickSlopes');
            }

            function getWebText() {
                return getText('BrickSlopes.com');
            }

            function styleText(text) {
                return '<span class="bold italic">'+ text +'</span>';
            }

            function stepStart() {
                setTourWindow( {
                    element: '#tourAfols',
                    topOffset: 0,
                    leftOffset: 0,
                    iconPlacement: 'right',
                    icon: 'left'
                });
                setTitle("Welcome to " + getLogoText());
                setText("We recommend a tour to help you maximize your experience on the " + getWebText() + " website.<p>You may cancel the tour at any time by clicking the <i class='icons-close-button icons-sprite-bg'></i> button.<p>This <i class='icons-close-button icons-sprite-bg'></i> button is on the upper-right corner of every page. Clicking the button will close the page.");

            }

            function stepOne() {
                setTitle("Login, Your Site & Logout");
                setTourWindow( {
                    element: '#afolContainer',
                    topOffset: 20,
                    leftOffset: -365,
                    iconPlacement: 'right',
                    icon: 'up'
                });
                setText("We would like to help you customize your experience at the " + getText("BrickSlopes'") + " Events.<p>To start your fan experience you will need to login to " + getWebText() + ". This link will say " + styleText("'Builder Login'") + " when you need to login.<p>After logging in, clicking on the " + styleText($scope.tourUserName + "'s Site") + " will bring you to this page designed especially for you.<p>Always remember to " + styleText('Logout') + " when you are finished.");
            }

            function stepTwo() {
                setTitle($scope.tourUserName + "'s Site");
                setTourWindow( {
                    element: '#tourRegistration',
                    topOffset: 160,
                    leftOffset: -75,
                    iconPlacement: 'left',
                    icon: 'left'
                });
                setText("This section is all about you -- after all, this is your site.<p>All the information regarding your " + getText($scope.eventName) + " experience will be displayed here.<p>Click 'Next' and learn more.");
            }

            function stepThree() {
                setTitle("Your " + getLogoText() + " Information");
                setTourWindow( {
                    element: '.changePassword',
                    topOffset: 100,
                    leftOffset: 300,
                    iconPlacement: 'left',
                    icon: 'left'
                });
                setText("The 'Me' section displays all of your " + getText($scope.eventName) + " 'need-to-know' information.<p>Here you can do the following:<ul><li>Change Your Password</li><li>Change your personal information</li><li>Sign-Up for Events</li><li>Register/See your MOCs</li><li>Register/See your Activities</li><li>Become a Vendor</li></ul>");
            }

            function stepFour() {
                setTitle(getLogoText() + " Event Registration");
                setTourWindow( {
                    element: '#tourRegistration',
                    topOffset: 150,
                    leftOffset: -400,
                    iconPlacement: 'right',
                    icon: 'up'
                });
                setText("The most important feature -- " + getText($scope.eventName) + " event registration!<p>Registration has many benefits. After registering for " + getText($scope.eventName) + "(and paying), " + styleText('MOC Registration') + ", " + styleText('MOC List') + ", " + styleText('Themes') + ", and " + styleText($scope.eventYear + ' Activities') + " become unlock.");
            }

            function stepFive() {
                setTitle(getLogoText() + " Event Registration");
                setTourWindow( {
                    element: '#eventSwag',
                    topOffset: -50,
                    leftOffset: -50,
                    iconPlacement: 'left',
                    icon: 'left'
                });
                setText("The " + getText($scope.eventName) + " event is right around the corner.<p>There is a " + styleText('discount') + " to register and pay before " + styleText($scope.discountDate) + ".<p>While registering you can " + styleText('customize engraved bricks') + ", " + styleText('sign-up for the Meet & Greet') + ", " + styleText('order a t-shirt') + ", and " + styleText('particpate in drafts') + ".<p> Don't wait to register and miss out on all the fun!");
            }

            function stepSix() {
                setTitle('Feedback');
                setTourWindow( {
                    element: '.feedbackPanel',
                    topOffset: 30,
                    leftOffset: 475,
                    iconPlacement: 'left',
                    icon: 'left'
                });
                setText("Our goal is to make " + getWebText() + " the very best.<p>If you find a problem, have a question or concern, or see something you like, please send use a note using the " + styleText('Feedback') + " feature");
            }

            function stepSeven() {
                setTitle("Who's attending " + getLogoText() + "?");
                setTourWindow( {
                    element: '#tourMocList',
                    topOffset: 60,
                    leftOffset: -35,
                    iconPlacement: 'left',
                    icon: 'left'
                });
                setText("This is the end of the tour! Thanks for looking around with us.<p>Please continue to browse " + getWebText() + " by yourself. There is plenty to see and experience.<p>One last thought -- do you know who is attending " + getText($scope.eventName) + "?<p>Will you please join us in " + $scope.eventYear + "?<p>Thank you -- Brian, Cody and Steve.");
            }
        }
    };
}])
.directive("bsPlaceholder", function($timeout) {
    var txt;
    return {
        restrict: "A",
        require: '?ngModel', // get a hold of NgModelController
        link: function(scope, elem, attrs, ngModel) {
            var txt = attrs.bsPlaceholder;

            if(navigator.appVersion.indexOf("MSIE 9.")!=-1) {
                scope.$watch(attrs.ngModel, function() {
                    if(! angular.isDefined(ngModel.$modelValue)) {
                        $(elem).addClass("lightBlueFont");
                        $(elem).addClass("italic");
                    } else {
                        $(elem).removeClass("lightBlueFont");
                        $(elem).removeClass("italic");
                    }
                });

                elem.on("focus", function() {
                    if(elem.val() === txt) {
                        elem.val("");
                    }
                    scope.$apply()
                });

                elem.on("blur", function() {
                    if(elem.val() === "") {
                        elem.val(txt);
                    }
                    scope.$apply()
                });

                // Initialise placeholder
                $timeout(function() {
                    elem.val(txt)
                    scope.$apply();
                });
            } else {
                elem.attr('placeholder', txt);
            }

        }
    }
})
