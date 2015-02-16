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

		// Returns the inverse of matrix `M`.
		function matrix_invert(M){
		    // I use Guassian Elimination to calculate the inverse:
		    // (1) 'augment' the matrix (left) by the identity (on the right)
		    // (2) Turn the matrix on the left into the identity by elemetry row ops
		    // (3) The matrix on the right is the inverse (was the identity matrix)
		    // There are 3 elemtary row ops: (I combine b and c in my code)
		    // (a) Swap 2 rows
		    // (b) Multiply a row by a scalar
		    // (c) Add 2 rows

		    //if the matrix isn't square: exit (error)
		    if(M.length !== M[0].length){return;}

		    //create the identity matrix (I), and a copy (C) of the original
		    var i=0, ii=0, j=0, dim=M.length, e=0, t=0;
		    var I = [], C = [];
		    for(i=0; i<dim; i+=1){
		        // Create the row
		        I[I.length]=[];
		        C[C.length]=[];
		        for(j=0; j<dim; j+=1){

		            //if we're on the diagonal, put a 1 (for identity)
		            if(i==j){ I[i][j] = 1; }
		            else{ I[i][j] = 0; }

		            // Also, make the copy of the original
		            C[i][j] = M[i][j];
		        }
		    }

		    // Perform elementary row operations
		    for(i=0; i<dim; i+=1){
		        // get the element e on the diagonal
		        e = C[i][i];

		        // if we have a 0 on the diagonal (we'll need to swap with a lower row)
		        if(e==0){
		            //look through every row below the i'th row
		            for(ii=i+1; ii<dim; ii+=1){
		                //if the ii'th row has a non-0 in the i'th col
		                if(C[ii][i] != 0){
		                    //it would make the diagonal have a non-0 so swap it
		                    for(j=0; j<dim; j++){
		                        e = C[i][j];       //temp store i'th row
		                        C[i][j] = C[ii][j];//replace i'th row by ii'th
		                        C[ii][j] = e;      //repace ii'th by temp
		                        e = I[i][j];       //temp store i'th row
		                        I[i][j] = I[ii][j];//replace i'th row by ii'th
		                        I[ii][j] = e;      //repace ii'th by temp
		                    }
		                    //don't bother checking other rows since we've swapped
		                    break;
		                }
		            }
		            //get the new diagonal
		            e = C[i][i];
		            //if it's still 0, not invertable (error)
		            if(e==0){return}
		        }

		        // Scale this row down by e (so we have a 1 on the diagonal)
		        for(j=0; j<dim; j++){
		            C[i][j] = C[i][j]/e; //apply to original matrix
		            I[i][j] = I[i][j]/e; //apply to identity
		        }

		        // Subtract this row (scaled appropriately for each row) from ALL of
		        // the other rows so that there will be 0's in this column in the
		        // rows above and below this one
		        for(ii=0; ii<dim; ii++){
		            // Only apply to other rows (we want a 1 on the diagonal)
		            if(ii==i){continue;}

		            // We want to change this element to 0
		            e = C[ii][i];

		            // Subtract (the row above(or below) scaled by e) from (the
		            // current row) but start at the i'th column and assume all the
		            // stuff left of diagonal is 0 (which it should be if we made this
		            // algorithm correctly)
		            for(j=0; j<dim; j++){
		                C[ii][j] -= e*C[i][j]; //apply to original matrix
		                I[ii][j] -= e*I[i][j]; //apply to identity
		            }
		        }
		    }

		    //we've done all operations, C should be the identity
		    //matrix I should be the inverse:
		    return I;
		}

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
			return String.fromCharCode(parseInt(code) + chrA);
		}

		this.init = function() {
			$scope.start = true;
			$scope.step = 0;
			$scope.finish = false;
			$scope.result = '';
			$scope.error = false;
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
			$scope.finish = false;
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
					$scope.error = "Hay un error con la clave!";
					return;
				}

				if ($scope.vector.toString() != this.vector.toString()) {
					$scope.error = "Hay un error con el vector!";
					return;
				}

				if ($scope.parcial.toString() != this.parcial.toString()) {
					$scope.error = "Hay un error con el resultado parcial!";
					return;
				}

				if ($scope.cipher.toString() != this.cipher.toString()) {
					$scope.error = "Hay un error con el el resultado del módulo 26!";
					return;
				}

				if ($scope.result != this.result) {
					$scope.error = "Hay un error con el el resultado del algoritmo!";
					return;
				}

				$scope.error = false;

				if (subEnd > $scope.plaintext.length) {
					$scope.start = false;
					$scope.finish = true;
					return;
				}

				for (var i = 0 ; i < $scope.vector.length ; i++) {
					$scope.vector[i] = '';
					$scope.parcial[i] = '';
					$scope.cipher[i] = '';
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
					$scope.finish = true;
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

