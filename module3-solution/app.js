(function() {
    'use strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .constant('ApiBasePath', "http://davids-restaurant.herokuapp.com")
        .directive('foundItems', FoundItemsDirective);

    function FoundItemsDirective() {
        var ddo = {
            templateUrl: 'founditems.html',
            scope: {
                items: '<',
                onRemove: '&'
            },
            controller: FoundItemsDirectiveController,
            controllerAs: 'list',
            bindToController: true
        };

        return ddo;
    }

    function FoundItemsDirectiveController() {
        var list = this;

        list.isEmpty = function() {
            if (list.items.length === 0)
                return true;
            else
                return false;
        };
    }

    NarrowItDownController.$inject = ['MenuSearchService'];

    function NarrowItDownController(MenuSearchService) {
        var menu = this;
        menu.found = [];

        menu.getMatchedMenuItems = function(searchTerm) {
            menu.found = MenuSearchService.getMatchedMenuItems(searchTerm);
        };

        menu.removeItem = function(index) {
            menu.found.splice(index, 1);
        };
    }


    MenuSearchService.$inject = ['$http', 'ApiBasePath'];

    function MenuSearchService($http, ApiBasePath) {
        var service = this;

        service.getMatchedMenuItems = function(searchTerm) {
            var promise = $http({
                method: "GET",
                url: (ApiBasePath + "/menu_items.json")
            });

            return promise.then(function(response) {
                var data = response.data;
                var foundItems = [];
                data.forEach(function(item) {
                    if (item.description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1)
                        foundItems.push(item);
                });
                return foundItems;
            });
        };
    }

})();