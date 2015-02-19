define(['angular', 'angular-route'], function(angular) {
	var app = angular.module('nlfsr', []);

	app.factory("Nlfsr",function() {
		return {};
	});

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

 
	app.controller('NlfsrCtrl', function($scope, $location) {
		this.nlfsr = function() {
			var nlfsr;
			try {
				nlfsr = Nlfsr;
			}
			catch(e) {
				$location.url('/nlfsr');
			}
			return nlfsr;
		}();


		this.calcCtrl = CalcController();
		this.withAutoEvaluation = false;
		this.isEnableCalc = false;
		this.isEnableResult = false;
		this.boolExpr = "";

		this.returnHome = function() {
			$location.url('/nlfsr');
		};

		this.initializeProblem = function() {
			if  (this.checkParam($scope.nlfsr.key.length, $scope.nlfsr.function)){
				Nlfsr = NLFSRLibrary($scope.nlfsr.key, $scope.nlfsr.function, $scope.nlfsr.text);
				this.nlfsr = Nlfsr;
			}
			else{
				alert("Hay mas variables An que el número máximo permitido por la clave: " + $scope.nlfsr.key.length);
				return false;
			}
		};

		this.checkParam = function(n, funcion) {
			for(i = 9; i > n; i--){
				if (funcion.indexOf(i) != -1)
					return false;
			}
			return true;
		}

		//Chequea que la expresion ingresada no sea nula

		this.isFunctionOk = function(unaFuncion) {
			return ((unaFuncion != "") && (this.calcCtrl.numBrac == 0))
		}

		this.isInitialized = function() {
			return !(this.nlfsr == undefined || this.nlfsr == null);
		}

		this.siguiente = function(opcion) {
			if (!this.withAutoEvaluation)
				this.nlfsr.stepForward();
			else {
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
			if (!this.isInitialized())
				return false;
			return (this.nlfsr._bstream.length == (this.nlfsr._text.length * 8));			
		};

		this.toggleCalc = function() {
			this.calcCtrl.reset();
			this.isEnableCalc = !this.isEnableCalc;
		};

		this.toggleResult = function() {
			this.isEnableResult = !this.isEnableResult;
		};


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
				funcion = funcion.split("A" + i).join(reg.charAt(i));
			}
			console.log(funcion);
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

		textToBinary: function() {
			ret = "";
			for(i = 0; i < this._text.length; i++){
				car = (this._text.charCodeAt(i)).toString(2);
				if (car.length == 7)
					car = "0" + car;
				ret +=  car;
			}
			return ret;
		},

		encriptar: function() {
			ret = "";
			for(i = 0; i < this._text.length; i++){
				car = (this._text.charCodeAt(i) ^ parseInt((this._bstream.slice(i*8, i*8 + 8)),2)).toString(2);
				limit = car.length;
				for(j = 8; j > limit; j--){
					car = "0" + car;
				}
				ret += car;
			}
			return ret;
		},
	}
}

function CalcController() {
	return {
		calc: NLFSRLibrary("", "", ""),
		isDisableAn: true,
		isDisableZero: true,
		isDisableOne: true,
		isDisableAND: true,
		isDisableOR: true,
		isDisableXOR: true,
		isDisableNOT: true,
		isDisableBrac: false,
		isDisableBrac2: true,
		isDisableErase: true,
		isDisableCalculate: true,
		numBrac: 0,
		bin: [false],

		addAn: function(expr) {
			if (expr.charAt(expr.length - 2) == "A"){
				if (expr[expr.length - 1] != "9")
					expr = expr.slice(0, expr.length - 1) + (Number(expr.slice(expr.length - 1)) + 1);
				else
					expr = expr.slice(0, expr.length - 1) + 0;
			}
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
		},

		addZero: function(expr) {
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
		},

		addOne: function(expr) {
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
		},

		addAND: function(expr) {
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
		},

		addOR: function(expr) {
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
		},

		addXOR: function(expr) {
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
		},

		addNOT: function(expr) {
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
		},

		addBrac: function(expr) {
			expr = expr + "(";
			this.isDisableAn = false;
			this.isDisableZero = false;
			this.isDisableOne = false;
			this.numBrac++;
			this.bin[this.numBrac] = false;
			this.isDisableErase = false;
			this.isDisableNOT = false;
			return expr;
		},

		addBrac2: function(expr) {
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
		},

		erase: function(expr) {
			expr = "";
			this.reset();
			this.isDisableErase = true;
			return expr;
		},

		calculate: function(expr) {
			expr = expr + " = " + this.calc.bc("", expr);
			this.isDisableCalculate = true;
			return expr;
		},

		reset: function() {
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
			for(i = this.numBrac; i > 0; i--)
				this.bin[i] = false;
			this.numBrac = 0;
		}
	}
}