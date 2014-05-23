// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('brickSlopes.services', [])
.factory('BrickSlopesText', [ function() {
    var __fontSize = undefined;
    var __fontColor = undefined;
    var __eventImageText = undefined;

    return {
        __setFontSize: function(fontSize) {
            __fontSize = (fontSize) ? fontSize : 1;
        },

        __setFontColor: function(fontColor) {
            __fontColor = (fontColor) ? fontColor + "Font" : "blueFont";
        },

        createText: function(text, fontSize, fontColor) {
            this.__setFontSize(fontSize);
            this.__setFontColor(fontColor);

            var capsFont = "font-size: " + __fontSize + "em;";
            var smallFontNumber = __fontSize * .8;
            var smallFont = "font-size: " + smallFontNumber + "em;";
            var outputWord = "";
            text = text.replace(/\-/g, ' - ');
            text = text.replace(/\*/g, '* ');
            text = text.replace(/\>/g, '> ');
            var wordArray = text.split(/\s/g);

            _.each(wordArray, function(word) {
                var firstLetter = word[0].toUpperCase();
                var remainder = word.slice(1).toUpperCase();
                outputWord += '<span style="' + capsFont + '">' + firstLetter + '</span>';
                if (remainder != "*" && remainder != '') {
                    outputWord += '<span style="' + smallFont + '">' + remainder + '</span>';
                    outputWord += '&nbsp;';
                }
            });

            outputWord = outputWord.replace(/\*<\/span>&nbsp;/g, '</span>');
            outputWord = outputWord.replace(/\&nbsp;$/, '');

            return '<span class="' + __fontColor + ' bold">' + outputWord +  '</span>';
        }
    }
}])
.factory('GetAfolMocList', ['$q', '$http', function($q, $http) {
    var mocList = undefined;

    return {
        getCount: function() {
            if (mocList) {
                return $q.when(mocList.afolMocCount);
            } else {
                return $q.when(this.getList().then(function(data) {
                    return mocList.afolMocCount;
                }));
            }
        },

        getList: function() {
            if (mocList) {
                return $q.when(mocList);
            } else {
                return $q.when($http.get('/controllers/mocs/getRegisteredMocList.php').then(function(data) {
                    mocList = data.data;
                    return mocList.mocs;
                }));
            }
        }
    };
}]);
