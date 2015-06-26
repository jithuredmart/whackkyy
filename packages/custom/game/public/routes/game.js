'use strict';

angular.module('mean.game').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('game example page', {
      url: '/game/example',
      templateUrl: 'game/views/index.html'
    });
  }
]);
