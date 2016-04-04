var HandCalculator = {

  
  //////////////////////////////////////////////////////////////////////
  /////////////////////////HELPER METHODS///////////////////////////////
  //////////////////////////////////////////////////////////////////////

  
  rank: function(cards) {
    
    var rankArr = [];
    
    for (var i in cards) {
      cards[i].length === 2 ? rankArr.push(Number(cards[i].slice(0,1))) : rankArr.push(Number(cards[i].slice(0,2)));
    }
    return rankArr.sort(function(a,b){return a > b});
  },
  
  suit: function(cards) {
    
    var suitArr = [];
    
    for (var i in cards) {
      cards[i].length === 2 ? suitArr.push(cards[i].slice(1,2)) : suitArr.push(cards[i].slice(2,3));
    }
    return suitArr;
  },
  
  shuffle: function(cards) {
    return cards.sort(function(){
      return 0.5 - Math.random();
    });
  },
  
  unique: function(arr) {
    var hash = {}, result = [];
    for (var i = 0, l = arr.length; i < l; ++i) {
      if (!hash.hasOwnProperty(arr[i])) {
        hash[arr[i]] = true;
        result.push(arr[i]);
      }
    }
    return result;
  },

  whichRankOccursNTimes: function(rankArr, n) {
    
    var rankDic = {}, desiredRank;
    
    for (let i in rankArr) {
      if (rankArr[i] in rankDic) {
        rankDic[rankArr[i]] += 1;
      }
      else {
        rankDic[rankArr[i]] = 1;
      }
    }
    
    for (let key in rankDic) {
      if (rankDic[key] === n) {
        desiredRank = Number(key);
      }
    }
    return desiredRank;
    
  },
  
  isolateKickers: function(rankArr, n) {
    
    var kickers = [];
  
    for (let i in rankArr) {
      if (rankArr[i] !== this.whichRankOccursNTimes(rankArr, n)) {
        kickers.push(rankArr[i]);
      }
    }
    return kickers;
  },
  
  assessKickers: function(hands, cardIndex, n) {
    
    var bestHand = [], kickerMax = 0;
    
    for (let i in hands) {
      nonPairCards = this.isolateKickers(this.rank(hands[i]), n);
      if (nonPairCards[cardIndex] > kickerMax) {
        kickerMax = nonPairCards[cardIndex];
        bestHand = hands[i];
      }
      else if (nonPairCards[cardIndex] === kickerMax) {
        bestHand.push(hands[i]);
      }
    }
    while (bestHand.length !== 1 && cardIndex !== 0) {
      cardIndex--;
      return this.assessKickers(hands, cardIndex, n);
    }
    return bestHand;
  },

  allHandsFromCards: function(cards) {
    
    var allHands = [];
    
    if (cards.length === 6) {
      while (allHands.length !== 6) {
        cards = this.shuffle(cards);
        let randomHand = cards.slice(0,5);
        allHands.push(randomHand.sort());
        allHands = this.unique(allHands);
      }
      return allHands;
    }

    else if (cards.length === 7) {
      while (allHands.length !== 21) {
        cards = this.shuffle(cards);
        let randomHand = cards.slice(0,5);
        allHands.push(randomHand.sort());
        allHands = this.unique(allHands);
      }
      return allHands;
    }

    else {
      return [cards];
    }
  },

  
  //////////////////////////////////////////////////////////////////////
  ////////////////////HAND STRENGTH METHODS/////////////////////////////
  //////////////////////////////////////////////////////////////////////
  

  straightFlush: function(cards) {
  
    var s = this.suit(cards), r = this.rank(cards);
  
    if (s[0] == s[1] && s[1] == s[2] && s[2] == s[3] && s[3] == s[4]) {
    
      if (r[4] - r[3] == 1 && r[3] - r[2] == 1 && r[2] - r[1] == 1 && r[1] - r[0] == 1 &&  r[3] == 13) {
        return "royal flush";
      }
      else if (r[4] - r[3] == 1 && r[3] - r[2] == 1 && r[2] - r[1] == 1 && r[1] - r[0] == 1) {
        return true;
      }
      else if (r[3] - r[2] == 1 && r[2] - r[1] == 1 && r[1] - r[0] == 1 && r[4] - r[0] == 12 && r[4] == 14) {
        return true;
      }
      else {
        return false;
      }
    }
  
    else {
      return false;
    }
  },

  quads: function(cards) {
    
    var r = this.rank(cards);
    
    if ((r[0] == r[1] && r[1] == r[2] && r[2] == r[3]) || (r[1] == r[2] && r[2] == r[3] && r[3] == r[4])) {
      return true;
    }
    else {
      return false;
    }
  },
  
  fullHouse: function(cards) {
    
    var r = this.rank(cards);
    
    if (((r[0] == r[1] && r[1] == r[2]) && r[3] == r[4]) || (r[0] == r[1] && (r[2] == r[3] && r[3] == r[4]))) {
      return true;
    }
    else {
      return false;
    }
  },
  
  flush: function(cards) {
    
    var s = this.suit(cards);
    
    if (s[0] == s[1] && s[1] == s[2] && s[2] == s[3] && s[3] == s[4]) {
      return true;
    }
    else {
      return false;
    }
  },

  straight: function(cards) {
    
    var r = this.rank(cards);
    
    if (r[4] - r[3] == 1 && r[3] - r[2] == 1 && r[2] - r[1] == 1 && r[1] - r[0] == 1) {
      return true;
    }
    else if (r[3] - r[2] == 1 && r[2] - r[1] == 1 && r[1] - r[0] == 1 && r[4] - r[0] == 12 && r[4] == 14) {
      return true;
    }
    else {
      return false;
    }
  },
  
  trips: function(cards) {
    
    var r = this.rank(cards);
    
    if ((r[0] == r[1] && r[1] == r[2]) || (r[1] == r[2] && r[2] == r[3]) || (r[2] == r[3] && r[3] == r[4])) {
      return true;
    }
    else {
      return false;
    }
  },
  
  twoPair: function(cards) {
    
    var r = this.rank(cards);
    
    if ((r[0] == r[1] && r[2] == r[3]) || (r[1] == r[2] && r[3] == r[4]) || (r[0] == r[1] && r[3] == r[4])) {
      return true;
    }
    else {
      return false;
    }
  },
  
  pair: function(cards) {
    
  },
  
};

// console.log(HandCalculator.pair(["4a","5b","5a","2a","3c"]));
// console.log(HandCalculator.twoPair(["4a","4b","3a","2a","3c"]));
// console.log(HandCalculator.trips(["4c","3b","3a","5a","3c"]));
// console.log(HandCalculator.straight(["14c","2a","4a","5a","3c"]));
// console.log(HandCalculator.flush(["13a","12a","11a","2a","3a"]));
// console.log(HandCalculator.fullHouse(["13a","13b","14c","14d","14a"]));
// console.log(HandCalculator.quads(["13a","13b","13c","13d","14a"]));
// console.log(HandCalculator.straightFlush(["14a","13a","11a","12a","10a"]));
// console.log(HandCalculator.allHandsFromCards(["5a","4b","7c","8d","12c","14b"]));
// console.log(HandCalculator.assessKickers([["12a","14b","2d","5c","5d"],["12a","14b","3d","5c","5d"]], 2, 2));