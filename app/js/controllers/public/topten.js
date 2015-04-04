'use strict';

angular.module('Public').controller('topten', ['$scope', '$route', '$location', function($scope, $route, $location) {
    if ($route.current && $route.current.params && $route.current.params.eventId) {
        $scope.eventId = $route.current.params.eventId;
    } else {
        $scope.eventId = 0;
    }

    var images = [
        {
            picture: 'white_house.jpg',
            title: 'An inauguration at the White House'
        },
        {
            picture: 'ironman.jpg',
            title: 'Without a need for introduction ... IronMan'
        },
        {
            picture: 'hansolo.jpg',
            title: 'Han Solo in Carbonite'
        },
        {
            picture: 'computer.jpg',
            title: 'Your first PC'
        },
        {
            picture: 'colosseum.jpg',
            title: 'Roman Colosseum'
        },
        {
            picture: 'chapel.jpg',
            title: 'The view from the choir'
        },
        {
            picture: 'camper.jpg',
            title: 'Breaking Bad'
        },
        {
            picture: 'butterfly.jpg',
            title: 'Butterfly'
        },
        {
            picture: 'robot_vs_godzilla.jpg',
            title: 'Mech vs. Godzilla'
        },
        {
            picture: 'apples.jpg',
            title: 'An apple a day ...'
        }
    ];
    //'battleship.jpg',
    //'alien.jpg'

    $scope.pageHeight = "heightTopTen";
    $scope.showTitle = true;
    $scope.showSteps = true;
    $scope.totalSteps = images.length;

    function setTitle() {
        $scope.title = images[$scope.eventId].title;
    }

    function getImage() {
        if (! images[$scope.eventId]) {
            $scope.eventId = 0;
        }

        calculateStep();
        setTitle();
        return images[$scope.eventId].picture;
    };

    function setImageUrl() {
        $scope.imageUrl = "/images/emails/images/" + getImage();
    };

    function calculateStep() {
        $scope.step = parseInt($scope.eventId, 10) + 1;
    }

    function incrementEventId() {
        $scope.eventId++;
        if ($scope.eventId >= images.length) {
            $scope.eventId = 0;
        }
        calculateStep();
    }

    function decrementEventId() {
        $scope.eventId--;
        if ($scope.eventId < 0 ) {
            $scope.eventId = images.length - 1;
        }
        calculateStep();
    }

    $scope.next = function() {
        incrementEventId();
        $location.path('/topten/' + $scope.eventId);
    };

    $scope.previous = function() {
        decrementEventId();
        $location.path('/topten/' + $scope.eventId);
    };

    $scope.tickets = function() {
        $location.path("/tickets.html");
    };

    setImageUrl();

}]);

