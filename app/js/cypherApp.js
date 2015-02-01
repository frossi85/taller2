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
	   controller: 'PermutationDecryptCtrl'
		}).
		when('/nlfsr', {
			templateUrl: 'partials/NLFSR/nlfsr-init.html',
			controller: 'NlfsrCtrl'
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
	 *			VIGENERE
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
	 *			PERMUTACION
	 *****************************************************************/
	
	app.directive('encryptDictionaryVariables', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/Permutation/permutation-encrypt-dictionary-variables.html'
		};
	});
	
	app.directive('encryptAlgorithm', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/Permutation/permutation-encrypt-algorithm.html'
		};
	});
	
	app.directive('encryptVariables', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/Permutation/permutation-encrypt-variables.html'
		};
	});
	
	app.directive('encryptMatrix', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/Permutation/permutation-encrypt-matrix.html'
		};
	});
	
	app.directive('encryptTextKeyForm', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/Permutation/permutation-encrypt-text-key-form.html',
		};
	});
	
	app.directive('decryptDictionaryVariables', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/Permutation/permutation-decrypt-dictionary-variables.html'
		};
	});
	
	app.directive('decryptAlgorithm', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/Permutation/permutation-decrypt-algorithm.html'
		};
	});
	
	app.directive('decryptVariables', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/Permutation/permutation-decrypt-variables.html'
		};
	});
	
	app.directive('decryptMatrix', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/Permutation/permutation-decrypt-matrix.html'
		};
	});
	
	app.directive('decryptCipherKeyForm', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/Permutation/permutation-decrypt-cipher-key-form.html',
		};
	});
	
	app.controller('PermutationHomeCtrl', function($scope, $location) {
		this.toEncrypt = function () {
			$location.url('/permutacion/encrypt');
		};
		
		this.toDecrypt = function () {
			$location.url('/permutacion/decrypt');
		};
	});
	
	app.controller('PermutationEncryptCtrl', function($scope, $location) {
		this.permutationEnc;
		this._withAutoEvaluation = false;
		
		this.isInitialized = function() {
			return !(typeof this.permutationEnc == undefined || this.permutationEnc == null);
		};
		
		this.hasFinished = function() {
			return this.isInitialized() && (this.permutationEnc._currentStep === 5);
		};
		
		this.returnHome = function() {
			$location.url('/permutacion');
		};
		
		this.initializeProblem = function() {
			this.permutationEnc = PermutationLibrary($scope.permutation.encKey, $scope.permutation.plaintext, "");
			console.log(this.permutationEnc._key);
			console.log(this.permutationEnc._plaintext);
			//this.permutationEnc.validateKey();
		};
	});
	
	app.controller('PermutationDecryptCtrl', function($scope, $location) {
		this.permutationDec;
		this._withAutoEvaluation = false;

		this.isInitialized = function() {
			return !(typeof this.permutationDec == undefined || this.permutationDec == null);
		};
		
		this.hasFinished = function() {
			return this.isInitialized() && (this.permutationDec._currentStep === 6);
		};
		
		this.returnHome = function() {
			$location.url('/permutacion');
		};
		
		this.initializeProblem = function() {
			this.permutationDec = PermutationLibrary($scope.permutation.decKey, "", $scope.permutation.ciphertext);
			console.log(this.permutationDec._key);
			console.log(this.permutationDec._ciphertext);
			//this.permutationDec.validateKey();
		};
	});

/****************************************************
			NLFSR
****************************************************/
 
  app.controller('NlfsrCtrl', function($scope, $location) {
	this.initializeProblem = function() {
		this.nlfsr = NLFSRLibrary($scope.nlfsr.key, $scope.nlfsr.function, $scope.nlfsr.text);
	
	};

  });


});

/*****************************************************************
 *				otro
 *****************************************************************/

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

