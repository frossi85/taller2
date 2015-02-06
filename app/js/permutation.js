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
	
	app.factory("PermutationEnc",function() {
		return {};
	});
	
	app.factory("PermutationDec",function() {
		return {};
	});

	app.controller('PermutationHomeCtrl', function($scope, $location) {
		this._withAutoEvaluation = false;
		this._isEncrypt = true;

		this.initializeProblem = function() {
			if(this._isEncrypt) {
				PermutationEnc = PermutationLibrary($scope.permutation.key, $scope.permutation.plaintext, "", this._withAutoEvaluation);
				$location.url('/permutacion/encrypt');
			}
			else {
				PermutationDec = PermutationLibrary($scope.permutation.key, "", $scope.permutation.ciphertext, this._withAutoEvaluation);
				$location.url('/permutacion/decrypt');
			}		
		};
	});

	app.controller('PermutationEncryptCtrl', function($scope, $location) {
		this.permutationEnc = function() {
			var permutation;
			try {
				permutation = PermutationEnc;
			}
			catch(e) {
				$location.url('/permutacion');
			}
			return permutation;
		}();
		
		this.hasFinished = function() {
			return this.permutationEnc._currentStep === 4;
		};

		this.isCurrentStep = function(step) {
			return this.permutationEnc._currentStep === step;
		};

		this.returnHome = function() {
			$location.url('/permutacion');
		};

		this.goToDecrypt = function() {
			PermutationDec = PermutationLibrary(this.permutationEnc._key, "", this.permutationEnc._ciphertext, this.permutationEnc._withAutoEvaluation);
			$location.url('/permutacion/decrypt');
		};
	});

	app.controller('PermutationDecryptCtrl', function($scope, $routeParams, $location) {
		this.permutationDec = function() {
			var permutation;
			try {
				permutation = PermutationDec;
			}
			catch(e) {
				$location.url('/permutacion');
			}
			return permutation;
		}();

		if ($routeParams.key && $routeParams.ciphertext) {
			this.permutationDec._key = $routeParams.key;
			this.permutationDec._ciphertext = $routeParams.ciphertext;
		}

		this.isCurrentStep = function(step) {
			return this.permutationDec._currentStep === step;
		};

		this.hasFinished = function() {
			return this.permutationDec._currentStep === 5;
		};

		this.returnHome = function() {
			$location.url('/permutacion');
		};
	});
});

function PermutationLibrary(key, plaintext, ciphertext, withAutoEvaluation) {
	return {
		_key: key,
		_plaintext: plaintext,
		_ciphertext: ciphertext,
		_withAutoEvaluation: withAutoEvaluation,
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

		emptyMatrix: function() {
			for(var r = 0; r < this._matrix.length; r++) {
				for(var c = 0; c < this._matrix[0].length; c++) {
					this._matrix[r][c] = '';
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
	};
}
