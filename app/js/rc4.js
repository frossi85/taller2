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

		$scope.descifrar = false;
		$scope.key = '';
		$scope.plaintext = '';
		$scope.finalizar = true;

		this.init = function() {
	
			$scope.parcial= '';
			$scope.ksa = '';
			$scope.result = '';
			$scope.finalizar = false;
			$scope.descifrar = false;	
		
			this.s = [];
			this.ksa = false;
			this.start = true;
			this.step = 0;
			this.end = false;

			this.i = 0;
			this.j = 0;

			for ( this.i = 0; this.i < 256; this.i++) {
				this.s[this.i] = this.i;
			}
			
			this.i = 0;
			this.stepKSA();
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
			$scope.finalizar = false;
			$scope.descifrar = false;
			this.i = 0;
			this.j = 0;
			this.s = [];
			this.ksa = false;
		}

		this.next = function() {
			
			console.log("next");
			
			if(this.ksa == false){
				this.stepKSA();
			}
			else{
				this.stepPGA();
			}
		}

		this.finish = function() {
			console.log("finish");

			if(this.ksa == false){
				console.log("KSA init");
				for( cont = this.i ; cont <= 256 ; cont++){
					this.stepKSA();
				}				
				console.log("KSA finish");
			}
			else{
				console.log("PGA init");
				for( cont = this.step ; cont < $scope.plaintext.length ; cont++){
					this.stepPGA();
				}
				console.log("PGA finish");
				this.start = false;
				this.end = true;
				$scope.descifrar = true;
				$scope.finalizar = true;
			}			
		}
		
		this.stepKSA = function(){
			this.j =  (this.j + this.s[this.i] + $scope.key.charCodeAt(this.i % $scope.key.length)) % 256;
		
			this.s = this.swap(this.s,this.i,this.j);
			$scope.parcial = this.s.toString();
			
			if(this.i >= 256){
				
				for(x = 0; x < this.s.length; x++){
					if($scope.ksa != ''){
						$scope.ksa += String.fromCharCode(parseInt(this.s[x]));
					}
					else{
						$scope.ksa = String.fromCharCode(parseInt(this.s[x]));
					}
				}
	
				this.i = 0;
				this.j = 0;
				this.iter = 0;	
				this.ksa = true;
				this.step =  0;
			}
			else{
				this.i++;
			}
		}

		this.swap = function (s, i, j){
			var m = s[i];
			s[i] = s[j];
			s[j] = m;
			return s;
		}

		this.stepPGA = function(){

			this.i = (parseInt(this.i) + 1) % 256;
			console.log("I = " + this.i);

			this.j = (parseInt(this.j) + parseInt(this.s[this.i])) % 256;
			console.log("J = " + this.j);
			
			this.s = this.swap(this.s,this.i,this.j);
						
			$scope.parcial = String.fromCharCode($scope.plaintext.charCodeAt(this.step) ^ this.s[(parseInt(this.s[this.i]) + parseInt(this.s[this.j])) % 256]); 
			console.log("parcial = " + $scope.parcial);

			if($scope.result != ''){
				$scope.result += $scope.parcial;
				console.log("parcial = " + $scope.result);
									
			}
			else{
				$scope.result = $scope.parcial;
				console.log("parcial = " + $scope.result);
			}
			
			this.step++;

			if(this.step >= $scope.plaintext.length){
				this.end = true;
				$scope.finalizar = true;
				this.finish();
			}

			console.log($scope.result);
		}

		this.descifrar = function(){
			$scope.plaintext = $scope.result;
			$scope.parcial = '';
			$scope.result = '';
			$scope.ksa = '';
			$scope.descifrar = false;
		}
	});
});
