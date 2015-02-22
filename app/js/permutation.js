define(['angular', 'angular-route'], function(angular) {
	var app = angular.module('permutation', []);

	app.directive('encryptForm', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/Permutation/permutation-initform-encrypt.html',
		};
	});

	app.directive('decryptForm', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/Permutation/permutation-initform-decrypt.html',
		};
	});

	app.directive('keyValidation', function() {
		return {
			require: 'ngModel',
			link: function(scope, elm, attrs, ctrl) {
				ctrl.$parsers.unshift(function (viewValue) {
					ctrl.$setValidity('keyValidation', PermutationLibrary("", "", "").validateKey(viewValue));
					return viewValue;
				});
			}
		};
	});
	
	app.directive('cipherSizeValidation', function() {
		return {
			require: 'ngModel',
			link: function(scope, elm, attrs, ctrl) {
				var validate = function(viewValue) {
					var keySize = attrs.cipherSizeValidation;
					var valid = viewValue ? (viewValue.length % keySize === 0) : true;
					ctrl.$setValidity('cipherSizeValidation', valid);
					return viewValue;
				}
				ctrl.$parsers.unshift(validate);
				ctrl.$formatters.push(validate);
				
				attrs.$observe('cipherSizeValidation', function(keySize) {
					return validate(ctrl.$viewValue);
				});
			}
		};
	});
	
	app.factory("PermutationEnc",function() {
		return {};
	});
	
	app.factory("PermutationDec",function() {
		return {};
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
		this._withAutoEvaluation = false;
		this.permutationEnc;
		
		this.initializeProblem = function() {	
			PermutationEnc = PermutationLibrary($scope.permutation.key, $scope.permutation.plaintext, "");
			if(this._withAutoEvaluation) {
				PermutationEnc.nextEncStep();
				$location.url('/permutacion/encrypt-autoevaluation');
			}
			this.permutationEnc = PermutationEnc;
		};
		
		this.isInitialized = function() {
			return !(typeof this.permutationEnc == undefined || this.permutationEnc == null);
		};
		
		this.hasFinished = function() {
			return this.isInitialized() && (this.permutationEnc._currentStep === 4);
		};
		
		this.isCurrentStep = function(step) {
			return this.isInitialized() && (this.permutationEnc._currentStep === step);
		};
		
		this.currentStep = function() {
			if (this.isInitialized()) {
				return this.permutationEnc._currentStep;
			}
			else {
				return -1;
			}
		};

		this.returnHome = function() {
			$location.url('/permutacion');
		};

		this.goToDecrypt = function() {
			var url = '/permutacion/decrypt?key=' + this.permutationEnc._key + '&ciphertext=' + this.permutationEnc._ciphertext;
			$location.url(url);
		};
	});
	
	app.controller('PermutationEncryptAutoevaluationCtrl', function($scope, $location) {
		this.permutationEnc = function() {
			var permutation = {};
			try {
				permutation = PermutationEnc;
			}
			catch(e) {
				returnHome();
			}
			return permutation;
		}();
		
		this._hasFinished = false;
		
		this.validateKc = function() {
			return parseInt($scope.varKc) === parseInt(this.permutationEnc.Kc);
		};
		
		this.validateMatrix = function() {
			for (var r = 0; r < this.permutationEnc.Kc; r++) {
				for (var c = 0; c < this.permutationEnc.L; c++) {
					if($scope.matrix[r][c] != this.permutationEnc._matrix[r][c]) {
						return false;
					}
				}
			}
			return true;
		};
		
		this.validateCiphertext = function() {
			return $scope.ciphertext === this.permutationEnc._ciphertext;
		};
		
		this.informCorrect = function() {
			alert("CORRECTO");
		};
		
		this.informIncorrect = function() {
			alert("INCORRECTO");
		};
		
		this.nextStep = function() {
			switch(this.permutationEnc._currentStep) {
				case 1: {
					if(this.validateKc()) {
						this.permutationEnc.nextEncStep();
						$scope.matrix = new Array(this.permutationEnc.Kc);
						for (var r = 0; r < this.permutationEnc.Kc; r++) {
							$scope.matrix[r] = new Array(this.permutationEnc.L);
						}
						this.informCorrect();
					}
					else {
						this.informIncorrect();
					}
					return;
				}
				case 2 :
				case 3 : {
					if(this.validateMatrix()) {
						this.permutationEnc.nextEncStep();
						this.informCorrect();
					}
					else {
						this.informIncorrect();
					}
					return;
				}
				case 4: {
					if(this.validateCiphertext()) {
						this._hasFinished = true;
						this.informCorrect();
					}
					else {
						this.informIncorrect();
					}
					return;
				}
			}
		};

		this.isCurrentStep = function(step) {
			return this.permutationEnc._currentStep === step;
		};
		
		this.hasFinished = function() {
			return this._hasFinished;
		};

		this.returnHome = function() {
			$location.url('/permutacion');
		};

		this.goToDecrypt = function() {
			PermutationDec = PermutationLibrary(this.permutationEnc._key, "", this.permutationEnc._ciphertext);
			PermutationDec.nextDecStep();
			$location.url('/permutacion/decrypt-autoevaluation');
		};
	});

	app.controller('PermutationDecryptCtrl', function($scope, $routeParams, $location) {
		this._withAutoEvaluation = false;
		this.permutationDec;
		
		if ($routeParams.key && $routeParams.ciphertext) {
			$scope.permutation = { key: $routeParams.key, ciphertext: $routeParams.ciphertext};
		};
		
		this.initializeProblem = function() {	
			PermutationDec = PermutationLibrary($scope.permutation.key, "", $scope.permutation.ciphertext);
			if(this._withAutoEvaluation) {
				PermutationDec.nextDecStep();
				$location.url('/permutacion/decrypt-autoevaluation');
			}
			this.permutationDec = PermutationDec;
		};
		
		this.isInitialized = function() {
			return !(typeof this.permutationDec == undefined || this.permutationDec == null);
		};
		
		this.hasFinished = function() {
			return this.isInitialized() && (this.permutationDec._currentStep === 5);
		};
		
		this.isCurrentStep = function(step) {
			return this.isInitialized() && (this.permutationDec._currentStep === step);
		};
		
		this.currentStep = function() {
			if (this.isInitialized()) {
				return this.permutationDec._currentStep;
			}
			else {
				return -1;
			}
		};

		this.returnHome = function() {
			$location.url('/permutacion');
		};
	});
	
	app.controller('PermutationDecryptAutoevaluationCtrl', function($scope, $location) {
		this.permutationDec = function() {
			var permutation = {};
			try {
				permutation = PermutationDec;
			}
			catch(e) {
				returnHome();
			}
			return permutation;
		}();
		
		this._hasFinished = false;
		
		this.validateKd = function() {
			return parseInt($scope.varKd) === parseInt(this.permutationDec.Kd);
		};
		
		this.validateMatrix = function() {
			for (var r = 0; r < this.permutationDec.Kd; r++) {
				for (var c = 0; c < this.permutationDec.L; c++) {
					if($scope.matrix[r][c] != this.permutationDec._matrix[r][c]) {
						return false;
					}
				}
			}
			return true;
		};
		
		this.validatePlaintext = function() {
			return $scope.plaintext === this.permutationDec._plaintext;
		};
		
		this.informCorrect = function() {
			alert("CORRECTO");
		};
		
		this.informIncorrect = function() {
			alert("INCORRECTO");
		};
		
		this.nextStep = function() {
			switch(this.permutationDec._currentStep) {
				case 1: {
					if(this.validateKd()) {
						this.permutationDec.nextDecStep();
						$scope.matrix = new Array(this.permutationDec.Kd);
						for (var r = 0; r < this.permutationDec.Kd; r++) {
							$scope.matrix[r] = new Array(this.permutationDec.L);
						}
						this.informCorrect();
					}
					else {
						this.informIncorrect();
					}
					return;
				}
				case 2 :
					if(this.validateMatrix()) {
						this.permutationDec.nextDecStep();
						this.informCorrect();
					}
					else {
						this.informIncorrect();
					}
					return;
				case 3 :
				case 4 : {
					if(this.validateMatrix()) {
						this.permutationDec.nextDecStep();
						this.informCorrect();
					}
					else {
						this.informIncorrect();
					}
					return;
				}
				case 5: {
					if(this.validatePlaintext()) {
						this._hasFinished = true;
						this.informCorrect();
					}
					else {
						this.informIncorrect();
					}
					return;
				}
			}
		};
		
		this.isCurrentStep = function(step) {
			return this.permutationDec._currentStep === step;
		};

		this.hasFinished = function() {
			return this._hasFinished;
		};

		this.returnHome = function() {
			$location.url('/permutacion');
		};
	});
});

