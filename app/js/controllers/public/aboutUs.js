'use strict';

angular.module('Public').controller('aboutUs', ['$scope', '$route', '$location', function($scope, $route, $location) {
    if ($route.current && $route.current.params && $route.current.params.eventId) {
        $scope.eventId = $route.current.params.eventId;
    } else {
        $scope.eventId = 0;
    }

    var images = [
        'did_you_know.png',
        'rules_of_the_sea_dress.png',
        'believe.png',
        'expressions_of_emmet.png',
        'rules_of_the_sea_abandon.png',
        'expressions_of_good_cop.png',
        'rules_of_the_sea_jolly_rogers.png',
        'groot_vs_batman.png'
    ];

    function getImage() {
        if (images[$scope.eventId]) {
            return images[$scope.eventId];
        } else {
            $scope.eventId = 0;
            return images[0];
        }
    };

    function setImageUrl() {
        $scope.imageUrl = "/images/emails/images/" + getImage();
    };

    function incrementEventId() {
        $scope.eventId++;
        if ($scope.eventId >= images.length) {
            $scope.eventId = 0;
        }
    }

    function decrementEventId() {
        $scope.eventId--;
        if ($scope.eventId < 0 ) {
            $scope.eventId = images.length - 1;
        }
    }

    $scope.next = function() {
        incrementEventId();
        $location.path('/aboutus/' + $scope.eventId);
    };

    $scope.previous = function() {
        decrementEventId();
        $location.path('/aboutus/' + $scope.eventId);
    };

    $scope.tickets = function() {
        $location.path("/tickets.html");
    };

    setImageUrl();

}]);

