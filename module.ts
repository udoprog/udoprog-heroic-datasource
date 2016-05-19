import {HeroicDatasource} from './datasource';
import {HeroicQueryCtrl} from './query_ctrl';

class HeroicConfigCtrl {
  static templateUrl = 'partials/config.html';
}

export {
  HeroicDatasource as Datasource,
  HeroicQueryCtrl as QueryCtrl,
  HeroicConfigCtrl as ConfigCtrl
};

