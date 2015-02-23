define(['angular', 'angular-route'], function(angular) {
	var app = angular.module('vigenere', []);

	app.factory("Vigenere",function(){
		return {};
	});
	
	app.controller('VigenereCtrl', function($scope, $location) {
		$scope.vigenere = function() {
			var vigenere;
			try {
				vigenere = Vigenere;
			}
			catch(e) {
				vigenere = { withAutoEvaluation: false };
			}
			return vigenere;
		}();
		
		$scope.enableAutoEvaluation = function () {
			$scope.vigenere.withAutoEvaluation = true;
		}
		
		$scope.disableAutoEvaluation = function () {
			$scope.vigenere.withAutoEvaluation = false;
		}
		
		$scope.initializeProblem = function() {
			Vigenere = VigenereLibrary($scope.vigenere.key, $scope.vigenere.text);
			Vigenere.withAutoEvaluation = $scope.vigenere.withAutoEvaluation;

			$location.url('/vigenere/encript/step-by-step');
		};
		
		$scope.initializeDecryptProblem = function() {
			Vigenere = VigenereLibrary($scope.vigenere.key, $scope.vigenere.text).setDecrypt(); 
			Vigenere.withAutoEvaluation = $scope.vigenere.withAutoEvaluation;

			$location.url('/vigenere/decrypt/step-by-step');
		};

		$scope.encryptDirectSolution = function() {
			Vigenere = VigenereLibrary($scope.vigenere.key, $scope.vigenere.text); 
			Vigenere.solveIt();

			$location.url('/vigenere/encript/step-by-step');
		}

		$scope.decryptDirectSolution = function() {
			Vigenere = VigenereLibrary($scope.vigenere.key, $scope.vigenere.text).setDecrypt(); 
			Vigenere.solveIt();

			$location.url('/vigenere/decrypt/step-by-step');
		}
	});
	
	app.controller('VigenereCtrl2', function($scope, $location) {
		$scope.vigenere = function() {
			var vigenere;
			
			try {
				vigenere = Vigenere;
			}
			catch(e) {
				vigenere = { withAutoEvaluation: false };
			}
			return vigenere;
		}();
		
		$scope.isAutoEvaluation = function() {
			return typeof $scope.vigenere != undefined && $scope.vigenere.withAutoEvaluation;
		};
		
		$scope.isInitilized = function() {
			var isInitialized = !(typeof $scope.vigenere == undefined || $scope.vigenere == null);
			if(!isInitialized) {
				$location.url('/vigenere/home');
				return false;
			}
			return true;
		}
		
		$scope.isValid = function(encriptedChar) {
			return typeof $scope.vigenere != undefined && $scope.vigenere.nextStepResult() == encriptedChar;
		};
		
		$scope.nextStep = function() {
			if(typeof $scope.vigenere != undefined) {		
				if($scope.vigenere.nextStepResult() == $('#stepAttemp').val() || !$scope.vigenere.withAutoEvaluation) {
					$scope.vigenere.goForward();		
				}
				$scope.vigenere.stepAttemp = "";
				$('#stepAttemp').val("");
				if($scope.vigenere._isEncrypt == true)
					$location.url('/vigenere/encript/step-by-step');
				else
					$location.url('/vigenere/decrypt/step-by-step');
			}
		};
		
		$scope.isFinished = function () {
			return typeof $scope.vigenere != undefined && $scope.vigenere.isFinished();
		};

		$scope.toEncript = function() {
			if(typeof $scope.vigenere != undefined) {	
				Vigenere = VigenereLibrary($scope.vigenere.key, $scope.vigenere.result).setEncrypt();
				Vigenere.withAutoEvaluation = $scope.vigenere.withAutoEvaluation;
				$location.url('/vigenere/encript');
			}
		}

		$scope.toDecript = function() {
			if(typeof $scope.vigenere != undefined) {	
				Vigenere = VigenereLibrary($scope.vigenere.key, $scope.vigenere.result).setDecrypt();
				Vigenere.withAutoEvaluation = $scope.vigenere.withAutoEvaluation;
				$location.url('/vigenere/decrypt');
			}
		}
	});

	app.directive('encriptDescription', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/Vigenere/encrypt-description.html'
		};
	});

	app.directive('decriptDescription', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/Vigenere/decrypt-description.html'
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
		withAutoEvaluation: false,
		isFinished: function() { 
			return this.currentStep  >= this.text.length; 
		},
		nextStepResult: function() { 
			var charToProcess = this.text.toLowerCase().charCodeAt(this.currentStep) - 97;
			var keyChar = this.keyMask.toLowerCase().charCodeAt(this.currentStep ) - 97;			
			var previousResult;
			
			if(this._isEncrypt == true) {
				previousResult = charToProcess + keyChar;			
			}
			else {
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
		},
		solveIt: function () {
			while(!this.isFinished()) {
				this.goForward();
			}
		}
	};
}
