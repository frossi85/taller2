﻿define(['angular', 'angular-route'], function(angular) {
	var app = angular.module('app', ['ngRoute', 'vigenere', 'permutation', 'nlfsr', 'afin', 'hill', 'rc4']);

	app.config(function($routeProvider, $locationProvider) {
		$routeProvider.when('/', {
			templateUrl: 'partials/home.html'
		}).
		when('/vigenere/home', {
			templateUrl: 'partials/Vigenere/vigenere-home.html',
	   controller: 'VigenereInitialCtrl'
		}).
		when('/vigenere/encript', {
			templateUrl: 'partials/Vigenere/vigenere-encrypt.html',
	   controller: 'VigenereInitialCtrl'
		}).
		when('/vigenere/encript/step-by-step', {
			templateUrl: 'partials/Vigenere/vigenere-encrypt-step-by-step.html',
	   controller: 'VigenereResolutionCtrl'
		}).
		when('/vigenere/decrypt', {
			templateUrl: 'partials/Vigenere/vigenere-decrypt.html',
	   controller: 'VigenereInitialCtrl'
		}).
		when('/vigenere/decrypt/step-by-step', {
			templateUrl: 'partials/Vigenere/vigenere-decrypt-step-by-step.html',
	   controller: 'VigenereResolutionCtrl'
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
		when('/permutacion/encrypt-autoevaluation', {
			templateUrl: 'partials/Permutation/permutation-encrypt-autoevaluation.html',
	   controller: 'PermutationEncryptAutoevaluationCtrl'
		}).
		when('/permutacion/decrypt-autoevaluation', {
			templateUrl: 'partials/Permutation/permutation-decrypt-autoevaluation.html',
	   controller: 'PermutationDecryptAutoevaluationCtrl'
		}).
		when('/nlfsr', {
			templateUrl: 'partials/NLFSR/nlfsr-home.html',
			controller: 'NlfsrCtrl'
		}).
		when('/afin', {
			templateUrl: 'partials/Afin/afin-home.html',
	   	controller: 'AfinHomeCtrl'
		}).
		when('/afin/encrypt', {
			templateUrl: 'partials/Afin/afin-encrypt.html',
	   	controller: 'AfinEncryptCtrl'
		}).
		when('/afin/decrypt', {
			templateUrl: 'partials/Afin/afin-decrypt.html',
	   	controller: 'AfinDecryptCtrl'
		}).
		when('/hill', {
			templateUrl: 'partials/Hill/hill-home.html',
	   	controller: 'HillCtrl'
		}).
		when('/hill/encrypt', {
			templateUrl: 'partials/Hill/hill-encrypt.html',
	   	controller: 'HillEncryptCtrl'
		}).
		when('/hill/decrypt', {
			templateUrl: 'partials/Hill/hill-decrypt.html',
	   	controller: 'HillDecryptCtrl'
		}).
		when('/rc4', {
			templateUrl: 'partials/RC4/rc4-home.html',
	   	controller: 'Rc4HomeCtrl'
		}).
		when('/rc4/encrypt', {
			templateUrl: 'partials/RC4/rc4-encrypt.html',
	   	controller: 'Rc4EncryptCtrl'
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
