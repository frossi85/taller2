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
		$scope.vigenere.isFinished = function() { 
			return this.currentStep >= this.text.length; 
		}
		$scope.vigenere.nextStepResult = function() { 
			var charToEncode = this.text.toLowerCase().charCodeAt(this.currentStep) - 96;
			var keyChar = this.keyMask.toLowerCase().charCodeAt(this.currentStep) - 96;
			
			return String.fromCharCode(((charToEncode + keyChar) % 26) + 95);	
		};
		
		$scope.vigenere.goForward = function() { 
			this.result += this.nextStepResult();
			this.currentStep++;
		};
		
		//Initialize key mask used to encript char by char
		while($scope.vigenere.keyMask.length < $scope.vigenere.text.length) {
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

function VigenereLibrary(key, text) {

	var keyMask = "";
	while(keyMask.length < text.length) {
		keyMask += key;
	}
	
	return {
		_isEncrypt: true,
		key: key,
		keyMask: keyMask,
		text: text,
		result: "",
		currentStep: 0,
		withAutoEvaluation: true,
		isFinished: function() { 
			return currentStep >= text.length; 
		},
		nextStepResult: function() { 
			/*var charToProcess = this.text.toLowerCase().charCodeAt(this.currentStep) - 96;
			var keyChar = this.keyMask.toLowerCase().charCodeAt(this.currentStep) - 96;
			var innerResult = (this._isEncode) ? charToProcess + keyChar : charToProcess - keyChar;

			return String.fromCharCode((innerResult % 26) + 95);*/
			var charToProcess = text.toLowerCase().charCodeAt(currentStep) - 96;
			var keyChar = keyMask.toLowerCase().charCodeAt(currentStep) - 96;
			
			return String.fromCharCode(((charToProcess + keyChar) % 26) + 95);				
		},
		goForward: function() { 
			result += nextStepResult();
			currentStep++;
			return this;
		},
		setEncrypt: function () { 
			_isEncrypt = true ;
			return this;
		},
		setDecrypt: function () { 
			_isEncrypt = false ;
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