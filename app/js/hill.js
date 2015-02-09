define(['angular', 'angular-route', 'angular-animate'], function(angular) {
	var app = angular.module('hill', ['ngAnimate']);

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
		this.start = false;
		this.step = 0;
		this.end = false;
		$scope.key = '';
		$scope.plaintext = '';

		this.init = function() {
			this.start = true;
			this.step = 0;
			this.end = false;

			var chrA = 'a'.charCodeAt(0);
			$scope.hill = { clave: {} };
			for (i in $scope.key) {
				$scope.hill.clave['a'+i] = $scope.key.charCodeAt(i) -  chrA;
			}
		}

		this.auto = function(auto) {
			this._withAutoEvaluation = auto;
			this.reset();
		}

		this.reset = function() {
			$scope.key = '';
			$scope.plaintext = '';
		}

		this.next = function() {
			this.step++;
		}

		this.finish = function() {
			this.start = false;
			this.end = true;
		}

	});

	app.controller('HillDecryptCtrl', function($scope, $location) {

	});
});

