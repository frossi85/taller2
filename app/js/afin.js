define(['angular', 'angular-route'], function(angular) {
	var app = angular.module('afin', []);

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

	app.controller('AfinHomeCtrl', function($scope, $location) {
		this.toEncrypt = function () {
			$location.url('/afin/encrypt');
		};

		this.toDecrypt = function () {
			$location.url('/afin/decrypt');
		};
	});


	app.controller('AfinEncryptCtrl', function($scope, $location) {
		this.z26 = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
		this._withAutoEvaluation = false;
		this.start = false;
		this.step = 0;
		this.end = false;
		this.char = '';
		this.M = 0;
		$scope.keyA = '';
		$scope.keyB = '';
		$scope.plaintext = '';
		$scope.parcial= '';
		$scope.result = '';
		$scope.hideParcial = true;
		$scope.hideResult = true;


		this.init = function() {

			$scope.parcial= '';
			$scope.result = '';
			$scope.hideParcial = false;
			$scope.hideResult = false;
			
			this.start = true;
			this.step = 0;
			this.end = false;
			this.char = '';
			this.M = 0;

			this.stepCifrado();
		}

		this.auto = function(auto) {
			this._withAutoEvaluation = auto;
			this.reset();
		}

		this.reset = function() {
			$scope.keyA = '';
			$scope.keyB = '';
			$scope.plaintext = '';
			$scope.parcial= '';
			$scope.result = '';
			$scope.hideParcial = true;
			$scope.hideResult = true;
		}

		this.next = function() {

			this.stepCifrado();
		}

		this.finish = function() {
			var result = '';

			for(j = this.step; j < $scope.plaintext.length; j++ ){
	
				this.char = $scope.plaintext.charAt(j);			
				var A= parseInt($scope.keyA);
				var B= parseInt($scope.keyB);

				if(this.char != " "){
					M = this.getPos(this.char);
					parcial = this.z26[((( M * A ) + B) % 26 + 26)%26];
				}
				else{
					parcial = " ";
				}

				if(result != ''){
					result += parcial;
									
				}
				else{
					result = parcial;
				}				
			}

			$scope.result += result;
			$scope.hideParcial = true;

			this.start = false;
			this.end = true;
		}

		this.getPos = function(caracter){
			for(i = 0; i < this.z26.length; i++) {
				if(this.z26[i] == caracter){
					return i;
				}
			}
		}
		
		this.stepCifrado = function(){
			this.char = $scope.plaintext.charAt(this.step);			
			var A= parseInt($scope.keyA);
			var B= parseInt($scope.keyB);

			if(this.char != " "){
				M = this.getPos(this.char);
				$scope.parcial = this.z26[((( M * A ) + B) % 26 + 26)%26];
			}
			else{
				$scope.parcial = " ";
			}

			if($scope.result != ''){
				$scope.result += $scope.parcial;
									
			}
			else{
				$scope.result = $scope.parcial;
			}
			
			this.step++;

			if(this.step >= $scope.plaintext.length){
				this.end = true;
				this.finish();	
				$scope.hideParcial = true;
			}
		}

	});

	app.controller('AfinDecryptCtrl', function($scope, $location) {

		this.z26 = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
		this._withAutoEvaluation = false;
		this.start = false;
		this.step = 0;
		this.end = false;
		this.char = '';
		this.M = 0;
		this.invKeyA = '';
		$scope.keyA = '';
		$scope.keyB = '';
		$scope.plaintext = '';
		$scope.hideParcial = true;
		$scope.hideResult = true;


		this.init = function() {

			$scope.parcial= '';
			$scope.result = '';
			$scope.hideParcial = false;
			$scope.hideResult = false;
			
			this.invKeyA = this.inversoMulti($scope.keyA);

			this.start = true;
			this.step = 0;
			this.end = false;
			this.char = '';
			this.M = 0;

			this.stepDeCifrado();
		}

		this.auto = function(auto) {
			this._withAutoEvaluation = auto;
			this.reset();
		}

		this.reset = function() {
			$scope.keyA = '';
			$scope.keyB = '';
			$scope.plaintext = '';
			$scope.parcial = '';
			$scope.result = '';
			$scope.hideParcial = true;
			$scope.hideResult = true;
		}

		this.next = function() {

			this.stepDeCifrado();
		}

		this.finish = function() {
			var result = '';

			for(j = this.step; j < $scope.plaintext.length; j++ ){
	
				this.char = $scope.plaintext.charAt(j);			
				var A= parseInt($scope.keyA);
				var B= parseInt($scope.keyB);

				if(this.char != " "){
					M = this.getPos(this.char);
					parcial = this.z26[((( M - B ) * this.invKeyA ) % 26 + 26) % 26];
				}
				else{
					parcial = " ";
				}

				if(result != ''){
					result += parcial;
									
				}
				else{
					result = parcial;
				}				
			}

			$scope.result += result;
			$scope.hideParcial = true;

			this.start = false;
			this.end = true;
		}

		this.getPos = function(caracter){
			for(i = 0; i < this.z26.length; i++) {
				if(this.z26[i] == caracter){
					return i;
				}
			}
		}
		
		this.stepDeCifrado = function(){
			this.invKeyA = this.inversoMulti($scope.keyA);

			this.char = $scope.plaintext.charAt(this.step);	
			var B= parseInt($scope.keyB);

			if(this.char != " "){
				M = this.getPos(this.char);
				$scope.parcial = this.z26[((( M - B ) * this.invKeyA ) % 26 + 26) % 26];
			}
			else{
				$scope.parcial = " ";
			}

						console.log("inicio2 " + $scope.result);
			if($scope.result != ''){
				$scope.result += $scope.parcial;
									
			}
			else{
				$scope.result = $scope.parcial;
			}

			this.step++;

			if(this.step >= $scope.plaintext.length){
				this.end = true;
				this.finish();
				$scope.hideParcial = true;
			}
		}

		this.inversoMulti = function(keyA){
			var flag;
			for (i= 0; i < 26; i++){
				flag = ( keyA*i)%26;
				if(flag == 1){
					return i;
				}
			}
		}
	});
});
