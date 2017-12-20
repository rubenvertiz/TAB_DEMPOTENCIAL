angular
    .module('RDash')
    .controller('tabDemandaPotencialCtrl', [
        '$scope',
        '$rootScope',
        'chartDataService',
        'globalsController',
        function ($scope,$rootScope,cds,gc)  {
            ctrl=this;
            $scope.estados =[];
            $scope.datosEstado=[];

            ctrl.init=function () {

                //Inicializar modelo
                $scope.m={}; //modelo deberá contener los mismos objetos que el servicio

                $scope.option={
                    filters:[
                        {
                            txCol:"PUNTOS",
                            txAlias:"",
                            varValue:"Califica",
                            txValueType:"TEXTO",
                            txLogicOperator:"AND",
                            txCompOperator:"="
                        }
                    ]
                };
                //tabDemPotSrvc.getGeneralData();
            };

            $rootScope.$on('resumenEstatusCick',function ($event,data) {
                console.log("resumenEstatusCick - INI");
                console.log(data);

                $rootScope.estatus=data.dataItem.dataContext.txEstatus;
                console.log($rootScope.estatus);
                $scope.option.filters=[
                    {
                        txCol:"PUNTOS",
                        txAlias:"",
                        varValue:$rootScope.estatus,
                        txValueType:"TEXTO",
                        txLogicOperator:"AND",
                        txCompOperator:"="
                    }
                ];
                $scope.$apply();
                console.log($scope.option.filters);
                console.log("resumenEstatusCick - END");
            });

            $scope.generaReporteCSV=function(elem){
                $scope.getEstados("csv");
            };

            /*$scope.generaReporteXLSX=function(elem){
                $scope.getEstados("xlsx");
            };*/

            $scope.getEstados = function(formato){
                console.log("getEstados");
                cds.addWorkTask('getEstados', {
                    url:gc.conf.xsServicesBaseUrl+'/execTabQuery.xsjs',
                    query: {
                        idTab: 1002,
                        idGra: 2,
                        idQry: 1
                    },
                    success: function (response) {
                        console.log("success");
                        console.log(response);
                        var nombreArchivo;
                        var operacion;
                        var cveEdo;
                        if(response.data.length>0) {
                           for(var i = 0; i < response.data.length; ++i){
                                    //$scope.getDataEstado(response.data[i], formato);
                                    nombreArchivo = response.data[i].txEstado;
                                    nombreArchivo = nombreArchivo+"-"+new Date().getTime();
                                    cveEdo = response.data[i].txClave;
                                    //creamos el archivo
                                    operacion="Crear";
                                    $scope.ejcutaOperacion(cveEdo,operacion,nombreArchivo);
                            }
                        }
                    },
                    error: function (response, error) {
                        console.log("Error");
                        console.log(error);
                    }
                });
                cds.doWorkTask('getEstados');
            }

            $scope.ejcutaOperacion=function(cveEdo,operacion,nombreArchivo){
                var url = "http://10.82.0.80:9080/ArchMunicipios/creArchivos?esto=cveEdo&Tipo=operacion&Nombre=nombreArchivo";
                url = url.replace("cveEdo",cveEdo);
                url = url.replace("operacion",operacion);
                url = url.replace("nombreArchivo",nombreArchivo);
                cds.addWorkTask('ejcutaOperacion', {
                    url:url,
                    success: function (response) {
                        console.log("success");
                        console.log(response);
                    },
                    error: function (response, error) {
                        console.log("Error");
                        console.log(error);
                    }
                });
                cds.doWorkTask('ejcutaOperacion');
            }


            $scope.getDataEstado = function(estado, formato){
                console.log("getDataEstado");
                var condCvEsto = {
                    txCol: "CV_ESTO",
                    txAlias: "",
                    varValue: estado.txClave,
                    txValueType: "TEXTO",
                    txLogicOperator: "AND",
                    txCompOperator: "="
                };

                var obConditions = [];
                obConditions.push(condCvEsto);
                // detalle
                cds.addWorkTask('getDataEstado', {
                    //url:gc.conf.xsServicesBaseUrl + '/execTabQueryFilter.xsjs',
                    url:gc.conf.xsServicesBaseUrl + '/execTabQueryFilterLimitOffset.xsjs',
                    query: {
                        idTab: 1002,
                        idGra: 3,
                        idQry: 1,
                        lstObConditions: obConditions,
                        limit:160000,
                        offset:0
                    },
                    success: function (response) {
                        console.log("success");
                        console.log(response);
                        if(response.data !== null && response.data.length>0) {
                            if(formato === "csv"){
                                $scope.arrayObjToCsv(estado,response.data);
                            }else{
                                $scope.generaXLSX(estado,response.data);
                            }

                        }
                    },
                    error: function (response, error) {
                        console.log("Error");
                        console.log(error);
                    }
                });
                cds.doWorkTask('getDataEstado');
            }


            $scope.generaXLSX = function exportSheetJS(estado,dataJson) {
                console.log("exportSheetJS");
                var d = new Date();
                console.log("inicio");
                console.log(d.getHours()+":"+d.getMinutes());
                console.log(estado.txClave);
                console.log(estado.txEstado);
                var fileName = estado.txClave+"-"+estado.txEstado+'.xlsx';
                var sheetName = 'Reporte '+estado.txEstado;
                var wopts ={ bookType: 'xlsx', bookSST: true, type: 'binary' };
                var wb = XLSX.utils.book_new(), ws = $scope.arrayToSheetOpt(dataJson);
                XLSX.utils.book_append_sheet(wb, ws, sheetName);
                var wbout = XLSX.write(wb, wopts);
                saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), fileName);
                d = new Date();
                console.log("fin");
                console.log(d.getHours()+":"+d.getMinutes());
                return wbout;
            }

            $scope.arrayToSheetOpt = function (data) {
                console.log("arrayToSheet");
                console.log(data.length);
                var o = [], valor = '';

                //creamos contenido del archivo
                for (var i = 0; i < data.length; i++) {
                    //construimos cabecera del csv
                    if (i === 0) {
                        o.push(Object.keys(data[i]));
                    }else {
                        //resto del contenido
                        valor = Object.keys(data[i]).map(function(key){
                            return data[i][key];
                        });
                        o.push(valor);
                    }
                }
                /* aoa_to_sheet converts an array of arrays into a worksheet object */
                return XLSX.utils.aoa_to_sheet(o);
            }

            function s2ab(s) {
                if(typeof ArrayBuffer !== 'undefined') {
                    var buf = new ArrayBuffer(s.length);
                    var view = new Uint8Array(buf);
                    for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                    return buf;
                } else {
                    var buf = new Array(s.length);
                    for (var i=0; i!=s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
                    return buf;
                }
            }

            $scope.arrayObjToCsv = function (estado,dataJson) {
                //comprobamos compatibilidad
                if(window.Blob && (window.URL || window.webkitURL)){
                    var contenido = "",
                        fileName = estado.txClave+"-"+estado.txEstado+'.csv';
                   //creamos contenido del archivo
                    for (var i = 0; i < dataJson.length; i++) {
                        //construimos cabecera del csv
                        if (i == 0)
                            contenido += Object.keys(dataJson[i]).join("\t") + "\n";
                        //resto del contenido
                        contenido += Object.keys(dataJson[i]).map(function(key){
                            return dataJson[i][key];
                        }).join("\t") + "\n";
                    }
                    //creamos el blob
                    blob =  new Blob(["\ufeff", contenido], {type: 'text/csv'});
                    saveAs(blob, fileName);
                }else {
                    //el navegador no admite esta opción
                    alert("Su navegador no permite esta acción");
                }
            };

            ctrl.init();
        }]);