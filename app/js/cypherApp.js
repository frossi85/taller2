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
		templateUrl: 'partials/Permutation/permutation-home.html',
		controller: 'PermutationHomeCtrl'
	}).
	when('/permutacion/encrypt', {
		templateUrl: 'partials/Permutation/permutation-encrypt.html',
		controller: 'PermutationEncryptCtrl'
	}).
	when('/permutacion/decrypt', {
		templateUrl: 'partials/Permutation/permutation-decrypt.html',
		controller: 'PermutacionDecryptCtrl'
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

/****************************************************
			VIGENERE
****************************************************/
  
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
  
  app.directive('vigenereCommon', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/vigenere-common.html'
	};
  });

/*****************************************************************
			PERMUTACION
*****************************************************************/

  app.factory("Permutacion",function(){
        return {};
  });

  app.controller('PermutationHomeCtrl', function($scope, $location) {
	this.toEncrypt = function () {
	}
  
	this.toDecrypt = function () {
	}
  });

  app.controller('PermutationEncryptCtrl', function($scope, $location) {
/*	this.permutacion = { withAutoEvaluation: true };
	
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
	};*/
  });
  
  app.controller('PermutationDecryptCtrl', function($scope, $location) {
/*	this.permutacion = function() {
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
	};*/
  });

/*****************************************************************
				otro
*****************************************************************/

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

/*
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
*/

