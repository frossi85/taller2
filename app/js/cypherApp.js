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
	when('/vigenere/decrypt', {
		templateUrl: 'partials/vigenere-decrypt-init.html',
		controller: 'VigenereCtrl'
	}).
	when('/vigenere/decrypt/step-by-step', {
		templateUrl: 'partials/vigenere-decrypt-step-by-step.html',
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
		Vigenere = VigenereLibrary($scope.vigenere.key, $scope.vigenere.text);
		$location.url('/vigenere/step-by-step');
		
		//this.vigenere = {}; //Esto borra el formulario, lo resetea. Deberia hacerse al cambiar de algoritmo o reiniciar la ejecucion
	};
	
	this.initializeDecryptProblem = function() {
		Vigenere = VigenereLibrary($scope.vigenere.key, $scope.vigenere.text).setDecrypt(); 
		$location.url('/vigenere/decrypt/step-by-step');
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
			if(this.vigenere.isEncrypt == true)
				$location.url('/vigenere/step-by-step');
			else
				$location.url('/vigenere/decrypt/step-by-step');
		}
	};
	
	this.isFinished = function () {
		return typeof this.vigenere != undefined && this.vigenere.isFinished();
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

function VigenereLibrary(key, textToProcess) {

	var keyMask = "";
	while(keyMask.length < textToProcess.length) {
		keyMask += key;
	}
	
	return {
		_isEncrypt: true,
		key: key,
		keyMask: keyMask,
		text: textToProcess,
		result: "",
		currentStep: 0,
		withAutoEvaluation: true,
		isFinished: function() { 
			return this.currentStep  >= this.text.length; 
		},
		nextStepResult: function() { 
			var charToProcess = this.text.toLowerCase().charCodeAt(this.currentStep) - 96;
			var keyChar = this.keyMask.toLowerCase().charCodeAt(this.currentStep ) - 96;
			
			if(this._isEncrypt == true)
				return String.fromCharCode(((charToProcess + keyChar) % 26) + 95);				
			else
				return String.fromCharCode(((charToProcess - keyChar) % 26) + 95);				
		},
		goForward: function() { 
			this.result += this.nextStepResult();
			this.currentStep++;
			return this;
		},
		setEncrypt: function () { 
			this._isEncrypt = true ;
			return this;
		},
		setDecrypt: function () { 
			this._isEncrypt = false ;
			return this;
		}
	};
}

/*
vigenere = {
	key: String
	text: String
	nextStepResult: function() {}
	streamResult: String
}

(function() {
	var tp-taller-2 = angular.module('tp-taller-2', ['ngRoute']);
	tp-taller-2.controller('VigenereController', function () {
	
	});
});
*/