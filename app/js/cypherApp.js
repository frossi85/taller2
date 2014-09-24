define(['angular', 'angular-route'], function(angular) {
  var app = angular.module('app', ['ngRoute']);

  app.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
      templateUrl: 'partials/home.html'
    }).
	when('/vigenere', {
		templateUrl: 'partials/vigenere-init.html',
		controller: 'VigenereCtrl'
	}).
	when('/vigenere/step-by-step', {
		templateUrl: 'partials/vigenere-step-by-step.html',
		controller: 'VigenereCtrl2'
	}).
	otherwise({
		redirecTo: '/'
	});
  });
  
  app.factory("Vigenere",function(){
        return {};
  });
  
  app.controller('VigenereCtrl', function($scope, $location) {
	this.vigenere = { withAutoEvaluation: true };
	
	this.enableAutoEvaluation = function () {
		this.vigenere.withAutoEvaluation = true;
	}
  
	this.disableAutoEvaluation = function () {
		this.vigenere.withAutoEvaluation = false;
	}
  
	this.initializeProblem = function() {
		$scope.vigenere.keyMask = $scope.vigenere.key;
		$scope.vigenere.result = "";
		$scope.vigenere.currentStep = 0;
		$scope.vigenere.withAutoEvaluation = this.vigenere.withAutoEvaluation;
		$scope.vigenere.isEncodeFinished = function() { 
			return this.currentStep >= this.textToEncript.length; 
		}
		$scope.vigenere.nextStepResult = function() { 
			var charToEncode = this.textToEncript.toLowerCase().charCodeAt(this.currentStep) - 96;
			var keyChar = this.keyMask.toLowerCase().charCodeAt(this.currentStep) - 96;
			
			return String.fromCharCode(((charToEncode + keyChar) % 26) + 95);	
		};
		
		$scope.vigenere.goForward = function() { 
			this.result += this.nextStepResult();
			this.currentStep++;
		};
		
		//Initialize key mask used to encript char by char
		while($scope.vigenere.keyMask.length < $scope.vigenere.textToEncript.length) {
			$scope.vigenere.keyMask += $scope.vigenere.key;
		}
		
		this.vigenere = $scope.vigenere;
		Vigenere = $scope.vigenere;
		
		$location.url('/vigenere/step-by-step');
		
		//this.vigenere = {}; //Esto borra el formulario, lo resetea. Deberia hacerse al cambiar de algoritmo o reiniciar la ejecucion
	};
  });
  
  app.controller('VigenereCtrl2', function($scope, $location) {
	this.vigenere = function() {
		var vigenere;
		
		try {
			vigenere = Vigenere;
		}
		catch(e) {
			vigenere = undefined;
		}
		return vigenere;
	}();
	
	this.isAutoEvaluation = function() {
		return typeof this.vigenere != undefined && this.vigenere.withAutoEvaluation;
	};
	
	this.isInitilized = function() {
		var isInitialized = !(typeof this.vigenere == undefined || this.vigenere == null);
		if(!isInitialized) {
			$location.url('/vigenere');
			return false;
		}
		return true;
	}
	
	this.isValid = function(encriptedChar) {
		return typeof this.vigenere != undefined && this.vigenere.nextStepResult() == encriptedChar;
	};
	
	this.nextStep = function() {
		if(typeof this.vigenere != undefined) {		
			if(this.vigenere.nextStepResult() == $('#stepAttemp').val() || !this.vigenere.withAutoEvaluation) {
				this.vigenere.goForward();		
			}
			this.vigenere.stepAttemp = "";
			$('#stepAttemp').val("");
			$location.url('/vigenere/step-by-step');
		}
	};
	
	this.isEncodeFinished = function () {
		return typeof this.vigenere != undefined && this.vigenere.isEncodeFinished();
	};
  });
  
  app.directive('navbarBottom', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/navbar-bottom.html'
	};
  });
  
  app.directive('navbarTop', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/navbar-top.html'
	};
  });
  
  app.directive('vigenereCommon', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/vigenere-common.html'
	};
  });
});

/*
vigenere = {
	key: String
	textToEncript: String
	nextStepResult: function() {}
	streamResult: String
}

(function() {
	var tp-taller-2 = angular.module('tp-taller-2', ['ngRoute']);
	tp-taller-2.controller('VigenereController', function () {
	
	});
});
*/