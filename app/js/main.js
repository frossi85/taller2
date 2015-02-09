/*
  Please keep this here. More info here:
  https://github.com/tnajdek/angular-requirejs-seed/blob/master/app/js/main.js
*/
window.name = "NG_DEFER_BOOTSTRAP!";

requirejs.config({
  baseUrl: './js',

  paths: {
    'bootstrap': '../lib/bootstrap.min',
    'jquery': '../lib/jquery.min',
    'angular': '../lib/angular.min',
    'angular-route': '../lib/angular-route.min',
    'angular-animate': '../lib/angular-animate.min',
	'controllers': './js/controllers/controllers'
  },

  shim: {
    'angular': {
      exports: 'angular'
    },

    'angular-route': {
      deps: ['angular']
    },

    'angular-animate': {
      deps: ['angular']
    }

  }

});

require(['cypherApp', 'vigenere', 'permutation', 'nlfsr', 'afin', 'hill', 'rc4'], function(app) {

  /*
    Start your app here
  */

  /*
    Keep this at the bottom of the function. More info at:
    https://github.com/tnajdek/angular-requirejs-seed/blob/master/app/js/main.js
  */
  angular.element().ready(function() {
      angular.resumeBootstrap();
  });
});
