angular.module('app.navigation')
    .directive('navigation', function() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            controller: 'NavCtrl',
            link: function(scope, element, attrs) {

            },
            template: '<ul class="nav" data-ng-transclude=""></ul>'
        };
    })
    .directive('navGroup', function() {
        return {
            restrict: 'E',
            controller: 'NavCtrl',
            transclude: true,
            replace: true,
            scope: {
                icon: '@',
                title: '@',
                active: '=?'
            },
            link: function(scope, element) {

                $(element).on('click', function(){

                    $parent = $(this).closest('li.has-sub');

                    if($('.sub-menu', $parent).is(':visible'))
                        return;

                    var target = $('.sub-menu', $parent);
                    var otherMenu = '.sidebar .nav > li.has-sub > .sub-menu';

                    if ($('.page-sidebar-minified').length === 0) {
                        $(otherMenu).not(target).slideUp(250);
                        $(target).slideToggle(250);
                    }

                });

            },
            template: '\
				<li class="has-sub" ng-class="{ active: active }">\
					<a href="javascript:void(0)">\
                        <b class="caret pull-right"/>\
						<i data-ng-if="icon" class="fa fa-lg fa-fw {{ icon }}"></i>\
						<span>{{ title }}</span>\
					</a>\
					<ul class="sub-menu" data-ng-transclude=""></ul>\
				</li>'
        };
    })
    .directive('navItem', ['$window', '$state', function($window, $state) {

        return {
            require: ['^navigation', '^?navGroup'],
            restrict: 'E',
            scope: {
                title: '@',
                icon: '@',
                target: '@',
                state: '@'
            },
            link: function(scope, element, attr, parents) {

                var navGrp = parents[1];

                if(navGrp)
                {
                    if($state.$current.name !== '') {
                        if($state.$current.name === scope.state)
                            navGrp.setActive();
                    }
                    else {
                        scope.$on('$stateChangeSuccess', function() {
                            if($state.includes(scope.state))
                                navGrp.setActive(true, $state.$current.name);
                            else
                                navGrp.setActive(false, $state.$current.name);
                        });
                    }
                }

            },
            transclude: true,
            replace: true,
            template: '\
				<li ui-sref-active="active">\
					<a data-ng-if="state" ui-sref="{{ state }}" target="{{ target }}" title="{{ title }}">\
						<i data-ng-if="icon" class="fa fa-lg fa-fw {{ icon }}"><em data-ng-if="hasIconCaption"> {{ iconCaption }} </em></i>\
						<span ng-class="{\'menu-item-parent\': !isChild}" data-localize="{{ title }}"> {{ title }} </span>\
					</a>\
				</li>'
        };
    }]);
