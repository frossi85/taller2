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
	when('/permutacion', {
		templateUrl: 'partials/vigenere-init.html',
		controller: 'PermutacionCtrl'
	}).
	when('/permutacion/step-by-step', {
		templateUrl: 'partials/vigenere-step-by-step.html',
		controller: 'PermutacionCtrl2'
	}).
	when('/permutacion/decrypt', {
		templateUrl: 'partials/vigenere-decrypt-init.html',
		controller: 'PermutacionCtrl'
	}).
	when('/permutacion/decrypt/step-by-step', {
		templateUrl: 'partials/vigenere-decrypt-step-by-step.html',
		controller: 'PermutacionCtrl2'
	}).
	when('/test/matriz', {
		templateUrl: 'partials/test-matriz.html',
		controller: 'TestCtrl'
	}).
	otherwise({
		redirecTo: '/'
	});
  });
  
  app.factory("Vigenere",function(){
        return {};
  });

  app.factory("Permutacion",function(){
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
		Vigenere.withAutoEvaluation = $scope.vigenere.withAutoEvaluation;
		$location.url('/vigenere/step-by-step');
		
		//this.vigenere = {}; //Esto borra el formulario, lo resetea. Deberia hacerse al cambiar de algoritmo o reiniciar la ejecucion
	};
	
	this.initializeDecryptProblem = function() {
		Vigenere = VigenereLibrary($scope.vigenere.key, $scope.vigenere.text).setDecrypt(); 
		Vigenere.withAutoEvaluation = $scope.vigenere.withAutoEvaluation;
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
			if(this.vigenere._isEncrypt == true)
				$location.url('/vigenere/step-by-step');
			else
				$location.url('/vigenere/decrypt/step-by-step');
		}
	};
	
	this.isFinished = function () {
		return typeof this.vigenere != undefined && this.vigenere.isFinished();
	};
  });

	app.controller('TestCtrl', function ($scope) { 
		this.permutation = { matrix: [
        ["*", "*", "*"],
        ["*", "*", "*"],
        ["*", "*", "*"]
    	]};


	    this.update = function() {
			this.permutation.matrix = [
		        ["A", "*", "*"],
		        ["*", "A", "*"],
		        ["*", "*", "A"]
		    	];

		    console.log('entre');
		};

	});

/*

  app.controller('PermutacionCtrl', function($scope, $location) {
	this.permutacion = { withAutoEvaluation: true };
	
	this.enableAutoEvaluation = function () {
		this.permutacion.withAutoEvaluation = true;
	}
  
	this.disableAutoEvaluation = function () {
		this.permutacion.withAutoEvaluation = false;
	}
  
	this.initializeProblem = function() {
		Vigenere = VigenereLibrary($scope.vigenere.key, $scope.vigenere.text);
		Vigenere.withAutoEvaluation = $scope.vigenere.withAutoEvaluation;
		$location.url('/vigenere/step-by-step');
		
		//this.vigenere = {}; //Esto borra el formulario, lo resetea. Deberia hacerse al cambiar de algoritmo o reiniciar la ejecucion
	};
	
	this.initializeDecryptProblem = function() {
		Vigenere = VigenereLibrary($scope.vigenere.key, $scope.vigenere.text).setDecrypt(); 
		Vigenere.withAutoEvaluation = $scope.vigenere.withAutoEvaluation;
		$location.url('/permutacion/decrypt/step-by-step');
	};
  });
  
  app.controller('PermutacionCtrl2', function($scope, $location) {
	this.permutacion = function() {
		var permutacion;
		
		try {
			permutacion = Permutacion;
		}
		catch(e) {
			permutacion = undefined;
		}
		return permutacion;
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
			if(this.vigenere._isEncrypt == true)
				$location.url('/vigenere/step-by-step');
			else
				$location.url('/vigenere/decrypt/step-by-step');
		}
	};
	
	this.isFinished = function () {
		return typeof this.vigenere != undefined && this.vigenere.isFinished();
	};
  });*/
  
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
			var charToProcess = this.text.toLowerCase().charCodeAt(this.currentStep) - 97;
			var keyChar = this.keyMask.toLowerCase().charCodeAt(this.currentStep ) - 97;
			
			console.log("charToProcess: " + charToProcess);
			console.log("keyChar: " + keyChar);
			
			var previousResult;
			
			if(this._isEncrypt == true) {
				console.log("encrypt");
				previousResult = charToProcess + keyChar;			
			}
			else {
				console.log("decrypt: " + (charToProcess - keyChar));	
				previousResult = charToProcess - keyChar;			
			}
			if(previousResult < 0)
				previousResult += 26;
				
			return String.fromCharCode((previousResult % 26) + 97);	
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
