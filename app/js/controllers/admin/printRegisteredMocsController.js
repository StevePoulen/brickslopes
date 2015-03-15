'use strict';

angular.module('Admin').controller('PrintMocs', ['$scope', '$location', 'MocDetails', function($scope, $location, MocDetails) {
    $scope.registeredMocs = undefined;
    $scope.eventId = 2;

    MocDetails.getList($scope.eventId).then(function(data) {
        $scope.registeredMocs = data;
    });

    $scope.closeDialog = function() {
        $location.path("/admin/index.html");
    }

    $scope.printMocs = function() {
        var printContents = document.getElementById('printMocs').innerHTML;
        var popupWin = window.open('', '_blank', 'width=300,height=300');
        popupWin.document.open();
        popupWin.document.write('<html><head><link rel="stylesheet" href="/css/brickslopes.css" media="print"/></head><body onload="window.print()">' + printContents + '</html>');
        popupWin.document.close();
    }
}]);
