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

  this.shuffle = function() {
    var currentIndex = this.cards.length,
      temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = this.cards[currentIndex];
      this.cards[currentIndex] = this.cards[randomIndex];
      this.cards[randomIndex] = temporaryValue;
    }
    return this.cards;
  };

  // shuffle on init
  this.shuffle();

})();