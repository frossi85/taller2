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


		this.init = function() {
			console.log($scope.keyA);
			console.log($scope.keyB);
			console.log($scope.plaintext);

			$scope.parcial= '';
			$scope.result = '';
			
			this.start = true;
			this.step = 0;
			this.end = false;
			this.char = '';
			this.M = 0;

			this.stepCifrado();
		}

		this.auto = function(auto) {
			console.log("auto");
			this._withAutoEvaluation = auto;
			this.reset();
		}

		this.reset = function() {
			console.log("reset");
			$scope.keyA = '';
			$scope.keyB = '';
			$scope.plaintext = '';
		}

		this.next = function() {

			this.stepCifrado();
		}

		this.finish = function() {
			console.log("finish");
			
			console.log($scope.plaintext.length);
			console.log(this.step);
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

			console.log($scope.plaintext.length);
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
			}

			console.log($scope.result);
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


		this.init = function() {
			console.log($scope.keyA);
			console.log($scope.keyB);
			console.log($scope.plaintext);

			$scope.parcial= '';
			$scope.result = '';
			
			this.invKeyA = this.inversoMulti($scope.keyA);

			this.start = true;
			this.step = 0;
			this.end = false;
			this.char = '';
			this.M = 0;

			this.stepDeCifrado();
		}

		this.auto = function(auto) {
			console.log("auto");
			this._withAutoEvaluation = auto;
			this.reset();
		}

		this.reset = function() {
			console.log("reset");
			$scope.keyA = '';
			$scope.keyB = '';
			$scope.plaintext = '';
		}

		this.next = function() {

			this.stepDeCifrado();
		}

		this.finish = function() {
			console.log("finish");
			
			console.log($scope.plaintext.length);
			console.log(this.step);
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

			console.log($scope.plaintext.length);
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
	
						console.log("inicio " + $scope.result);
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
			}

			console.log($scope.result);
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
