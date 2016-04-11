///<reference path="./common.d.ts" />

import angular from 'angular';

import {quoteString} from './utils';

export function HeroicDatasource(instanceSettings, $q, backendSrv, templateSrv) {
  this.type = instanceSettings.type;
  this.url = instanceSettings.url;
  this.name = instanceSettings.name;
  this.supportMetrics = true;
  this.supportAnnotations = true;

  this.testDatasource = function() {
    return this.doRequest('/status').then(function(data) {
      var service = data.data.service;

      return {
        status: "success",
        message: "OK: " + JSON.stringify(service),
        title: "Success"
      };
    });
  };

  this.query = function(options) {
    var queries = {};
    var targets = {};

    for (var i = 0; i < options.targets.length; i++) {
      var target = options.targets[i];

      if (target.hide) {
        continue;
      }

      var query = templateSrv.replace(target.query);
      var id = String(i);
      queries[id] = {query: query, features: ['com.spotify.heroic.distributed_aggregations']};
      targets[id] = target;
    }

    var data = {
      queries: queries,
      range: {
        type: "absolute",
        start: options.range.from.valueOf(),
        end: options.range.to.valueOf()
      }
    };

    return this.doRequest('/query/batch', {method: 'POST', data: data}).then(data => {
      var converter = function(d) {
        return [d[1], d[0]];
      };

      var output = [];

      var results = data.data.results;

      for (var k in results) {
        var result = results[k];
        var groups = result.result;
        var target = targets[k];

        for (var i = 0, l = groups.length; i < l; i++) {
          var group = groups[i];

          var name;

          var scoped = this.buildScoped(group, result.common);
          name = templateSrv.replaceWithText(target.alias || "$tags", scoped);
          output.push({target: name, datapoints: group.values.map(converter)});
        }
      }

      return {data: output};
    });
  };

  this.buildScoped = function(group, common) {
    var scoped = {};

    for (var tk in group.tagCounts) {
      scoped[tk] = {text: "<" + group.tagCounts[tk] + ">"};
      scoped[tk + "_count"] = {text: "<" + group.tagCounts[tk] + ">"};
    }

    for (var t in group.tags) {
      scoped[t] = {text: group.tags[t]};
      scoped[t + "_count"] = {text: "<" + 1 + ">"};
    }

    for (var c in common) {
      scoped[c] = {text: common[c]};
      scoped[c + "_count"] = {text: "<" + 1 + ">"};
    }

    for (var s in group.shard) {
      scoped["shard_" + s] = {text: group.shard[s]};
      scoped["shard_" + s + "_count"] = {text: "<" + 1 + ">"};
    }

    for (var gk in group.key) {
      scoped["group_" + gk] = {text: group.key[gk]};
    }

    scoped["key_count"] = {text: group.keyCount};

    scoped["group"] = {text: this.buildTags(group.key)};
    scoped["tags"] = {text: this.buildTags(group.tags)};
    return scoped;
  };

  this.buildTags = function(tags: any) {
    var parts = [];

    for (var k in tags) {
      parts.push(quoteString(k) + ": " + quoteString(tags[k]));
    }

    return "{" + parts.join(", ") + "}";
  }

  this.seriesCount = function(filter: any[]) {
    return this.doRequest('/metadata/series-count', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      data: {filter: filter}
    });
  };

  this.tags = function(filter: any[]) {
    return this.doRequest('/metadata/tags', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      data: {filter: filter}
    });
  };

  this.validateQuery = function(query: String) {
    // convert query using template.
    query = templateSrv.replace(query);

    return this.doRequest('/parser/parse-query', {
      method: 'POST',
      headers: {'Content-Type': 'text/plain'},
      data: query
    });
  };

  this.doRequest = function(path: String, options: any) {
    options = options || {};
    options.url = this.url + path;
    options.inspect = {type: 'heroic'};
    return backendSrv.datasourceRequest(options);
  };
}