function PermutationLibrary(key, message, ciphertext) {
	return {
		_isEncrypt: true,
		_withAutoEvaluation: false,
		_key: key,
		_message: message,
		_ciphertext: ciphertext,
		_padChar: '#',
		_currentStep: 1,
		_matrix: [],

		L: {},
		M: {},
		C: {},
		Kc: {},
		Kd: {},

		colSwap: function(indexOne, indexTwo) {
			var tmpVal;
			for (var r = 0; r < this._matrix.length; r++) {
				tmpVal = this._matrix[r][indexOne];
				this._matrix[r][indexOne] = this._matrix[r][indexTwo];
				this._matrix[r][indexTwo] = tmpVal;
			}
		},

		matrixBubbleSort: function() {
			var rows = this._matrix.length;
			var cols = this._matrix[0].length;
			for (var pass = 1; pass < cols; pass++) {
				for (var left = 0; left < (cols - pass); left++){
					var right = left + 1;
					if (this._matrix[0][left] > this._matrix[0][right]) {
						colSwap(left, right);
					}
				}
			}
		},

		reorderMatrixByKey: function() {
			for (var i = 0; i < this._key.length; i++) {
				var char = this._key.charAt(i);
				var c = 0;
				while (char != this._matrix[0][c]) {
					c++;
				}
				if (i != c) {
					colSwap(i, c);
				}
			}
		},

		emptyMatrix: function() {
			for(var r = 0; r < this._matrix.length; r++) {
			    for(var c = 0; c < this._matrix[0].length; c++) {
				this._matrix[r][c] = '*';
			    }
			}
		},

		validateMsg: function() {
			this._message = this._message.value.toLowerCase().replace(/[^a-z]/g, "");
			if (this._message.length < 1) {
				alert("Por favor inserte un mensaje");
				return false;
			}
		/*	M = plaintext.length;
			document.getElementById("varM").value = M;
			document.getElementById("msg").value = plaintext;*/
			return true;
		},

		validateKey: function() {
			// ver validaciones a poner
			this._key = this._key.value.toLowerCase().replace(/[^a-z]/g, "");
			/*L = key.length;
			document.getElementById("varL").value = L;*/
			return true;
		},

		validateCph: function() {
			this._ciphertext = this._ciphertext.value.toLowerCase().replace(/[^a-z]/g, "");
			if (this._ciphertext.length < 1) {
				alert("Por favor inserte un criptograma");
				return false;
			}
			/*C = ciphertext.length;
			document.getElementById("varC").value = C;
			document.getElementById("crip").value = ciphertext;*/
			return true;
		},

		addPadding: function() {
			while (this._message.length % this._key.length != 0) {
				this._message += this._padChar;
			}
		 },

		removePadding: function() {
			while (this._message.charAt(this._message.length - 1) == this._padChar) {
				this._message = this._message.substr(0, this._message.length - 1);
			}
		},

		step1Enc: function() {
			this.Kc = Math.ceil(this._message.length/this._key.length) + 1;
			//document.getElementById("varKc").value = Kc;
			this._matrix = new Array(this.Kc);
			for (var r = 0; r < Kc; r++) {
				this._matrix[r] = new Array(this._key.length);
			}
			this.emptyMatrix();
		},

		step2Enc: function() {
			this.addPadding();
			// Clave
			for (var c = 0; c < this._key.length; c++) {
				this._matrix[0][c] = this._key.charAt(c);
			}
			// Mensaje
			for (var r = 1; r < this.Kc; r++) {
				for (var c = 0; c < this._key.length; c++) {
					this._matrix[r][c] = this._message.charAt(this._key.length * (r-1) + c);
				}
			}
			//fillMatrixTable(Kc, L);
		},

		step3Enc: function() {
			this.matrixBubbleSort();
			//fillMatrixTable(Kc, L);
		},
	
		step4Enc: function() {
			this._ciphertext = "";
			for (var c = 0; c < this._key.length; c++) {
					for (var r = 1; r < this.Kc; r++) {
					this._ciphertext += this._matrix[r][c];
				}
			}
			//document.getElementById("crip").value = ciphertext;
		},

		step1Dec: function() {
			this.Kd = Math.ceil(this._ciphertext.length/this._key.length) + 1;
			//document.getElementById("varKd").value = Kd;
			this._matrix = new Array(this.Kd);
			for (var r = 0; r < Kd; r++) {
				this._matrix[r] = new Array(this._key.length);
			}
			this.emptyMatrix();
		},

		step2Dec: function() {
			// Clave
			for (var c = 0; c < this._key.length; c++) {
				this._matrix[0][c] = this._key.charAt(c);
			}
			this.matrixBubbleSort();
			//fillMatrixTable(1, L);
		},

		step3Dec: function() {
			// Criptograma
			for (var c = 0; c < this._key.length; c++) {
				for (var r = 1; r < this.Kd; r++) {
					this._matrix[r][c] = this._ciphertext.charAt((Kd-1) * c + (r-1));
				}
			}
			//fillMatrixTable(Kd, L);
		},

		step4Dec: function() {
			this.reorderMatrixByKey();
			//fillMatrixTable(Kd, L);
		},

		step5Dec: function() {
			this._message = "";
			for (var r = 1; r < Kd; r++) {
				for (var c = 0; c < this._key.length; c++) {
					this._message += this._matrix[r][c];
				}
			}
			this.removePadding();
			//document.getElementById("msg").value = plaintext;
		},

		resetCurrentStep: function() {
			this._currentStep = 1;
		}

		fullEnc: function() {
			while(this._currentStep < 5) {
				this.nextEncStep;
			}
		},

		fullDec: function() {
			while(this._currentStep < 6) {
				this.nextDecStep;
			}
		},

		nextEncStep: function() {
			switch(this._currentStep) {
			case 1: {
				if (this.validateMsg() && this.validateKey()) {
					this.step1Enc();
					this._currentStep++;
				}
				break;
			}
			case 2: {
				this.step2Enc();
				this._currentStep++;
				break;
			}
			case 3: {
				this.step3Enc();
				this._currentStep;
				break;
			}
			case 4: {
				this.step4Enc();
				this._currentStep;
				break;
			}
			case 5: {
				alert("El algoritmo de cifrado ya finalizó");
				break;
			}
			default: {
				alert("Error inesperado");
			}
			}
		},

		nextDecStep: function() {
			switch(this._currentStep) {
			case 1: {
				if (this.validateCph() && this.validateKey()) {
					this.step1Dec();
					this._currentStep++;
				}
				break;
			}
			case 2: {
				this.step2Dec();
				this._currentStep++;
				break;
			}
			case 3: {
				this.step3Dec();
				this._currentStep++;
				break;
			}
			case 4: {
				this.step4Dec();
				this._currentStep++;
				break;
			}
			case 5: {
				this.step5Dec();
				this._currentStep++;
				break;
			}
			case 6: {
				alert("El algoritmo de descifrado ya finalizó");
				break;
			}
			default: {
				alert("Error inesperado");
			}
			}
		}
	};
}
