angular
    .module('RDash')
    .service('tabOriginacionSrvc',[
        '$rootScope',
        'chartDataService',
        'globalsController',
        function ($rootScope,cds,gc) {
            srvc=this;

            srvc.initMockModel=function () {
                var datosGenerales={
                    nuCreditos:100,
                    nuMonto:1000000,
                    txAnio:"2017"
                };

                var creditosPorEdo=[
                    {
                        txEdo:"NUEVO LEON",
                        nuCreditos:100
                    },
                    {
                        txEdo:"QUERETARO",
                        nuCreditos:100
                    },
                    {
                        txEdo:"CDMX",
                        nuCreditos:100
                    },
                    {
                        txEdo:"OAXACA",
                        nuCreditos:100
                    }
                ];

                var montoPorEdo=[
                    {
                        txEdo:"NUEVO LEON",
                        nuCreditos:100
                    },
                    {
                        txEdo:"QUERETARO",
                        nuCreditos:100
                    },
                    {
                        txEdo:"CDMX",
                        nuCreditos:100
                    },
                    {
                        txEdo:"OAXACA",
                        nuCreditos:100
                    }
                ];

                return {
                    general:datosGenerales,
                    creditosPorEdo:creditosPorEdo,
                    montoPorEdo:montoPorEdo
                }
            };

            //Consumo de servicios
            srvc.getGeneralData=function () {
                var _srvc=srvc;
                cds.addWorkTask('tabOriginacionSrvc.getGeneralData22',{
                    url:gc.conf.xsServicesBaseUrl+'/execTabQuery.xsjs',
                    query:{
                        idTab:50,
                        idGra:1,
                        idQry:1
                    },
                    success: function(response){
                        console.log("50,1,1 success");
                        console.log(response);
                        console.log(srvc);
                        console.log(_srvc);
                        //srvc.model.datosDuros=response.data[0];
                        _srvc.notify(srvc.eventos.datosDuros,response.data[0]);
                    },
                    error: function(response,error){
                        console.log("Error");
                        console.log(error);
                        $scope.detalleExcelOpt.matchColumnDef  = [];
                        $scope.colRequeridasOpt.data = [];
                        $scope.detalleExcelOpt.matchColumnHead = [];
                    }
                });

                cds.doWorkTask('tabOriginacionSrvc.getGeneralData22');
            };

            srvc.initModel=function () {
                //mock
                srvc.model=srvc.initMockModel();

                //eventos
                srvc.eventos= {
                    datosDuros: "tabOriginacionSrvc.datosDuros",
                    creditosEdo: "tabOriginacionSrvc.creditosEdo",
                    montoEdo: "tabOriginacionSrvc.montoEdo"
                };

            };

            /*
            srvc.startMockEvents=function () {
                //Emular eventos
                srvc.notify(srvc.eventos.datosDuros,srvc.model.general);
                srvc.notify(srvc.eventos.creditosEdo,srvc.model.creditosPorEdo);
                srvc.notify(srvc.eventos.montoPorEdo,srvc.model.montoEdo);
            };
            */

            //<editor-fold desc="Eventos">
            srvc.suscribe=function (scope,callback,txEvent){
                var handler=$rootScope.$on(txEvent,callback);
                scope.$on('$destroy',handler);
            };

            srvc.notify=function (txEventName,obParm) {
                console.log("srvc.notify ini "+ txEventName);
                $rootScope.$emit(txEventName,obParm);
                console.log("srvc.notify end "+ txEventName);
            };
            //</editor-fold>

            srvc.initModel();
        }
    ]);