function PermutationLibrary(key, plaintext, ciphertext) {
	return {
		_key: key,
		_plaintext: plaintext,
		_ciphertext: ciphertext,
		_padChar: '$',
		_currentStep: 0,
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

		validateKey: function(key) {
			var INTEGER_REGEXP = /^(?:([0-9])(?!.*\1))*$/;
			var STRING_REGEXP = /^(?:([a-z])(?!.*\1))*$/;
			if(INTEGER_REGEXP.test(key) || STRING_REGEXP.test(key)) {
				return true;
			}
			return false;
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

		fullEnc: function() {
			while(this._currentStep < 4) {
				this.nextEncStep();
			}
		},

		fullDec: function() {
			while(this._currentStep < 5) {
				this.nextDecStep();
			}
		},

		nextEncStep: function() {
			switch(this._currentStep) {
				case 0: {
					this.step1Enc();
					this._currentStep++;
					break;
				}
				case 1: {
					this.step2Enc();
					this._currentStep++;
					break;
				}
				case 2: {
					this.step3Enc();
					this._currentStep++;
					break;
				}
				case 3: {
					this.step4Enc();
					this._currentStep++;
					break;
				}
				case 4: {
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
				case 0: {
					this.step1Dec();
					this._currentStep++;
					break;
				}
				case 1: {
					this.step2Dec();
					this._currentStep++;
					break;
				}
				case 2: {
					this.step3Dec();
					this._currentStep++;
					break;
				}
				case 3: {
					this.step4Dec();
					this._currentStep++;
					break;
				}
				case 4: {
					this.step5Dec();
					this._currentStep++;
					break;
				}
				case 5: {
					alert("El algoritmo de descifrado ya finalizó");
					break;
				}
				default: {
					alert("Error inesperado");
				}
			}
		}
	}
}
