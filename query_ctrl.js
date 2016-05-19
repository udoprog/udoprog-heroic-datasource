///<reference path="./common.d.ts" />
System.register(['angular', 'lodash', './utils'], function(exports_1) {
    var angular_1, lodash_1, utils_1;
    var HeroicQueryCtrl;
    return {
        setters:[
            function (angular_1_1) {
                angular_1 = angular_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }],
        execute: function() {
            HeroicQueryCtrl = (function () {
                function HeroicQueryCtrl($scope, $injector, uiSegmentSrv, templateSrv) {
                    var _this = this;
                    this.uiSegmentSrv = uiSegmentSrv;
                    this.templateSrv = templateSrv;
                    this.panel = this.panelCtrl.panel;
                    if (!this.target.refId) {
                        this.target.refId = this.getNextQueryLetter();
                    }
                    // count in progress, show spinner
                    $scope.countingSeries = false;
                    // current series count
                    $scope.seriesCount = null;
                    // current set of matching tags
                    $scope.seriesTags = null;
                    // current query error
                    $scope.queryError = 'no query';
                    // if query is valid or not
                    $scope.validQuery = false;
                    $scope.$watch('ctrl.target.query', function (query) {
                        if (!query) {
                            return;
                        }
                        _this.validateQuery($scope, query);
                    });
                    this.testFilter = lodash_1.default.debounce(function ($scope, filter) {
                        $scope.countingSeries = true;
                        _this.datasource.seriesCount(filter).then(function (data) {
                            $scope.seriesCount = data.data.count;
                        }).finally(function () { return $scope.countingSeries = false; });
                        _this.datasource.tags(filter).then(function (data) {
                            $scope.seriesTags = data.data.tags;
                        });
                    }, 1000);
                }
                HeroicQueryCtrl.prototype.validateQuery = function ($scope, query) {
                    var _this = this;
                    this.datasource.validateQuery(query).then(function (data) {
                        $scope.queryError = null;
                        $scope.validQuery = true;
                        _this.testFilter($scope, data.data.filter);
                    }, function (data) {
                        $scope.queryError = data.data.message;
                        $scope.validQuery = false;
                    });
                };
                HeroicQueryCtrl.prototype.addTag = function (key, value) {
                    this.target.query += "\n  and " + utils_1.quoteString(key) + " = " + utils_1.quoteString(value);
                };
                HeroicQueryCtrl.prototype.getNextQueryLetter = function () {
                    var _this = this;
                    var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    return lodash_1.default.find(letters, function (refId) {
                        return lodash_1.default.every(_this.panel.targets, function (other) {
                            return other.refId !== refId;
                        });
                    });
                };
                HeroicQueryCtrl.prototype.removeQuery = function () {
                    this.panel.targets = lodash_1.default.without(this.panel.targets, this.target);
                    this.panelCtrl.refresh();
                };
                ;
                HeroicQueryCtrl.prototype.duplicateQuery = function () {
                    var clone = angular_1.default.copy(this.target);
                    clone.refId = this.getNextQueryLetter();
                    this.panel.targets.push(clone);
                };
                HeroicQueryCtrl.prototype.moveQuery = function (direction) {
                    var index = lodash_1.default.indexOf(this.panel.targets, this.target);
                    lodash_1.default.move(this.panel.targets, index, index + direction);
                };
                HeroicQueryCtrl.prototype.refresh = function () {
                    this.panelCtrl.refresh();
                };
                HeroicQueryCtrl.prototype.toggleHideQuery = function () {
                    this.target.hide = !this.target.hide;
                    this.panelCtrl.refresh();
                };
                HeroicQueryCtrl.templateUrl = 'partials/query.editor.html';
                return HeroicQueryCtrl;
            })();
            exports_1("HeroicQueryCtrl", HeroicQueryCtrl);
        }
    }
});
//# sourceMappingURL=query_ctrl.js.map