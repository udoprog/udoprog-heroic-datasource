///<reference path="./common.d.ts" />

import angular from 'angular';
import _ from 'lodash';

import {quoteString} from './utils';

export class HeroicQueryCtrl {
  static templateUrl = 'partials/query.editor.html';

  private testFilter;
  target: any;
  datasource: any;
  panelCtrl: any;
  panel: any;
  hasRawMode: boolean;
  error: string;

  constructor($scope, $injector, private uiSegmentSrv, private templateSrv) {
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

    $scope.$watch('ctrl.target.query', query => {
      if (!query) {
        return;
      }

      this.validateQuery($scope, query);
    });

    this.testFilter = _.debounce(($scope, filter: any[]) => {
      $scope.countingSeries = true;

      this.datasource.seriesCount(filter).then(data => {
        $scope.seriesCount = data.data.count;
      }).finally(() => $scope.countingSeries = false);

      this.datasource.tags(filter).then(data => {
        $scope.seriesTags = data.data.tags;
      });
    }, 1000);
  }

  validateQuery($scope, query: String) {
    this.datasource.validateQuery(query).then(data => {
      $scope.queryError = null;
      $scope.validQuery = true;
      this.testFilter($scope, data.data.filter);
    }, data => {
      $scope.queryError = data.data.message;
      $scope.validQuery = false;
    });
  }

  addTag(key: String, value: String) {
    this.target.query += "\n  and " + quoteString(key) + " = " + quoteString(value);
  }

  getNextQueryLetter() {
    var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    return _.find(letters, refId => {
      return _.every(this.panel.targets, function(other) {
        return other.refId !== refId;
      });
    });
  }

  removeQuery() {
    this.panel.targets = _.without(this.panel.targets, this.target);
    this.panelCtrl.refresh();
  };

  duplicateQuery() {
    var clone = angular.copy(this.target);
    clone.refId = this.getNextQueryLetter();
    this.panel.targets.push(clone);
  }

  moveQuery(direction) {
    var index = _.indexOf(this.panel.targets, this.target);
    _.move(this.panel.targets, index, index + direction);
  }

  refresh() {
    this.panelCtrl.refresh();
  }

  toggleHideQuery() {
    this.target.hide = !this.target.hide;
    this.panelCtrl.refresh();
  }
}
