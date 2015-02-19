define(['angular', 'angular-route'], function(angular) {
	var app = angular.module('afin', []);

	app.factory('Data', function () {
		this.keyA;
		this.keyB;
		this.plaintext;
		
  		return this;
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

	app.controller('AfinHomeCtrl', function($scope, $location) {
		this.toEncrypt = function () {
			$location.url('/afin/encrypt');
		};

		this.toDecrypt = function () {
			$location.url('/afin/decrypt');
		};
	});


	app.controller('AfinEncryptCtrl', function($scope, $location, Data) {
		
		this.z26 = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];

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
		$scope.descifrar = false;

		$scope.keyA = Data.keyA;
		$scope.keyB = Data.keyB;
		$scope.plaintext = Data.plaintext;
		$scope.parcialError = false;

		$scope.total = 0;
		$scope.totalError = 0;
		$scope.totalOk = 0;

		$scope.showStatus = false;

		if( typeof(Data._withAutoEvaluation) == 'undefined'){
			this._withAutoEvaluation = false;
		}
		else{
			this._withAutoEvaluation = Data._withAutoEvaluation;
		}
		

		this.init = function() {

			$scope.parcial= '';
			$scope.result = '';
			$scope.hideParcial = false;
			$scope.hideResult = false;
			$scope.descifrar = false;
			$scope.parcialError = false;
		
			this.start = true;
			this.step = 0;
			this.end = false;
			this.char = '';
			this.M = 0;
			$scope.showStatus = false;

			var aux = '';
			for(var i = 0; i < $scope.plaintext.length; i++) {
   				if(aux != ''){
					aux +=$scope.plaintext[i].toLowerCase(); 
				}
    		    		else{
					aux =$scope.plaintext[i].toLowerCase(); 
				}
			}	

			$scope.plaintext = aux;

			if(this._withAutoEvaluation == false){
				this.stepCifrado();
			}
		}

		this.validateKey = function(l1,l2) {
			if(l2 == 0){
     				return l1;
   			}
  			return this.validateKey(l2, l1%l2);
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
			$scope.descifrar = false;
			$scope.parcialError = false;
			$scope.total = 0;
			$scope.totalError = 0;
			$scope.totalOk = 0;
			$scope.showStatus = false;
		}

		this.next = function() {

			if(this._withAutoEvaluation == false){
				this.stepCifrado();
			}
			else{
				this.stepCifradoEval();
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
			$scope.descifrar = true;

			this.start = false;
			this.end = true;
			$scope.showStatus = true;

		}

		this.finishStepEval = function(){
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

			if(($scope.parcial != result) || ($scope.parcial == '' && result != "")){

				temp = $scope.parcial.toString().replace(/\s+/g, '');
				result = result.toString().replace(/\s+/g, '');
				
				if(temp != result){
					$scope.parcialError = true;
					$scope.totalError++;
				}
				else{
					$scope.parcialError = false;
					$scope.result += result;
					$scope.hideParcial = true;
					$scope.descifrar = true;
					this.step = 0;

					this.start = false;
					this.end = true;
					$scope.showStatus = true;
				}
			}
			else{
				$scope.parcialError = false;
				$scope.result += result;
				$scope.hideParcial = true;
				$scope.descifrar = true;
				this.step = 0;

				this.start = false;
				this.end = true;
				$scope.showStatus = true;
			}

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

		this.stepCifradoEval = function(){

			this.char = $scope.plaintext.charAt(this.step);			
			var A= parseInt($scope.keyA);
			var B= parseInt($scope.keyB);

			var parcialCheck = '';
			$scope.total++;

			if(this.char != " "){
				M = this.getPos(this.char);
				parcialCheck = this.z26[((( M * A ) + B) % 26 + 26)%26];
			}
			else{
				parcialCheck = " ";
			}

			if($scope.parcial != parcialCheck){
				$scope.parcialError = true;
				$scope.totalError++;
			}
			else{
				$scope.parcialError = false;			

				if($scope.result != ''){
					$scope.result += parcialCheck;
									
				}
				else{
					$scope.result = parcialCheck;
				}
			
				this.step++;
				
				$scope.parcial = '';

				if(this.step >= $scope.plaintext.length){
					this.end = true;
					this.finish();	
					$scope.hideParcial = true;
					$scope.totalOk = $scope.total - $scope.totalError;
				}
			}
		}			

		this.descifrar = function(){
			$scope.plaintext = $scope.result;
			$scope.parcial = '';
			$scope.result = '';
			$scope.ksa = '';
			$scope.descifrar = false;


			Data.keyA = $scope.keyA;
			Data.keyB = $scope.keyB;
			Data.plaintext = $scope.plaintext;
			Data._withAutoEvaluation = this._withAutoEvaluation;
			$location.url('/afin/decrypt');
		}

	});

	app.controller('AfinDecryptCtrl', function($scope, $location, Data) {

		this.z26 = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
		
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
		$scope.cifrar = false;

		$scope.keyA = Data.keyA;
		$scope.keyB = Data.keyB;
		$scope.plaintext = Data.plaintext;
		
		$scope.parcialError = false;

		$scope.total = 0;
		$scope.totalError = 0;
		$scope.totalOk = 0;

		$scope.showStatus = false;

		if( typeof(Data._withAutoEvaluation) == 'undefined'){
			this._withAutoEvaluation = false;
		}
		else{
			this._withAutoEvaluation = Data._withAutoEvaluation;
		}

		this.init = function() {

			$scope.parcial= '';
			$scope.result = '';
			$scope.hideParcial = false;
			$scope.hideResult = false;
			$scope.cifrar = false;
			$scope.parcialError = false;
		
			this.start = true;
			this.step = 0;
			this.end = false;
			this.char = '';
			this.M = 0;

			$scope.showStatus = false;

			var aux = '';
			for(var i = 0; i < $scope.plaintext.length; i++) {
   				if(aux != ''){
					aux +=$scope.plaintext[i].toLowerCase(); 
				}
    		    		else{
					aux =$scope.plaintext[i].toLowerCase(); 
				}
			}

			if(this._withAutoEvaluation == false){
				this.stepDeCifrado();
			}
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
			$scope.cifrar = false;
			$scope.parcialError = false;
			$scope.total = 0;
			$scope.totalError = 0;
			$scope.totalOk = 0;
			$scope.showStatus = false;
		}

		this.next = function() {

			if(this._withAutoEvaluation == false){
				this.stepDeCifrado();
			}
			else{
				this.stepDeCifradoEval();
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

		this.finishStep = function() {
			var result = '';

			this.invKeyA = this.inversoMulti($scope.keyA);

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
			$scope.cifrar = true;

			this.start = false;
			this.end = true;
			$scope.showStatus = true;
		}

		this.finishStepEval = function() {
			var result = '';
			
			this.invKeyA = this.inversoMulti($scope.keyA);

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

			if(($scope.parcial != result) || ($scope.parcial == '' && result != "")){

				temp = $scope.parcial.toString().replace(/\s+/g, '');
				result = result.toString().replace(/\s+/g, '');
				
				if(temp != result){
					$scope.parcialError = true;
				}
				else{
					$scope.parcialError = false;
					$scope.result += result;
					$scope.hideParcial = true;
					$scope.cifrar = true;
					this.step = 0;

					this.start = false;
					this.end = true;
					$scope.showStatus = true;
				}
			}
			else{
				$scope.parcialError = false;
				$scope.result += result;
				$scope.hideParcial = true;
				$scope.cifrar = true;

				this.start = false;
				this.end = true;
				$scope.showStatus = true;
			}
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

		this.stepDeCifradoEval = function(){

			var parcialCheck = '';
			this.invKeyA = this.inversoMulti($scope.keyA);

			this.char = $scope.plaintext.charAt(this.step);	
			var B= parseInt($scope.keyB);

			if(this.char != " "){
				M = this.getPos(this.char);
				parcialCheck = this.z26[((( M - B ) * this.invKeyA ) % 26 + 26) % 26];
			}
			else{
				parcialCheck = " ";
			}

			if($scope.parcial != parcialCheck){
				$scope.parcialError = true;
				$scope.totalError++;
			}
			else{
				$scope.parcialError = false;			

				if($scope.result != ''){
					$scope.result += parcialCheck;
									
				}
				else{
					$scope.result = parcialCheck;
				}

				this.step++;
		
				$scope.parcial = '';

				if(this.step >= $scope.plaintext.length){
					this.end = true;
					this.finish();
					$scope.hideParcial = true;
					$scope.totalOk = $scope.total - $scope.totalError;
				}
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
			return 0;
		}

		this.cifrar = function(){
			$scope.plaintext = $scope.result;
			$scope.parcial = '';
			$scope.result = '';
			$scope.ksa = '';
			$scope.descifrar = false;


			Data.keyA = $scope.keyA;
			Data.keyB = $scope.keyB;
			Data.plaintext = $scope.plaintext;
			Data._withAutoEvaluation = this._withAutoEvaluation;
			$location.url('/afin/encrypt');
		}
	});
});
