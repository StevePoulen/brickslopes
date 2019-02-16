(function(angular) {
    'use strict';
    angular.module('brickSlopes').controller('starWarsRegistration', [
        '$scope',
        '$location',
        'StarWars',
        '$window',
        function(
            $scope,
            $location,
            StarWars,
            $window
        ) {
            $scope.setDisplayList = [];
            $scope.showExplanation = true;

            StarWars.getList().then(function(sets) {
                console.log(sets);
                $scope.setList = sets;
                $scope.setDisplayList = sets.filter(function(set) {
                    return (set.availability === 'Retail' || 
                        set.availability === 'Retail - limited') &&
                        set.claimed === false;
                    /*
                        set.packaging !== 'Box' &&
                        set.packaging !== 'Polybag' &&
                        set.packaging !== 'Plastic box' &&
                        set.packaging !== 'None (loose parts)' &&
                        set.packaging !== 'Other' &&
                        set.packaging !== 'Blister pack' &&
                        set.packaging !== 'Foil pack' &&
                        set.packaging !== 'Zip-lock bag' &&
                        set.packaging !== 'unknown' &&
                        set.packaging !== 'Bucket'
                    */
                    /*
                        set.availability !== 'Retail' &&
                        set.availability !== 'Retail - limited' &&
                        set.availability !== 'Retail - boxed' &&
                        set.availability !== 'Promotional' &&
                        set.availability !== 'unknown' &&
                        set.availability !== 'Not sold' &&
                        set.availability !== 'LEGOLAND exclusive' &&
                        set.availability !== 'LEGO exclusive'
                        */
                    /*
                        set.genre !== 'Promotional' &&
                        set.genre !== 'Miscellaneous' &&
                        set.genre !== 'The Clone Wars' &&
                        set.genre !== 'Seasonal' &&
                        set.genre !== 'Buildable Figures' &&
                        set.genre !== 'Legends' &&
                        set.genre !== 'Ultimate Collector Series' &&
                        set.genre !== 'Master Builder Series' &&
                        set.genre !== 'Mini Building Set' &&
                        set.genre !== 'Product Collection' &&
                        set.genre !== 'Technic' &&
                        set.genre !== 'Virtual Product Collection' &&
                        set.genre !== 'Battlefront' &&
                        set.genre !== 'Rogue One' &&
                        set.genre !== 'Minifig Pack' &&
                        set.genre !== '4+' &&
                        set.genre !== 'The Old Republic' &&
                        set.genre !== 'The Last Jedi' &&
                        set.genre !== 'Rebels' &&
                        set.genre !== 'Planet Set' &&
                        set.genre !== 'The Force Awakens' &&
                        set.genre !== 'Original Content' &&
                        set.genre !== 'LEGOLAND exclusive' &&
                        set.genre !== 'Solo' &&
                        set.genre !== 'MicroFighters' &&
                        set.genre !== 'Magazine Gift' &&
                        set.genre !== 'Episode I' &&
                        set.genre !== 'Episode II' &&
                        set.genre !== 'Episode III' &&
                        set.genre !== 'Episode IV' &&
                        set.genre !== 'Episode V' &&
                        set.genre !== 'Episode VI';
                        */
                });
            });

            $scope.closeDialog = function() {
                $location.path('/registered/index.html');
            };

            $scope.setGenreFilter = function() {
                $scope.setDisplayList = $scope.setList.filter(function(set) {
                    return set.genre === $scope.filterGenreItem;
                });
            };

            $scope.setAvailabilityFilter = function() {
                $scope.setDisplayList = $scope.setList.filter(function(set) {
                    return set.availability === $scope.filterAvailabilityItem;
                });
            };

            $scope.setPackagingFilter = function() {
                $scope.setDisplayList = $scope.setList.filter(function(set) {
                    return set.packaging === $scope.filterPackagingItem;
                });
            };

            $scope.setYearFilter = function() {
                $scope.setDisplayList = $scope.setList.filter(function(set) {
                    return set.year === $scope.filterYearItem;
                });
            };

            $scope.setClaimedFilter = function() {
                $scope.setDisplayList = $scope.setList.filter(function(set) {
                    if ($scope.filterClaimedItem === 'claimed') {
                        return set.user !== null;
                    } else if ($scope.filterClaimedItem === 'claimedByMe') {
                        return set.userId === $window.sessionStorage.userId;
                    } else {
                        return set.user === null;
                    }
                });
            };

            $scope.toggleExplanation = function() {
                $scope.showExplanation = !$scope.showExplanation;
            };

            $scope.claimSet = function(set) {
                StarWars.claim(set.id).then(function() {
                    set.claimed = true;
                    set.claim = false;
                    set.unclaim = true;
                    set.user = $window.sessionStorage.firstName + ' ' + $window.sessionStorage.lastName.substring(0, 1);
                });
            };

            $scope.unclaimSet = function(set) {
                StarWars.unclaim(set.id).then(function() {
                    set.claimed = false;
                    set.claim = true;
                    set.unclaim = false;
                });
            };
        }
    ]);
})(angular);
