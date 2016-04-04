var deck = new(function() {

  var ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"];
  var suits = ["a", "b", "c", "d"];

  var flatten = function(arr) {
    return arr.reduce(function(current, next) {
      return current.concat(next);
    });
  };

  // Public properties

  this.cards = flatten(ranks.map(function(rank) {
    return suits.map(function(suit) {
      return rank + suit;
    });
  }));

  this.shuffle = function(cards) {
    return cards.sort(function() {
      return 0.5 - Math.random();
    });
  }
  
  // shuffle on init
  this.shuffle();

})();