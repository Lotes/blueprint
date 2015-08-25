angular
  .module('blueprint')
  .factory('LayoutSize', function() {
    var regex = /^(\*|(\d+)(%|px)?)$/;
    return function(str) {
      if(!regex.test(str))
        throw new Error('This is not a valid layout size!');
      var match = regex.exec(str);
      this.fill = !match[2] && !match[3];
      this.value = parseInt(match[2]);
      this.isPercentage = match[3] === '%';
      //this.isPixel = !match[3] || match[3] === 'px';
      this.compute = function(parentSize, remainingSize) {
        remainingSize = remainingSize || parentSize;
        if(this.fill) return Math.floor(remainingSize);
        if(this.isPercentage) return Math.floor(this.value / 100 * parentSize);
        return Math.floor(this.value);
      };
    };
  });