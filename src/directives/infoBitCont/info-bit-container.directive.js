angular
    .module('RDash')
    .directive('infoBitCont', [
        '$rootScope',
        'toolsService',
        function ($rootScope,tools) {
            var directive = {
                restrict: 'E',
                transclude: true,
                scope: {
                    'classIcon':'=?',
                    'title':'=',
                    'nuData':'=',
                    'titleClass':'=?',
                    'txFormat':'@'
                },
                templateUrl: 'templates/info-bit-container.directive.html',
                link: function (scope, element, attrs, controllers, $jq) {
                    var hndlr=scope.$watch('nuData',function (newVal, oldVal) {
                        console.log("=== INFO BIT CONT 1");
                        if(angular.isDefined(scope.txFormat)){
                            var res=_.attempt(function () {
                                scope.txVal="";
                                scope.txVal=$.formatNumber(scope.nuData.toString(), {format:scope.txFormat, locale:"us"});
                            });

                            if(_.isError(res)){
                                console.log("=== INFO BIT CONT ERROR 1");
                            }

                        }else{
                            var res=_.attempt(function () {
                                scope.txVal=scope.nuData.toString();
                            });

                            if(_.isError(res)){
                                console.log("=== INFO BIT CONT ERROR 2");
                            }

                        }
                        console.log("=== INFO BIT CONT 2");
                    });

                    scope.$on('$destroy',hndlr);





                }
            };
            return directive;
        }]);