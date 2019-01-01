(function(angular) {
    'use strict';
    angular.module('brickSlopes')
    .factory('Themes', [
        '$q',
        '$http',
        'EventSelectionFactory',
        function(
            $q,
            $http,
            EventSelectionFactory
        ) {
            var themeList = undefined;

            function filterByTheme(themeName) {
                var singleTheme  = undefined;
                _.each(themeList, function(theme, index) {
                    if (theme.theme === themeName) {
                        singleTheme = theme;
                    }
                });
                return singleTheme;
            }

            return {
                getThemeObject: function(themeName) {
                    if (themeList) {
                        return $q.when(filterByTheme(themeName));
                    } else {
                        return $q.when(this.getList().then(function(data) {
                            return filterByTheme(themeName);
                        }));
                    }
                },

                getCount: function() {
                    if (themeList) {
                        return $q.when(themeList.length);
                    } else {
                        return $q.when(this.getList().then(function(data) {
                            return themeList.length;
                        }));
                    }
                },

                getList: function() {
                    if (themeList) {
                        return $q.when(themeList);
                    } else {
                        return $q.when($http (
                            {
                                method: 'GET',
                                url: '/controllers/paid/themes.php',
                                params: {
                                    eventId: EventSelectionFactory.getSelectedEvent()
                                }
                            }
                        ).then(function(data) {
                            themeList = data.data;
                            return themeList;
                        }));
                    }
                }
            }
        }
    ]);
})(angular);
