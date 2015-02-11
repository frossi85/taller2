define(['angular', 'angular-route'], function(angular) {
	var app = angular.module('nlfsr', []);

	app.directive('booleanCalc', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/NLFSR/nlfsr-boolean-calc.html',
		};
	});

	app.directive('intro', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/NLFSR/nlfsr-init.html',
		};
	});

	app.directive('param', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/NLFSR/nlfsr-param.html',
		};
	});


 
	app.controller('NlfsrCtrl', function($scope, $location) {

		this.nlfsr;
		this.withAutoEvaluation = false;
		this.isEnableCalc = false;
		this.isEnableResult = false;
		this.isDisableAn = true;
		this.isDisableZero = true;
		this.isDisableOne = true;
		this.isDisableAND = true;
		this.isDisableOR = true;
		this.isDisableXOR = true;
		this.isDisableNOT = true;
		this.isDisableBrac = false;
		this.isDisableBrac2 = true;
		this.isDisableErase = true;
		this.isDisableCalculate = true;
		this.numBrac = 0;
		this.bin = [false];
		this.boolExpr = "";

		this.returnHome = function() {
			$location.url('/nlfsr');
		};

		this.initializeProblem = function() {
			this.nlfsr = NLFSRLibrary($scope.nlfsr.key, $scope.nlfsr.function, $scope.nlfsr.text);
		};

		this.isFunctionOk = function(unaFuncion) {
			return ((unaFuncion != "") && (this.numBrac == 0))
		}

		this.isInitialized = function() {
			return !(this.nlfsr == undefined || this.nlfsr == null);
		};

		this.siguiente = function(opcion) {
			if (!this.withAutoEvaluation)
				this.nlfsr.stepForward();
			else {
				console.log(opcion);
				if (this.nlfsr.applyFunction(this.nlfsr._register, this.nlfsr._function) == Number(opcion)){
					this.nlfsr.stepForward();
				}
				else
					alert("INCORRECTO");
			}
		}

		this.isFirstStep = function() {
			if (this.isInitialized() == false) 
				return true;
			return (this.nlfsr._bstream.length == this.nlfsr._register.length);
		};

		this.hasFinished = function() {
			if (this.nlfsr == undefined)
				return false;
			return (this.nlfsr._bstream.length == (this.nlfsr._text.length * 8));			
		};

		this.toggleCalc = function() {
			this.isEnableCalc = !this.isEnableCalc;
			this.isDisableAn = true;
			this.isDisableZero = true;
			this.isDisableOne = true;
			this.isDisableAND = true;
			this.isDisableOR = true;
			this.isDisableXOR = true;
			this.isDisableNOT = true;
			this.isDisableBrac = false;
			this.isDisableBrac2 = true;
			this.isDisableErase = true;
			this.isDisableCalculate = true;
			this.numBrac = 0;
			this.bin[numBrac] = false;

		};

		this.toggleResult = function() {
			this.isEnableResult = !this.isEnableResult;
		};


		this.addAn = function(expr) {
			if (expr.charAt(expr.length - 2) == "A")
				expr = expr.slice(0, expr.length - 1) + (Number(expr.slice(expr.length - 1)) + 1);	
			else
				expr = expr + "A0";
			
			this.isDisableBrac = true;
			this.isDisableBrac2 = false;
			if (this.bin[this.numBrac] == false){
				this.isDisableAND = false;
				this.isDisableOR = false;
				this.isDisableXOR = false;
				this.isDisableNOT = false;
			}


			
			return expr;
		}

		this.addZero = function(expr) {
			expr = expr + "0";
			this.isDisableZero = true;
			this.isDisableOne = true;
			this.isDisableBrac = true;
			this.isDisableBrac2 = false;
			if (this.bin[this.numBrac] == false){
				this.isDisableAND = false;
				this.isDisableOR = false;
				this.isDisableXOR = false;
				this.isDisableNOT = false;
			}
			return expr;
		}

		this.addOne = function(expr) {
			expr = expr + "1";
			this.isDisableZero = true;
			this.isDisableOne = true;
			this.isDisableBrac = true;
			this.isDisableBrac2 = false;
			if (this.bin[this.numBrac] == false){
				this.isDisableAND = false;
				this.isDisableOR = false;
				this.isDisableXOR = false;
				this.isDisableNOT = false;
			}

			return expr;
		}

		this.addAND = function(expr) {
			expr = expr + "AND";
			this.isDisableAn = false;
			this.isDisableZero = false;
			this.isDisableOne = false;
			this.isDisableBrac = false;
			this.isDisableAND = true;
			this.isDisableOR = true;
			this.isDisableXOR = true;
			this.isDisableNOT = true;
			this.isDisableBrac2 = true;
			this.bin[this.numBrac] = true;
			return expr;
		}
		this.addOR = function(expr) {
			expr = expr + "OR";
			this.isDisableAn = false;
			this.isDisableZero = false;
			this.isDisableOne = false;
			this.isDisableBrac = false;
			this.isDisableAND = true;
			this.isDisableOR = true;
			this.isDisableXOR = true;
			this.isDisableNOT = true;
			this.isDisableBrac2 = true;
			this.bin[this.numBrac] = true;
			return expr;
		}
		this.addXOR = function(expr) {
			expr = expr + "XOR";
			this.isDisableAn = false;
			this.isDisableZero = false;
			this.isDisableOne = false;
			this.isDisableBrac = false;
			this.isDisableAND = true;
			this.isDisableOR = true;
			this.isDisableXOR = true;
			this.isDisableNOT = true;
			this.isDisableBrac2 = true;
			this.bin[this.numBrac] = true;
			return expr;
		}
		this.addNOT = function(expr) {
			expr = expr + "NOT";
			this.isDisableAn = false;
			this.isDisableZero = false;
			this.isDisableOne = false;
			this.isDisableBrac = false;
			this.isDisableAND = true;
			this.isDisableOR = true;
			this.isDisableXOR = true;
			this.isDisableNOT = true;
			this.isDisableBrac2 = true;
			this.bin[this.numBrac] = true;
			return expr;
		}
		this.addBrac = function(expr) {
			expr = expr + "(";
			this.isDisableAn = false;
			this.isDisableZero = false;
			this.isDisableOne = false;
			this.numBrac++;
			this.bin[this.numBrac] = false;
			this.isDisableErase = false;
			this.isDisableNOT = false;
			return expr;
		}
		this.addBrac2 = function(expr) {
			expr = expr + ")";
			this.bin[this.numBrac] = false;
			this.numBrac--;
			this.isDisableAn = true;
			this.isDisableZero = true;
			this.isDisableOne = true;

	
			if (this.numBrac == 0){
				this.isDisableBrac = true;
				this.isDisableBrac2 = true;
				this.isDisableAND = true;
				this.isDisableOR = true;
				this.isDisableXOR = true;
				this.isDisableNOT = true;
				this.isDisableCalculate = false;
				return expr;
			}

			if (!(this.bin[this.numBrac])) {
				this.isDisableAND = false;
				this.isDisableOR = false;
				this.isDisableXOR = false;
			}

			return expr;
		}
		this.erase = function(expr) {
			for(i = this.numBrac; i > 0; i--)
				this.bin[i] = false;
			expr = "";
			this.isDisableErase = true;
			this.isDisableBrac = false;
			return expr;
		}
		this.calculate = function(expr) {
			expr = expr + " = " + this.nlfsr.bc("", expr);
			this.isDisableCalculate = true;
			return expr;
		}
	});
});

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
			if (expr.substr(0,3) == "XOR")
				return car ^ this.bc(car, expr.slice(3));
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

		ejecutar: function() {
			while (this._bstream.length != (this._text.length * 8)){
				this.stepForward();
			}
		},

		encriptar: function() {
			ret = "";
			for(i = 0; i < this._text.length; i++){
				ret += (this._text[i]).charCodeAt(0) ^ this._bstream.slice(i*8, i*8 + 7);
			}
			console.log((this._text).charCodeAt());
			return ret;
		},
	}
}