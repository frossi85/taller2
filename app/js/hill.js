define(['angular', 'angular-route', 'angular-animate'], function(angular) {
  var app = angular.module('hill', ['ngAnimate']).constant('HILL_CLAVE', 2);

  app.factory('hillService', function() {
    return {
      toCode: function(string, pos) {
        var chrA = 'a'.charCodeAt(0);
        return string.charCodeAt(pos) - chrA;
      },
      fromCode: function(code) {
        var chrA = 'a'.charCodeAt(0);
        return String.fromCharCode(parseInt(code) + chrA);
      }
    };
  });

  app.directive('hillMultiple', function() {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function(scope, elm, attrs, ctrl) {
        ctrl.$validators.hillMultiple = function(modelValue, viewValue) {
          var valid = true;;
          if (!ctrl.$valid && !ctrl.$error.hillMultiple) {
            return valid;
          }
          if (viewValue.length % scope.clave_length != 0) {
            valid = false;
          }
          ctrl.$setValidity('hillMultiple', valid);
          return valid;
        };
      }
    };
  });

  app.directive('inversible', ['hillService', function(hillService) {
      return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, elm, attrs, ctrl) {
          ctrl.$validators.inversible = function(modelValue, viewValue) {
            var valid = true;;
            if (!ctrl.$valid) {
              return valid;
            }

            var c = 0;
            var clave = [];
            for (var i = 0 ; i < scope.clave_length ; i++) {
              clave[i] = [];
              for (var j = 0 ; j < scope.clave_length ; j++) {
                clave[i][j] = hillService.toCode(viewValue, c++);
              }
            }

            var det = MathUtils.matrix.det(clave);
            if (det == 0) {
              valid = false;
            }
            else {
              var modinv = MathUtils.modinverse(Math.abs(det), 26);
              if (modinv === false) {
                valid = false;
              }
            }

            ctrl.$setValidity('inversible', valid);
            return valid;
          };
        }
      };
    }]);

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


  app.controller('HillEncryptCtrl', function($scope, $routeParams, $location, HILL_CLAVE, hillService) {
    $scope.evaluacion = false;
    $scope.start = false;
    $scope.step = 0;
    $scope.end = false;
    $scope.key = '';
    $scope.plaintext = '';
    $scope.toCode = hillService.toCode;
    $scope.fromCode = hillService.fromCode;
    $scope.math = MathUtils;
    this.plaintext = '';

    $scope.clave_length = HILL_CLAVE;

    if ($routeParams.key) {
      $scope.key = $routeParams.key;
    }

    if ($routeParams.plaintext) {
      $scope.plaintext = $routeParams.plaintext;
    }

    $scope.clave = new Array($scope.clave_length);
    for (var i =0 ; i < $scope.clave.length ; i++) {
      $scope.clave[i] = new Array($scope.clave_length);
    }

    $scope.vector = new Array($scope.clave_length);
    $scope.parcial = new Array($scope.clave_length);
    $scope.cipher = new Array($scope.clave_length);



    this.cloneArray = function(arr) {
      return JSON.parse(JSON.stringify(arr));
    }

    this.clave = this.cloneArray($scope.clave);
    this.vector = this.cloneArray($scope.vector);
    this.parcial = this.cloneArray($scope.parcial);
    this.cipher = this.cloneArray($scope.cipher);

    this.mod = function(vector) {
      var resultado = [];
      for (var i = 0 ; i < vector.length ; i++) {
        resultado[i] = vector[i] % 26;
      }
      return resultado;
    }

    this.mult = function(clave, vector) {
      var resultado = [];
      for (var i = 0 ; i < clave.length ; i++) {
        resultado[i] = 0;
        for (var j = 0 ; j < clave[i].length ; j++) {
          resultado[i] += clave[i][j] * vector[j];
        }
      }
      return resultado;
    }

    this.init = function() {
      $scope.start = true;
      $scope.step = 0;
      $scope.finish = false;
      $scope.result = '';
      $scope.error = false;
      this.result = '';

      var c = 0;
      for (var i = 0 ; i < this.clave.length ; i++) {
        for (var j = 0 ; j < this.clave[i].length ; j++) {
          this.clave[i][j] = $scope.toCode($scope.key, c++);
        }
      }

      if (!$scope.evaluacion) {
        $scope.clave = this.cloneArray(this.clave);
      }

      this.next();
    }

    this.auto = function(auto) {
      $scope.evaluacion = auto;
      this.reset();
    }

    this.reset = function() {
      $scope.finish = false;
      $scope.result = '';
      for (var i = 0 ; i < $scope.clave.length ; i++) {
        $scope.vector[i] = '';
        $scope.parcial[i] = '';
        $scope.cipher[i] = '';
        for (var j = 0 ; j < $scope.clave[i].length ; j++) {
          $scope.clave[i][j] = '';
        }
      }

    }

    this.next = function() {

      var c = 0;
      var subStart = this.vector.length * $scope.step;
      var subEnd = subStart + this.vector.length;

      if ($scope.step && $scope.evaluacion) {
        if ($scope.clave.toString() != this.clave.toString()) {
          $scope.error = "Hay un error con la clave!";
          return;
        }

        if ($scope.vector.toString() != this.vector.toString()) {
          $scope.error = "Hay un error con el vector!";
          return;
        }

        if ($scope.parcial.toString() != this.parcial.toString()) {
          $scope.error = "Hay un error con el resultado parcial!";
          return;
        }

        if ($scope.cipher.toString() != this.cipher.toString()) {
          $scope.error = "Hay un error con el el resultado del módulo 26!";
          return;
        }

        if ($scope.result != this.result) {
          $scope.error = "Hay un error con el el resultado del algoritmo!";
          return;
        }

        $scope.error = false;

        if (subEnd > $scope.plaintext.length) {
          $scope.start = false;
          $scope.finish = true;
          return;
        }

        for (var i = 0 ; i < $scope.vector.length ; i++) {
          $scope.vector[i] = '';
          $scope.parcial[i] = '';
          $scope.cipher[i] = '';
        }

      }

      for (var i = 0 ; i < this.vector.length ; i++) {
        this.vector[i] = $scope.toCode($scope.plaintext.substring(subStart, subEnd), c++);
      }

      this.parcial = this.mult(this.clave, this.vector);
      this.cipher = MathUtils.matrix.mod(this.parcial, 26);

      for (var i = 0 ; i < this.parcial.length ; i++) {
        this.result += $scope.fromCode(this.cipher[i]);
      }

      if (!$scope.evaluacion) {
        $scope.vector = this.vector.slice(0);
        $scope.parcial = this.parcial.slice(0);
        $scope.cipher = this.cipher.slice(0);
        $scope.result = this.result;

        if (subEnd >= $scope.plaintext.length) {
          $scope.start = false;
          $scope.finish = true;
        }
      }

      $scope.step++;
    }

    this.finish = function() {
      if ($scope.evaluacion) {
        this.reset();
        $scope.start = false;
        return;
      }
      while ($scope.start) {
        this.next();
      }
    }
  });

  app.controller('HillDecryptCtrl', function($scope, $routeParams, $location, HILL_CLAVE, hillService) {
    $scope.evaluacion = false;
    $scope.start = false;
    $scope.step = 0;
    $scope.end = false;
    $scope.key = '';
    $scope.plaintext = '';
    $scope.toCode = hillService.toCode;
    $scope.fromCode = hillService.fromCode;
    $scope.math = MathUtils;
    this.plaintext = '';

    $scope.clave_length = HILL_CLAVE;

    if ($routeParams.key) {
      $scope.key = $routeParams.key;
    }

    if ($routeParams.plaintext) {
      $scope.plaintext = $routeParams.plaintext;
    }

    $scope.clave = new Array($scope.clave_length);
    for (var i =0 ; i < $scope.clave.length ; i++) {
      $scope.clave[i] = new Array($scope.clave_length);
    }

    $scope.vector = new Array($scope.clave_length);
    $scope.parcial = new Array($scope.clave_length);
    $scope.cipher = new Array($scope.clave_length);


    this.cloneArray = function(arr) {
      return JSON.parse(JSON.stringify(arr));
    }

    this.clave = this.cloneArray($scope.clave);
    this.vector = this.cloneArray($scope.vector);
    this.parcial = this.cloneArray($scope.parcial);
    this.cipher = this.cloneArray($scope.cipher);

    this.mod = function(vector) {
      var resultado = [];
      for (var i = 0 ; i < vector.length ; i++) {
        resultado[i] = vector[i] % 26;
      }
      return resultado;
    }

    this.mult = function(clave, vector) {
      var resultado = [];
      for (var i = 0 ; i < clave.length ; i++) {
        resultado[i] = 0;
        for (var j = 0 ; j < clave[i].length ; j++) {
          resultado[i] += clave[i][j] * vector[j];
        }
      }
      return resultado;
    }

    this.init = function() {
      $scope.start = true;
      $scope.step = 0;
      $scope.finish = false;
      $scope.result = '';
      $scope.error = false;
      this.result = '';

      var c = 0;
      for (var i = 0 ; i < this.clave.length ; i++) {
        for (var j = 0 ; j < this.clave[i].length ; j++) {
          this.clave[i][j] = $scope.toCode($scope.key, c++);
        }
      }

      adjjoin = MathUtils.matrix.adjjoin(this.clave);
      det = MathUtils.matrix.det(this.clave);
      if (det < 0) {
        det = -det;
        adjjoin = MathUtils.matrix.mult(adjjoin, -1);
      }
      inverse = MathUtils.matrix.mult(adjjoin, MathUtils.modinverse(det,26));
      inverse = MathUtils.matrix.mod(inverse, 26);

      this.clave = inverse;

      if (!$scope.evaluacion) {
        $scope.clave = this.cloneArray(this.clave);
      }

      this.next();
    }

    this.auto = function(auto) {
      $scope.evaluacion = auto;
      this.reset();
    }

    this.reset = function() {
      $scope.finish = false;
      $scope.result = '';
      for (var i = 0 ; i < $scope.clave.length ; i++) {
        $scope.vector[i] = '';
        $scope.parcial[i] = '';
        $scope.cipher[i] = '';
        for (var j = 0 ; j < $scope.clave[i].length ; j++) {
          $scope.clave[i][j] = '';
        }
      }

    }

    this.next = function() {

      var c = 0;
      var subStart = this.vector.length * $scope.step;
      var subEnd = subStart + this.vector.length;

      if ($scope.step && $scope.evaluacion) {
        if ($scope.clave.toString() != this.clave.toString()) {
          $scope.error = "Hay un error con la clave!";
          return;
        }

        if ($scope.vector.toString() != this.vector.toString()) {
          $scope.error = "Hay un error con el vector!";
          return;
        }

        if ($scope.parcial.toString() != this.parcial.toString()) {
          $scope.error = "Hay un error con el resultado parcial!";
          return;
        }

        if ($scope.cipher.toString() != this.cipher.toString()) {
          $scope.error = "Hay un error con el el resultado del módulo 26!";
          return;
        }

        if ($scope.result != this.result) {
          $scope.error = "Hay un error con el el resultado del algoritmo!";
          return;
        }

        $scope.error = false;

        if (subEnd > $scope.plaintext.length) {
          $scope.start = false;
          $scope.finish = true;
          return;
        }

        for (var i = 0 ; i < $scope.vector.length ; i++) {
          $scope.vector[i] = '';
          $scope.parcial[i] = '';
          $scope.cipher[i] = '';
        }

      }

      for (var i = 0 ; i < this.vector.length ; i++) {
        this.vector[i] = $scope.toCode($scope.plaintext.substring(subStart, subEnd), c++);
      }

      this.parcial = this.mult(this.clave, this.vector);
      this.cipher = MathUtils.matrix.mod(this.parcial, 26);

      for (var i = 0 ; i < this.parcial.length ; i++) {
        this.result += $scope.fromCode(this.cipher[i]);
      }

      if (!$scope.evaluacion) {
        $scope.vector = this.vector.slice(0);
        $scope.parcial = this.parcial.slice(0);
        $scope.cipher = this.cipher.slice(0);
        $scope.result = this.result;

        if (subEnd >= $scope.plaintext.length) {
          $scope.start = false;
          $scope.finish = true;
        }
      }

      $scope.step++;
    }

    this.finish = function() {
      if ($scope.evaluacion) {
        this.reset();
        $scope.start = false;
        return;
      }
      while ($scope.start) {
        this.next();
      }
    }

    this.ayudaClave = function() {
      $scope.clave = this.cloneArray(this.clave);
    }
  });
});

