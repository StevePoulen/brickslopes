(function(angular) {
    'use strict';
    angular.module('brickSlopes').controller('afolMocRegistration', [
        '$scope',
        '$location',
        '$window',
        'Themes',
        'MocDetails',
        '$route',
        'EventSelectionFactory',
        function(
            $scope,
            $location,
            $window,
            Themes,
            MocDetails,
            $route,
            EventSelectionFactory
        ) {
            function buildRange(start, end) {
                var range = [];
                for (var i = start; i < end; i++) {
                    range.push(i);
                }
                return range;
            }

            function errorMessage(status) {
                $scope.verifying = false;
                if (status === 400) {
                    $scope.displayErrorMessage = 'The MOC travails.';
                }
            }

            $scope.firstName = $window.sessionStorage.firstName;
            $scope.lastName = $window.sessionStorage.lastName;
            $scope.themeList = [];
            $scope.width = buildRange(1, 55);
            $scope.depth = buildRange(1, 7);
            $scope.displayErrorMessage = null;
            $scope.displayMessage = null;
            $scope.showModal = false;
            $scope.isMocUpdate = false;
            $scope.buttonText = 'Register My MOC';

            function setDefaultScopeVariables() {
                $scope.data = Object({
                    eventId: EventSelectionFactory.getSelectedEvent(),
                    mocId: $route.current.params.mocId ? $route.current.params.mocId : null,
                    displayName: $scope.firstName + ' ' + $scope.lastName,
                    baseplateWidth: 1,
                    baseplateDepth: 1,
                    theme: $scope.themeList[0] ? $scope.themeList[0] : null,
                    themeId: null,
                    title: null,
                    mocImageUrl: null,
                    description: null,
                    isSet: 'false',
                    isTfol: 'false'
                });
            }

            $scope.isSet = function() {
                return $scope.data.isSet === 'true' ? 'S' : '';
            }

            $scope.isTfol = function() {
                return $scope.data.isTfol === 'true' ? 'T' : '';
            }

            Themes.getList().then(function(themes) {
                _.forEach(themes, function(theme) {
                    if (theme.selectable === 'YES') {
                        $scope.themeList.push(theme);
                    }
                });
                $scope.theme = $scope.themeList[0];
                $scope.data.themeId = $scope.theme.themeId;
            });

            function serializeMocJson() {
                $scope.data.themeId = $scope.data.theme.themeId;
                delete $scope.data.theme;
                return $scope.data;
            }

            function updateMoc() {
                MocDetails.update(serializeMocJson()).then(function(status) {
                    $scope.registrationForm.$setPristine();
                    setDefaultScopeVariables();
                    $scope.showModal = true;
                    MocDetails.expireCache();
                    $scope.isMocUpdate = false;
                    $scope.buttonText = 'Register My MOC';
                    $scope.verifying = false;
                }, function(status) {
                    errorMessage(status);
                });
            }

            function createMoc() {
                MocDetails.create(serializeMocJson()).then(function(status) {
                    $scope.registrationForm.$setPristine();
                    setDefaultScopeVariables();
                    $scope.showModal = true;
                    MocDetails.expireCache();
                    $scope.verifying = false;
                }, function(status) {
                    errorMessage(status);
                });
            }

            $scope.submitRegistration = function() {
                $scope.verifying = true;
                if ($scope.isMocUpdate) {
                    updateMoc();
                } else {
                    createMoc();
                }
            };

            $scope.closeDialog = function() {
                $location.path('/registered/index.html');
            };

            function setUpdateModel(moc) {
                $scope.data = moc;
                $scope.data.baseplateWidth = parseInt(moc.baseplateWidth, 10);
                $scope.data.baseplateDepth = parseInt(moc.baseplateDepth, 10);
                Themes.getThemeObject(moc.theme).then(function(theme) {
                    $scope.data.theme = theme;
                });
            }

            if (
                angular.isDefined($route) &&
                angular.isDefined($route.current) &&
                angular.isDefined($route.current.params) &&
                angular.isDefined($route.current.params.mocId)
            ) {
                MocDetails.getMocById($route.current.params.mocId).then(function(moc) {
                    if (moc) {
                        $scope.isMocUpdate = true;
                        $scope.buttonText = 'Update My MOC';
                        setUpdateModel(moc)
                    }
                });
            }

            $scope.$watch('theme', function(newTheme) {
                if (angular.isDefined(newTheme)) {
                    $scope.data.themeId = newTheme.themeId;
                }
            });


            setDefaultScopeVariables();
        }
    ]);
})(angular);
