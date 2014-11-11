// APP DIRECTIVES
// main directives
// directives for navigation
angular.module('app.navigation', [])
	.directive('navigation', function() {
		return {
			restrict: 'AE',
			controller: ['$scope', function($scope) {

			}],
			transclude: true,
			replace: true,
			link: function(scope, element, attrs) {
				if (!$topmenu) {
					if (!null) {
						element.first().jarvismenu({
							accordion : true,
							speed : $.menu_speed,
							closedSign : '<em class="fa fa-plus-square-o"></em>',
							openedSign : '<em class="fa fa-minus-square-o"></em>'
						});
					} else {
						alert("Error - menu anchor does not exist");
					}
				}

				// SLIMSCROLL FOR NAV
				if ($.fn.slimScroll) {
					element.slimScroll({
				        height: '100%'
				    });
				}

				scope.getElement = function() {
					return element;
				}
			},
			template: '<nav><ul data-ng-transclude=""></ul></nav>'
		};
	})

	.controller('NavGroupController', ['$scope', function($scope) {
		$scope.active = false;
		$scope.hasIcon = angular.isDefined($scope.icon);
	    $scope.hasIconCaption = angular.isDefined($scope.iconCaption);

	    this.setActive = function(active) {
	    	$scope.active = active;
	    }

	}])
	.directive('navGroup', function() {
		return {
			restrict: 'AE',
			controller: 'NavGroupController',
			transclude: true,
			replace: true,
			scope: {
				icon: '@',
				title: '@',
				iconCaption: '@',
				active: '=?',
				state: '@'
			},
			template: '\
				<li ui-sref-active="open">\
					<a href="javascript:void(0)">\
						<i data-ng-if="hasIcon" class="{{ icon }}"><em data-ng-if="hasIconCaption"> {{ iconCaption }} </em></i>\
						<span class="menu-item-parent" data-localize="{{ title }}">{{ title }}</span>\
					</a>\
					<ul data-ng-transclude=""></ul>\
				</li>'
		};
	})

	.controller('NavItemController', ['$rootScope', '$scope', '$location', '$state', function($rootScope, $scope, $location, $state) {
		$scope.isChild = false;
		$scope.active = false;

	    $scope.hasIcon = angular.isDefined($scope.icon);
	    $scope.hasIconCaption = angular.isDefined($scope.iconCaption);

	    $scope.getItemTarget = function() {
	    	return angular.isDefined($scope.target) ? $scope.target : '_self';
	    };

	}])
	.directive('navItem', ['$window', '$state', function($window, $state) {
		return {
			require: ['^navigation', '^?navGroup'],
			restrict: 'AE',
			controller: 'NavItemController',
			scope: {
				title: '@',
				view: '@',
				icon: '@',
				iconCaption: '@',
				href: '@',
				target: '@'
			},
			transclude: true,
			replace: true,
			template: '\
				<li ui-sref-active="active">\
					<a ui-sref="{{ view }}" target="{{ getItemTarget() }}" title="{{ title }}">\
						<i data-ng-if="hasIcon" class="{{ icon }}"><em data-ng-if="hasIconCaption"> {{ iconCaption }} </em></i>\
						<span ng-class="{\'menu-item-parent\': !isChild}" data-localize="{{ title }}"> {{ title }} </span>\
						<span data-ng-transclude=""></span>\
					</a>\
				</li>'
		};
	}]);
