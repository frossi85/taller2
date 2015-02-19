define(['angular', 'angular-route'], function(angular) {
	var app = angular.module('rc4', []);

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

	app.controller('Rc4HomeCtrl', function($scope, $location) {
		this.toEncrypt = function () {
			$location.url('/rc4/encrypt');
		};

		this.toDecrypt = function () {
			$location.url('/rc4/decrypt');
		};
	});


	app.controller('Rc4EncryptCtrl', function($scope, $location) {
		this._withAutoEvaluation = false;
		this.start = false;
		this.step = 0;
		this.end = false;

		this.s = [];
		this.ksa = false;
		this.i = 0;
		this.j = 0;

		this.parcial  = '';
		this.jParcial = 0;
		this.iParcial = 0;
		this.sParcial = [];
		this.resultParcial = '';

		$scope.descifrar = false;
		$scope.key = '';
		$scope.plaintext = '';
		$scope.finalizar = true;
		$scope.showPGRA = false;
		$scope.showKSA = false;
		$scope.parcialError = false;
		$scope.resultValue = '';
		$scope.plaintextValue = '';

		$scope.hideResult = true;
		$scope.hideKeyStream = true;

		this.init = function() {
	
			$scope.parcial= '';
			$scope.ksa = '';
			$scope.result = '';
			$scope.finalizar = false;
			$scope.descifrar = false;	
			$scope.showPGRA = false;
			$scope.showKSA = true;
			$scope.parcialError = false;
			$scope.resultValue = '';
			$scope.plaintextValue = '';

			$scope.hideResult = false;
			$scope.hideKeyStream = false;
		
			this.s = [];
			this.ksa = false;
			this.start = true;
			this.step = 0;
			this.end = false;

			this.parcial  = '';
			this.jParcial = 0;
			this.iParcial = 0;
			this.sParcial = [];

			this.resultParcial = '';

			this.i = 0;
			this.j = 0;

			for ( this.i = 0; this.i < 256; this.i++) {
				this.s[this.i] = this.i;
			}
			
			this.i = 0;
			$scope.parcial = this.s.toString();	
			
			for(var cont= 0; cont < $scope.plaintext.length; cont++){
				if($scope.plaintextValue != ''){		
					$scope.plaintextValue += $scope.plaintext.charCodeAt(cont) + ",";
				}
				else{
					$scope.plaintextValue = $scope.plaintext.charCodeAt(cont) + ",";
				}
			}
		}

		this.auto = function(auto) {
			console.log("auto");
			this._withAutoEvaluation = auto;
			this.reset();
		}

		this.reset = function() {
			console.log("reset");
			$scope.key = '';
			$scope.ksa = '';
			$scope.plaintext = '';
			$scope.parcial = '';
			$scope.result = '';
			$scope.finalizar = true;
			$scope.descifrar = false;
			$scope.parcialError = false;
			$scope.resultValue = '';
			$scope.plaintextValue = '';

			
			$scope.hideResult = true;
			$scope.hideKeyStream = true;
			

			this.i = 0;
			this.j = 0;
			this.s = [];
			this.ksa = false;

			this.parcial  = '';
			this.jParcial = 0;
			this.iParcial = 0;
			this.sParcial = [];

			this.resultParcial = '';
		}

		this.next = function() {
			
			if(this.ksa == false){

				if(this._withAutoEvaluation == false){
					this.stepKSA();
				}
				else{
					this.stepKSAEval(false);
				}	
			}
			else{
				if(this._withAutoEvaluation == false){
					this.stepPGA();
				}
				else{
					this.stepPGAEval(false);
				}
			}
		}

		this.finish = function() {
			if(this._withAutoEvaluation == false){
				this.finishStep();
			}
			else{
				this.finishStepEval();
			}					
		}
		
		this.finishStep = function(){
			if(this.ksa == false){
				for( cont = this.i ; cont <= 256 ; cont++){
					this.stepKSA();
				}			
			}
			else{
				for( cont = this.step ; cont < $scope.plaintext.length ; cont++){
					this.stepPGA();
				}
				this.start = false;
				this.end = true;
				$scope.descifrar = true;
				$scope.finalizar = true;
				$scope.showPGRA = false;
				$scope.showKSA = false;
			}	
		}

		this.finishStepEval = function(){
				
			this.iAux = this.i;
			this.jAux = this.j;
			this.sAux = this.s.slice();

			if(this.ksa == false){
				for( cont = this.i ; cont <= 256 ; cont++){
					this.stepKSAEval(true);
				}		
			}
			else{
				console.log("inicio");
				if($scope.parcial[$scope.parcial.length -1] == ","){
					var pos = $scope.parcial.length -1;
					$scope.parcial = $scope.parcial.slice(0,pos);
				}

				for( cont = this.step ; cont < $scope.plaintext.length ; cont++){
					this.stepPGAEval(true);
				}
			}
		}


		this.stepKSA = function(){
			this.j =  (this.j + this.s[this.i] + $scope.key.charCodeAt(this.i % $scope.key.length)) % 256;
		
			this.s = this.swap(this.s,this.i,this.j);
			$scope.parcial = this.s.toString();
			
			if(this.i >= 256){

				$scope.ksa = $scope.parcial;
	
				this.i = 0;
				this.j = 0;
				this.iter = 0;	
				this.ksa = true;
				this.step =  0;
				$scope.showPGRA = true;
				$scope.showKSA = false;
				$scope.parcial = '';
			}
			else{
				this.i++;
			}
		}

		this.stepKSAEval = function( finish ){

			if(this.sParcial == ''){
				this.sParcial = this.s.slice();
			}

			this.jParcial =  (this.jParcial + this.sParcial[this.iParcial] + $scope.key.charCodeAt(this.iParcial % $scope.key.length)) % 256;		
	
			this.sParcial = this.swap(this.sParcial,this.iParcial,this.jParcial);
			this.parcial = this.sParcial.toString();

			if(finish == false){
			
				if(this.parcial.toString() != $scope.parcial.toString()){
					$scope.parcialError = true;
					this.jParcial = this.j;
					this.iParcial = this.i;
					this.sParcial = '';
				}
				else{
					this.s = this.sParcial.slice();
					this.j = this.jParcial;
					this.i = this.iParcial;

					$scope.parcialError = false;

					$scope.ksa = $scope.parcial;

					if(this.i >= 256){
						this.i = 0;
						this.j = 0;
						this.iter = 0;	
						this.ksa = true;
						this.step =  0;
						$scope.showPGRA = true;
						$scope.showKSA = false;
						$scope.parcial = '';
						this.iParcial = this.i;
						this.jParcial = this.j;
						this.sParcial = '';
					}
					else{
						this.i++;
						this.iParcial = this.i;
					}
				}
			}
			else{
				if(this.i >= 256){

					if($scope.parcial[$scope.parcial.length -1] != ","){
						$scope.parcial += ",";
					}						

					if(this.parcial.toString() == $scope.parcial.toString()){

						this.s = this.sParcial.slice();
						this.j = this.jParcial;
						this.i = this.iParcial;

						$scope.parcialError = false;

						$scope.ksa = $scope.parcial;

						this.i = 0;
						this.j = 0;
						this.iter = 0;	
						this.ksa = true;
						this.step =  0;
						$scope.showPGRA = true;
						$scope.showKSA = false;
						$scope.parcial = '';
						this.iParcial = this.i;
						this.jParcial = this.j;
						this.sParcial = '';
					}
					else{
						this.i = this.iAux;
						this.j = this.jAux;
						this.s = this.sAux.slice();
	
						this.iParcial = this.i;
						this.jParcial = this.j;
						this.sParcial = '';
						$scope.parcialError = true;
					}	
				}
				else{
					this.i++;
					this.iParcial = this.i;
					this.j = this.jParcial;
				}
			}
		}

		this.swap = function (sAux, i, j){
			var m = sAux[i];
			sAux[i] = sAux[j];
			sAux[j] = m;
			return sAux;
		}

		this.stepPGA = function(){

			this.i = (parseInt(this.i) + 1) % 256;

			this.j = (parseInt(this.j) + parseInt(this.s[this.i])) % 256;
			
			this.s = this.swap(this.s,this.i,this.j);
						
			var temp = String.fromCharCode($scope.plaintext.charCodeAt(this.step) ^ this.s[(parseInt(this.s[this.i]) + parseInt(this.s[this.j])) % 256]); 

			$scope.parcial = $scope.plaintext.charCodeAt(this.step) ^ this.s[(parseInt(this.s[this.i]) + parseInt(this.s[this.j])) % 256]; 	

			if($scope.result != ''){
				$scope.result += temp;		
				$scope.resultValue += $scope.result.charCodeAt(this.step) + ",";			
			}
			else{
				$scope.result = temp;
				$scope.resultValue = $scope.result.charCodeAt(this.step) + ",";
			}
			
			this.step++;

			if(this.step >= $scope.plaintext.length){
				this.end = true;
				$scope.finalizar = true;
				this.finish();
			}
		}


		this.stepPGAEval = function(finish){
			
			$scope.parcialError = false;

			if(this.sParcial == ''){
				this.sParcial = this.s.slice();
			}

			this.iParcial = (parseInt(this.i) + 1) % 256;

			this.jParcial = (parseInt(this.j) + parseInt(this.s[this.iParcial])) % 256;
			
			this.sParcial = this.swap(this.sParcial,this.iParcial,this.jParcial);
						
			this.parcial = String.fromCharCode($scope.plaintext.charCodeAt(this.step) ^ this.sParcial[(parseInt(this.sParcial[this.iParcial]) + parseInt(this.sParcial[this.jParcial])) % 256]); 
			var temp = $scope.plaintext.charCodeAt(this.step) ^ this.sParcial[(parseInt(this.sParcial[this.iParcial]) + parseInt(this.sParcial[this.jParcial])) % 256]; 
	
			if(finish == false){

				console.log("temp " + temp );
				console.log("$scope.parcial " + $scope.parcial);

				if(temp.toString() == $scope.parcial.toString()){
	
					this.i = this.iParcial;
					this.j = this.jParcial;
					this.s = this.sParcial.slice();

					$scope.parcial = '';
	
					$scope.parcialError = false;

					if($scope.result != ''){
						$scope.result += this.parcial;	
						$scope.resultValue += $scope.result.charCodeAt(this.step) + ",";			
					}
					else{
						$scope.result = this.parcial;
						$scope.resultValue = $scope.result.charCodeAt(this.step) + ",";
					}
			
					this.step++;

					if(this.step >= $scope.plaintext.length){
						this.end = true;
						$scope.finalizar = true;
						this.finish();
						$scope.parcialError = false;
						this.start = false;
						$scope.descifrar = true;
						$scope.finalizar = true;
						$scope.showPGRA = false;
						$scope.showKSA = false;
					}
				}
				else{
					$scope.parcialError = true;
				}
			}
			else{
				this.i = this.iParcial;
				this.j = this.jParcial;
				this.s = this.sParcial.slice();

				if(this.resultParcial != ''){
					this.resultParcial += this.parcial;				
				}
				else{
					this.resultParcial = this.parcial;
				}
			
				
				this.step++;
			
				if(this.step >= $scope.plaintext.length){

					var parcialTemp = $scope.parcial.split(",");	
					var resultTemp = $scope.result;

					for( var cont= 0; cont< parcialTemp.length; cont++){

						var char = String.fromCharCode(parcialTemp[cont]);
						if(resultTemp != ''){
							resultTemp += char;
						}
						else{
							resultTemp = char;
						}
					}

					if($scope.result.toString() != ''){
						this.result = $scope.result.toString() + this.resultParcial.toString();
					}
					else{
						this.result = this.resultParcial.toString();
					}
				
					if(this.result.toString() == resultTemp.toString()){

						$scope.result = this.result;
						$scope.resultValue = '';
						for(var cont = 0; cont < $scope.result.length; cont++){
							if($scope.resultValue != ''){
								$scope.resultValue += this.result.charCodeAt(cont) + ",";
							}
							else{
								$scope.resultValue = this.result.charCodeAt(cont) + ",";
							}
						}
			
						
						this.end = true;
						$scope.finalizar = true;
						$scope.parcialError = false;
						this.start = false;
						this.end = true;
						$scope.descifrar = true;
						$scope.finalizar = true;
						$scope.showPGRA = false;
						$scope.showKSA = false;
					}
					else{
						this.resultParcial = ''; 
						this.step = $scope.result.length;
						$scope.parcialError = true;	
						this.i = this.iAux;
						this.j = this.jAux;
						this.s = this.sAux.slice();
						this.sParcial = '';						
					}
				}
			}
		}

		this.descifrar = function(){
			$scope.plaintext = $scope.result;
			$scope.parcial = '';
			$scope.result = '';
			$scope.ksa = '';
			$scope.descifrar = false;
			$scope.resultValue = '';
			$scope.plaintextValue = '';

			$scope.hideResult = true;
			$scope.hideKeyStream = true;
		}
	});
});
