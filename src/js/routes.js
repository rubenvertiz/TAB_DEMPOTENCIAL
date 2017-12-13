'use strict';

/**
 * Route configuration for the RDash module.
 */
angular.module('RDash').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        // For unmatched routes
        $urlRouterProvider.otherwise('/tablero');

        // Application routes
        $stateProvider
            .state('test', {
                url: '/test',
                views:{
                    '':{
                        templateUrl: 'templates/tab-originacion.view.html',
                        controller: 'tabOriginacionCtrl'
                    }
                }
            })
            .state('carga', {
                url: '/carga',
                views:{
                    '':{
                        templateUrl: 'templates/tablero-carga-archivo-gen.view.html',
                        controller: 'tableroCargaArchivoGenCtrl'
                    }
                }
            })
            .state('tablero', {
                url: '/tablero',
                views:{
                    '':{
                        templateUrl: 'templates/tablero-principal.view.html',
                        controller:'tableroPrincipalViewCtrl'
                    },
                    'resumen@tablero':{
                        templateUrl: 'templates/tablero-resumen.view.html',
                        controller:'tableroResumenViewCtrl'
                    },
                    'porArea@tablero':{
                        templateUrl: 'templates/tablero-area-negocio.view.html',
                        controller:'tableroAreaNegocioViewCtrl'
                    },
                    'tabOriginacion@tablero':{
                        templateUrl: 'templates/tab-originacion.view.html',
                        controller: 'tabOriginacionCtrl'
                    },
                    'tabDemandaPotencial@tablero':{
                        templateUrl: 'templates/tab-demanda-potencial.view.html',
                        controller: 'tabDemandaPotencialCtrl'
                    }
                }
            })
    }
]).filter('percentFilter', function () {
    return function (value, scope) {
        var res="";
        if(angular.isDefined(value)){
            if(angular.isDefined(value.toFixed)){
                res=(value.toFixed(1)) +" %";
            }else{
                res=value+" %";
            }

        }
        return res;
    };
});;


