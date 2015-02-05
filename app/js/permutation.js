define(['angular', 'angular-route'], function(angular) {
	var app = angular.module('permutation', []);
	
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
	
	app.directive('keyValidation', function() {
		return {
			require: 'ngModel',
			link: function(scope, elm, attrs, ctrl) {
				ctrl.$parsers.unshift(function (viewValue) {
					ctrl.$setValidity('key-validation', PermutationLibrary("", "", "").validateKey(viewValue));
					return viewValue;
				});
			}
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
			return false;
		};
		
		this.hasFinished = function() {
			return this.isInitialized() && (this.permutationEnc._currentStep === 5);
		};
		
		this.returnHome = function() {
			$location.url('/permutacion');
		};
		
		this.goToDecrypt = function() {
			$location.url('/permutacion/decrypt');
// 			$scope.permutation.decKey = this.permutationEnc._key;
// 			$scope.permutation.ciphertext = this.permutationEnc._ciphertext;
		};
		
		this.initializeProblem = function() {
			this.permutationEnc = PermutationLibrary($scope.permutation.encKey, $scope.permutation.plaintext, "");
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
		};
	});
});

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