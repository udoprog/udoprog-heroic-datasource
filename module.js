System.register(['./datasource', './query_ctrl'], function(exports_1) {
    var datasource_1, query_ctrl_1;
    var HeroicConfigCtrl;
    return {
        setters:[
            function (datasource_1_1) {
                datasource_1 = datasource_1_1;
            },
            function (query_ctrl_1_1) {
                query_ctrl_1 = query_ctrl_1_1;
            }],
        execute: function() {
            HeroicConfigCtrl = (function () {
                function HeroicConfigCtrl() {
                }
                HeroicConfigCtrl.templateUrl = 'partials/config.html';
                return HeroicConfigCtrl;
            })();
            exports_1("Datasource", datasource_1.HeroicDatasource);
            exports_1("QueryCtrl", query_ctrl_1.HeroicQueryCtrl);
            exports_1("ConfigCtrl", HeroicConfigCtrl);
        }
    }
});
//# sourceMappingURL=module.js.map