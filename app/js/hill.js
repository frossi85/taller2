define(['angular', 'angular-route'], function(angular) {
	var app = angular.module('hill', []);

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
		this._withAutoEvaluation = false;
		this.step = 0;
		this.end = false;
		$scope.key = '';
		$scope.plaintext = '';

		this.start = function() {
		}

		this.auto = function(auto) {
			this._withAutoEvaluation = auto;
			this.reset();
		}

		this.reset = function() {
			$scope.key = '';
			$scope.plaintext = '';
		}


	});

	app.controller('HillDecryptCtrl', function($scope, $location) {

	});
});

