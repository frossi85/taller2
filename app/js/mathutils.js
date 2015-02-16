var MathUtils = MathUtils || {};

MathUtils = {
  matrix: {
    mult: function(matrix, m) {
      result = [];
      for (var i = 0 ; i < matrix.length ; i++) {
        if (Object.prototype.toString.call( matrix[i] ) === '[object Array]' ) {
          result[i] = [];
          for (var j = 0 ; j < matrix.length ; j++) {
            result[i][j] = matrix[i][j] * m;
          }
        }
        else {
          result[i][j] = matrix[i] * m;
        }
      }
      return result;
    },

    mod: function(matrix, m) {
      result = [];
      for (var i = 0 ; i < matrix.length ; i++) {
        if (Object.prototype.toString.call( matrix[i] ) === '[object Array]' ) {
          result[i] = [];
          for (var j = 0 ; j < matrix.length ; j++) {
            result[i][j] = matrix[i][j] % m;
          }
        }
        else {
          result[i] = MathUtils.mod(matrix[i], m);
        }
      }
      return result;
    },

    det: function(matrix){
      var sum=0;
      var s;
      if(matrix.length==1){
        return(matrix[0][0]);
      }
      if(matrix.length==2){
        return((matrix[0][0]*matrix[1][1])-(matrix[0][1]*matrix[1][0]));
      }
      if(matrix.length==3){
        return((matrix[0][0]*matrix[1][1]*matrix[2][2])+(matrix[0][1]*matrix[1][2]*matrix[2][0])+(matrix[0][2]*matrix[1][0]*matrix[2][1])-(matrix[0][0]*matrix[1][2]*matrix[2][1])-(matrix[0][1]*matrix[1][0]*matrix[2][2])-(matrix[0][2]*matrix[1][1]*matrix[2][0]));
      }

      for(var i=0;i<matrix.length;i++){
        var smaller=new Array(matrix.length-1);
        for(h=0;h<smaller.length;h++){
          smaller[h]=new Array(smaller.length);
        }
        for(a=1;a<matrix.length;a++){
          for(b=0;b<matrix.length;b++){
            if(b<i){
              smaller[a-1][b]=matrix[a][b];
            }
            else if(b>i){
              smaller[a-1][b-1]=matrix[a][b];
            }
          }
        }
        if(i%2==0){
          s=1;
        }
        else{
          s=-1;
        }
        sum+=s*matrix[0][i]*(determinant(smaller));
      }
      return(sum);
    },

    adjjoin: function(matrix) {
      var adjjoin = [];
      //if the matrix isn't square: exit (error)
      if(matrix.length !== matrix[0].length){return;}

      for (var i = 0 ; i < matrix.length ; i++) {
        adjjoin[i] = [];
      }

      for (var i = 0 ; i < matrix.length ; i++) {
        for (var j = 0 ; j < matrix.length ; j++) {
          // Calculo matriz mas chiquita sin fila ni columna
          small = [];
          for (var ii = 0 ; ii < matrix.length ; ii++) {
            if (ii == i) { continue; }
            small_row = [];
            for (var jj = 0 ; jj < matrix.length ; jj++) {
              if (jj == j) { continue; }
              small_row.push(matrix[ii][jj]);
            }
            small.push(small_row);
          }
          // La adjunta es la transpuesta de la cofactor
          adjjoin[j][i] = Math.pow(-1, i+j) * this.det(small);
        }
      }
      return adjjoin;
    }
  },

  modinverse: function(a,m) {
    for(var i = 0 ; i < 26 ; i++ ) {
      if ((a * i ) % m == 1) {
        return i;
      }
    }
    return false;
  },

  // @see http://javascript.about.com/od/problemsolving/a/modulobug.htm
  mod: function(n, m) {
    return ((n%m)+m)%m;
  }
};
