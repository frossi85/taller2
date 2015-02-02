define(['angular', 'angular-route'], function(angular) {
	var app = angular.module('nlfsr', []);
  
	app.controller('NlfsrCtrl', function($scope, $location) {
	this.initializeProblem = function() {
		this.nlfsr = NLFSRLibrary($scope.nlfsr.key, $scope.nlfsr.function, $scope.nlfsr.text);
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