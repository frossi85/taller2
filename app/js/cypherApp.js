﻿define(['angular', 'angular-route'], function(angular) {
	var app = angular.module('app', ['ngRoute', 'vigenere', 'permutation', 'nlfsr', 'afin', 'hill', 'rc4']);
	
	app.config(function($routeProvider, $locationProvider) {
		$routeProvider.when('/', {
			templateUrl: 'partials/home.html'
		}).
		when('/vigenere', {
			templateUrl: 'partials/Vigenere/vigenere-init.html',
	   controller: 'VigenereCtrl'
		}).
		when('/vigenere/step-by-step', {
			templateUrl: 'partials/Vigenere/vigenere-step-by-step.html',
	   controller: 'VigenereCtrl2'
		}).
		when('/vigenere/decrypt', {
			templateUrl: 'partials/Vigenere/vigenere-decrypt-init.html',
	   controller: 'VigenereCtrl'
		}).
		when('/vigenere/decrypt/step-by-step', {
			templateUrl: 'partials/Vigenere/vigenere-decrypt-step-by-step.html',
	   controller: 'VigenereCtrl2'
		}).
		when('/permutacion', {
			templateUrl: 'partials/Permutation/permutation-home.html',
	   controller: 'PermutationHomeCtrl'
		}).
		when('/permutacion/encrypt', {
			templateUrl: 'partials/Permutation/permutation-encrypt.html',
	   controller: 'PermutationEncryptCtrl'
		}).
		when('/permutacion/decrypt', {
			templateUrl: 'partials/Permutation/permutation-decrypt.html',
	   controller: 'PermutationDecryptCtrl'
		}).
		when('/nlfsr', {
			templateUrl: 'partials/NLFSR/nlfsr-init.html',
			controller: 'NlfsrCtrl'
		}).
		when('/afin', {
			templateUrl: 'partials/Afin/afin-home.html',
	   controller: 'AfinCtrl'
		}).
		when('/hill', {
			templateUrl: 'partials/Hill/hill-home.html',
	   controller: 'HillCtrl'
		}).
		when('/rc4', {
			templateUrl: 'partials/RC4/rc4-home.html',
	   controller: 'HillCtrl'
		}).
		otherwise({
			redirecTo: '/'
		});
	});
	
	app.directive('navbarTop', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/navbar-top.html'
		};
	});
	
	app.directive('navbarBottom', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/navbar-bottom.html'
		};
	});
	
});