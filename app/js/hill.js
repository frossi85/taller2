define(['angular', 'angular-route', 'angular-animate'], function(angular) {
	var app = angular.module('hill', ['ngAnimate']);

	app.directive('hillMultiple', function() {
	  return {
	    require: 'ngModel',
	    link: function(scope, elm, attrs, ctrl) {
	      ctrl.$validators.hillMultiple = function(modelValue, viewValue) {
	      	var valid = true;;
	        if (viewValue.length % scope.clave_length != 0) {
	        	valid = false;
	        }
        	ctrl.$setValidity('hillMultiple', valid);
        	return valid;
	      };
	    }
	  };
	});

	app.directive('ngConfirmClick', [
	  function(){
	    return {
	      priority: -1,
	      restrict: 'A',
	      link: function(scope, element, attrs){
	        element.bind('click', function(e){
	          var message = attrs.ngConfirmClick;
	          if(message && !confirm(message)){
	            e.stopImmediatePropagation();
	            e.preventDefault();
	          }
	        });
	      }
	    }
	  }
	]);

	app.controller('HillCtrl', function($scope, $location) {
		this.toEncrypt = function () {
			$location.url('/hill/encrypt');
		};

		this.toDecrypt = function () {
			$location.url('/hill/decrypt');
		};
	});


	app.controller('HillEncryptCtrl', function($scope, $location) {
		$scope.evaluacion = false;
		$scope.start = false;
		$scope.step = 0;
		$scope.end = false;
		$scope.key = '';
		$scope.plaintext = '';
		this.plaintext = '';

		$scope.clave_length = 2;

		$scope.clave = new Array($scope.clave_length);
		for (var i =0 ; i < $scope.clave.length ; i++) {
			$scope.clave[i] = new Array($scope.clave_length);
		}

		$scope.vector = new Array($scope.clave_length);
		$scope.parcial = new Array($scope.clave_length);
		$scope.cipher = new Array($scope.clave_length);

		this.cloneArray = function(arr) {
			return JSON.parse(JSON.stringify(arr));
		}

		this.clave = this.cloneArray($scope.clave);
		this.vector = this.cloneArray($scope.vector);
		this.parcial = this.cloneArray($scope.parcial);
		this.cipher = this.cloneArray($scope.cipher);

		this.mod = function(vector) {
			var resultado = [];
			for (var i = 0 ; i < vector.length ; i++) {
				resultado[i] = vector[i] % 26;
			}
			return resultado;
		}

		this.mult = function(clave, vector) {
			var resultado = [];
			for (var i = 0 ; i < clave.length ; i++) {
				resultado[i] = 0;
				for (var j = 0 ; j < clave[i].length ; j++) {
					resultado[i] += clave[i][j] * vector[j];
				}
			}
			return resultado;
		}

		this.toCode = function(string, pos) {
			var chrA = 'a'.charCodeAt(0);
			return string.charCodeAt(pos) - chrA;
		}

		this.fromCode = function(code) {
			var chrA = 'a'.charCodeAt(0);
			return String.fromCharCode(code + chrA);
		}

		this.init = function() {
			$scope.start = true;
			$scope.step = 0;
			$scope.end = false;
			$scope.result = '';
			this.result = '';

			var c = 0;
			for (var i = 0 ; i < this.clave.length ; i++) {
				for (var j = 0 ; j < this.clave[i].length ; j++) {
					this.clave[i][j] = this.toCode($scope.key, c++);
				}
			}

			if (!$scope.evaluacion) {
				$scope.clave = this.cloneArray(this.clave);
			}

			this.next();
		}

		this.auto = function(auto) {
			$scope.evaluacion = auto;
			this.reset();
		}

		this.reset = function() {
			$scope.result = '';
			for (var i = 0 ; i < $scope.clave.length ; i++) {
				$scope.vector[i] = '';
				$scope.parcial[i] = '';
				$scope.cipher[i] = '';
				for (var j = 0 ; j < $scope.clave[i].length ; j++) {
					$scope.clave[i][j] = '';
				}
			}

		}

		this.next = function() {

	  	var c = 0;
	  	var subStart = this.vector.length * $scope.step;
	  	var subEnd = subStart + this.vector.length;

			if ($scope.step && $scope.evaluacion) {
				if ($scope.clave.toString() != this.clave.toString()) {
					alert('Hay un error con la clave');
					return;
				}

				if (subEnd >= $scope.plaintext.length) {
					$scope.start = false;
				}

			}

			for (var i = 0 ; i < this.vector.length ; i++) {
				this.vector[i] = this.toCode($scope.plaintext.substring(subStart, subEnd), c++);
			}

			this.parcial = this.mult(this.clave, this.vector);
			this.cipher = this.mod(this.parcial);

			for (var i = 0 ; i < this.parcial.length ; i++) {
				this.result += this.fromCode(this.cipher[i]);
			}

			if (!$scope.evaluacion) {
				$scope.vector = this.vector.slice(0);
				$scope.parcial = this.parcial.slice(0);
				$scope.cipher = this.cipher.slice(0);
				$scope.result = this.result;

				if (subEnd >= $scope.plaintext.length) {
					$scope.start = false;
				}
			}

			$scope.step++;
		}

		this.finish = function() {
			if ($scope.evaluacion) {
				this.reset();
				$scope.start = false;
				return;
			}
			while ($scope.start) {
		  	this.next();
			}
		}

	});

	app.controller('HillDecryptCtrl', function($scope, $location) {

	});
});

