angular
    .module('RDash')
    .controller('tableroPrincipalViewCtrl', [
        '$scope',
        '$rootScope',
        '$state',
        '$stateParams',
        'dataController',
        'globalsController',
        'dataStoreService',
        'consoleService',
        '$interval',
        'toolsService',
        'chartDataService',
        'uiGridConstants',
        function ($scope,$rootScope,$state,$stateParams,dc,gc,dss,cs,$interval,tools,cds,uiGridConstants)  {
            //<editor-fold desc="Mapa">

            ///<editor-fold desc="Mapa">


            //<editor-fold desc="Init">
            $scope.tabControl=function () {
                $scope.lstTab=[
                    {
                        id:1,
                        txTitulo:"Originación",
                        lstTxClass:['tab-active'],
                        txClassIcon:['fa-university']
                    },
                    {
                        id:2,
                        txTitulo:"Demanda Potencial",
                        lstTxClass:['tab-inactive'],
                        txClassIcon:['fa-building']
                    }
                ];

                $scope.selectedTab=$scope.lstTab[0];

                $rootScope.$on('principalGoToTab',function ($event,tabId) {
                    console.log('principalGoToTab');
                    $scope.selecTab(tabId);
                    $scope.$apply();
                });
            };
            $scope.tabClick=function ($event,m) {
                $scope.selecTab(m.id);
            };
            $scope.selecTab=function (tabId) {
                //Set all inactive
                var m;
                for(var i in $scope.lstTab){
                    $scope.lstTab[i].lstTxClass=['tab-inactive'];
                    if($scope.lstTab[i].id == tabId){
                        m=$scope.lstTab[i];
                    }
                }
                m.lstTxClass=['tab-active'];
                $scope.selectedTab=m;
            };

            $scope.init=function () {
                $scope.tabControl();

            };
            //</editor-fold desc="Init">

            $scope.init();
        }]);
