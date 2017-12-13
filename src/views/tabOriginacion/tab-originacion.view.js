angular
    .module('RDash')
    .controller('tabOriginacionCtrl', [
        '$scope',
        '$rootScope',
        'tabOriginacionSrvc',
        function ($scope,$rootScope,tabOrgSrvc)  {
            ctrl=this;

            ctrl.init=function () {
                console.log("=== INIT 1");
                //Inicializar modelo
                $scope.m={}; //modelo deberá contener los mismos objetos que el servicio

                //Inscribir eventos
                tabOrgSrvc.suscribe($scope,ctrl.onDatosDuros,tabOrgSrvc.eventos.datosDuros);
                tabOrgSrvc.suscribe($scope,ctrl.onCreditosEdo,tabOrgSrvc.eventos.creditosEdo);
                tabOrgSrvc.suscribe($scope,ctrl.onMontoEdo,tabOrgSrvc.eventos.montoEdo);

                //Inicialiar
                $scope.vm={
                    infos:{
                        anio:{
                            title:"Año",
                            icon:"fa-3x fa-calendar"
                        },
                        creditos:{
                            title:"Créditos",
                            icon:"fa-3x fa-users"
                        },
                        montos:{
                            title:"Monto",
                            icon:"fa-3x fa-users"
                        }
                    }
                };


                //tabOrgSrvc cuando sean mocks
                ///srvc.startMockEvents();

                tabOrgSrvc.getGeneralData();

                console.log("=== INIT 2");
            };

            //Eventos
            ctrl.onDatosDuros=function (event,ob) {
                console.log("ctrl.onDatosDuros");
                console.log(ob);
                ob.nuMonto=ob.nuMonto/1000000;
                $scope.m.general=ob;

            };
            ctrl.onCreditosEdo=function (event,ob) {
                $scope.m.creditosPorEdo=ob;
            };
            ctrl.onMontoEdo=function (event,ob) {
                $scope.m.montoPorEdo=ob;
            };

            ctrl.init();
        }]);