function PermutationLibrary(key, plaintext, ciphertext) {
	return {
		_key: key,
		_plaintext: plaintext,
		_ciphertext: ciphertext,
		_padChar: '#',
		_currentStep: 1,
		_matrix: [],
		
		L: key.length,
		M: plaintext.length,
		C: ciphertext.length,
		Kc: "",
		Kd: "",
		
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
						this.colSwap(left, right);
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
					this.colSwap(i, c);
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
		
		validateKey: function() {
			// ver validaciones a poner
			this._key = this._key.value.toLowerCase().replace(/[^a-z]/g, "");
			return true;
		},
		
		addPadding: function() {
			while (this._plaintext.length % this._key.length != 0) {
				this._plaintext += this._padChar;
			}
		},
		
		removePadding: function() {
			while (this._plaintext.charAt(this._plaintext.length - 1) == this._padChar) {
				this._plaintext = this._plaintext.substr(0, this._plaintext.length - 1);
			}
		},
		
		step1Enc: function() {
			this.Kc = Math.ceil(this._plaintext.length/this._key.length) + 1;
			this._matrix = new Array(this.Kc);
			for (var r = 0; r < this.Kc; r++) {
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
					this._matrix[r][c] = this._plaintext.charAt(this._key.length * (r-1) + c);
				}
			}
		},
		
		step3Enc: function() {
			this.matrixBubbleSort();
		},
		
		step4Enc: function() {
			this._ciphertext = "";
			for (var c = 0; c < this._key.length; c++) {
				for (var r = 1; r < this.Kc; r++) {
					this._ciphertext += this._matrix[r][c];
				}
			}
		},
		
		step1Dec: function() {
			this.Kd = Math.ceil(this._ciphertext.length/this._key.length) + 1;
			this._matrix = new Array(this.Kd);
			for (var r = 0; r < this.Kd; r++) {
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
		},
		
		step3Dec: function() {
			// Criptograma
			for (var c = 0; c < this._key.length; c++) {
				for (var r = 1; r < this.Kd; r++) {
					this._matrix[r][c] = this._ciphertext.charAt((this.Kd-1) * c + (r-1));
				}
			}
		},
		
		step4Dec: function() {
			this.reorderMatrixByKey();
		},
		
		step5Dec: function() {
			this._plaintext = "";
			for (var r = 1; r < this.Kd; r++) {
				for (var c = 0; c < this._key.length; c++) {
					this._plaintext += this._matrix[r][c];
				}
			}
			this.removePadding();
		},
		
		resetCurrentStep: function() {
			this._currentStep = 1;
		},
		
		fullEnc: function() {
			while(this._currentStep < 5) {
				this.nextEncStep();
			}
		},
		
		fullDec: function() {
			while(this._currentStep < 6) {
				this.nextDecStep();
			}
		},
		
		nextEncStep: function() {
			console.log(this._currentStep);
			switch(this._currentStep) {
				case 1: {
					this.step1Enc();
					this._currentStep++;
					break;
				}
				case 2: {
					this.step2Enc();
					this._currentStep++;
					break;
				}
				case 3: {
					this.step3Enc();
					this._currentStep++;
					break;
				}
				case 4: {
					this.step4Enc();
					this._currentStep++;
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
					this.step1Dec();
					this._currentStep++;
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

function NLFSRLibrary(key, funcion, textToProcess) {
	return {
		_register: key,
		_function: funcion,
		_text: textToProcess,
		_bstream: key,
		_cipher:"",

		bc: function(car, expr) {
			if (expr == "")
				return car;
			if (expr.charAt(0) == ")")
				return car;
			if (expr.charAt(0) == "(")
				return this.bc(this.bc(0, expr.slice(1)), this.secondOp(0, expr.slice(1)));
			if (expr.charAt(0) == "0")
				return this.bc(0, expr.slice(1));
			if (expr.charAt(0) == "1")
				return this.bc(1, expr.slice(1));

			if (expr.substr(0,3) == "NOT")
				return Number(!this.bc(car, expr.slice(3)));
			if (expr.substr(0,3) == "AND")
				return car && this.bc(car, expr.slice(3));
			if (expr.substr(0,2) == "OR")
				return car || this.bc(car, expr.slice(2));
		},	

		//Devuelve la expresion del 2do operando
		secondOp: function(count, expr) {
			//ignoro todos los caracteres hasta "(" o ")"
			while((expr.charAt(0) != "(")&&(expr.charAt(0) != ")"))
			expr = expr.slice(1);

			//Devuelvo resto de la expresion si cerraron los parentesis
			if (expr.charAt(0) == ")"){
				if (count == 0)
					return expr.slice(1);
				else
					return this.secondOp(--count, expr.slice(1));	
			}
			//Agrego parentesis
			if (expr.charAt(0) == "(")
				return this.secondOp(++count, expr.slice(1));
		},

		applyFunction: function(reg, funcion) {
			//Reemplazo las Ai en la funcion por el valor i del registro
			for(var i = 0; i < reg.length; i++){
				funcion = funcion.replace("A" + i, reg.charAt(i));
			}
			return this.bc(reg, funcion);
			
		},

		stepBack: function() {
			if (this._bstream.length != this._register.length) {
				this._register = this._bstream.slice(this._bstream.length - this._register.length - 1, this._bstream.length - 1);
				this._bstream = this._bstream.slice(0, this._bstream.length - 1);
			}
		},

		stepForward: function() {
			this._bstream = this._bstream + this.applyFunction(this._register, this._function);
			this._register = this._register.slice(1) + this.applyFunction(this._register, this._function);
		},

	}
}