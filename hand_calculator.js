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
  
  flatten: function(arr) {
    return arr.reduce(function(current, next) {
      return current.concat(next);
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
    
    var rankDic = {}, desiredRank = [];
    
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
        desiredRank.push(Number(key));
      }
    }
    return desiredRank.length === 1 ? desiredRank[0] : desiredRank;
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
      let uniqueRanks = this.isolateKickers(this.rank(hands[i]), n);  
      if (uniqueRanks[cardIndex] > kickerMax) {
        kickerMax = uniqueRanks[cardIndex];
        bestHand = [hands[i]];
      }
      else if (uniqueRanks[cardIndex] === kickerMax) {
        bestHand.push(hands[i]);
      }
    }
    
    while (bestHand.length > 1 && cardIndex > 0) {
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
    
    var r = this.rank(cards);
    
    if (r[0] == r[1] || r[1] == r[2] || r[2] == r[3] || r[3] == r[4]) {
      return true;
    }
    else {
      return false;
    }   
  },
  
  
  //////////////////////////////////////////////////////////////////////
  /////////////////////TIE-BREAKER METHODS//////////////////////////////
  //////////////////////////////////////////////////////////////////////
  
  
  bestQuads: function(hands) {
    var bestHand = [], highestRank = 0;
    for (let i in hands) {
      if (this.whichRankOccursNTimes(this.rank(hands[i]), 4) > highestRank) {
        bestHand = [hands[i]];
        highestRank = this.whichRankOccursNTimes(this.rank(hands[i]), 4);
      }
      else if (this.whichRankOccursNTimes(this.rank(hands[i]), 4) === highestRank) {
        bestHand.push(hands[i]);      
      }
    }
    if (bestHand.length === 1) {
      return bestHand;
    }
    else {
      return this.assessKickers(bestHand, 0, 4);
    }
  },
  
  bestFullHouse: function(hands) {
  
    var bestHand = [], bestestHand = [], highestRank = 0;
  
    for (let i in hands) {
      let handRankArr = this.rank(hands[i]);
    
      if (this.whichRankOccursNTimes(handRankArr, 3) > highestRank) {
        bestHand = [hands[i]];
        highestRank = this.whichRankOccursNTimes(handRankArr, 3);
      }
      else if (this.whichRankOccursNTimes(handRankArr, 3) === highestRank) {
        bestHand.push(hands[i]);
      }
    }
  
    if (bestHand.length > 1) {
    
      highestRank = 0;
    
      for (let i in bestHand) {
        let handRankArr = this.rank(bestHand[i]);
      
        if (this.whichRankOccursNTimes(handRankArr, 2) > highestRank) {
          bestestHand = [bestHand[i]];
          highestRank = this.whichRankOccursNTimes(handRankArr, 2);
        }
        else if (this.whichRankOccursNTimes(handRankArr, 2) === highestRank) {
          bestestHand.push(bestHand[i]);
        }
      }
      return bestestHand;
    }
    else {
      return bestHand;
    }
  },
  
  bestFlush: function(hands) {
    return this.assessKickers(hands, 4, 2);
  },
  
  bestStraight: function(hands) {
    
    var bestHand = [], rankArrs = hands.map(this.rank);
    
    var totalsArr = rankArrs.map(function(rankArr){
      if (rankArr[4] == 14) {
        rankArr[4] = 1;
      }
      return rankArr.reduce(function(rankValueSum, cardRankValue) {
        return rankValueSum + cardRankValue;
      });
    });

    totalsArr.reduce(function(maxVal, val, i) {
      if (val > maxVal) {
        bestHand = [hands[i]];
        return val;
      }
      else if (val === maxVal) {
        bestHand.push(hands[i]);
        return val;
      }
      else {
        return maxVal;
      }
    }, 0);
    return bestHand;
  },
  
  bestTrips: function(hands) {
    
    var func = this.whichRankOccursNTimes, bestHand = [], rankArrs = hands.map(this.rank);
    
    var tripCards = rankArrs.map(function(hand){
      return func(hand, 3);
    });
    
    tripCards.reduce(function(maxVal, val, i) {
      if (val > maxVal) {
        bestHand = [hands[i]];
        return val;
      }
      else if (val === maxVal) {
        bestHand.push(hands[i]);
        return val;
      }
      else {
        return maxVal;
      }
    }, 0);
    
    if (bestHand.length > 1) {
      return this.assessKickers(bestHand, 1, 3);
    }
    else {
      return bestHand;
    }
  },
  
  bestTwoPair: function(hands) {
    
    var bestHand = [], rankArrs = hands.map(this.rank), func = this.whichRankOccursNTimes;
    var topPairs = rankArrs.map(function(rankArr) {
      return Math.max.apply(Math, func(rankArr, 2));
    });
    var bottomPairs = rankArrs.map(function(rankArr){
      return Math.min.apply(Math, func(rankArr, 2));
    });
    var kickers = rankArrs.map(function(rankArr) {
      return func(rankArr, 1);
    });
    
    var deduceBestHand = function(arr) {
      arr.reduce(function(maxVal, val, i) {
        if (val > maxVal) {
          bestHand = [hands[i]];
          return val;
        }
        else if (val === maxVal) {
          bestHand.push(hands[i]);
          return val;
        }
        else {
          return maxVal;
        }
      }, 0);      
    };
    
    deduceBestHand(topPairs);
    
    if (bestHand.length > 1) {
      deduceBestHand(bottomPairs);
      
      if (bestHand.length > 1) {
        deduceBestHand(kickers);
        return bestHand;
      }
      else {
        return bestHand;
      }
    }
    else {
      return bestHand;
    }
  },
  
  bestPair: function(hands) {
    
    var bestHand = [], ranksArr = hands.map(this.rank), func = this.whichRankOccursNTimes;
    var pairRanksArr = ranksArr.map(function(rankArr) {
      return func(rankArr, 2);
    });
    
    pairRanksArr.reduce(function(maxVal, val, i) {
      if (val > maxVal) {
        bestHand = [hands[i]];
        return val;
      }
      else if (val == maxVal) {
        bestHand.push(hands[i]);
        return val;
      }
      else {
        return maxVal;
      }
    }, 0);
    
    if (bestHand.length > 1) {
      return this.assessKickers(bestHand, 2, 2);
    }
    else {
      return bestHand;
    }
  },
  
  bestAir: function(hands) {
    return this.assessKickers(hands, 4, 1);
  },
  
  //////////////////////////////////////////////////////////////////////
  ////////////////////////MASTER METHODS////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  
  
  winningHand: function(hand) {
    
    hand = hand.length == 1 ? this.flatten(hand) : hand[0];
    
    if (this.straightFlush(hand) === "royal flush") {
      return "ROYAL FLUSH!!!!!!";
    }
    else if (this.straightFlush(hand) === true) {
      return "STRAIGHT FLUSH!!!!!";
    }
    else if (this.quads(hand) === true) {
      return "FOUR OF A KIND!!!!";
    }
    else if (this.fullHouse(hand) === true) {
      return "FULL HOUSE!!!";
    }
    else if (this.flush(hand) === true) {
      return "FLUSH!!!";
    }
    else if (this.straight(hand) === true) {
      return "STRAIGHT!!!";
    }
    else if (this.trips(hand) === true) {
      return "THREE OF A KIND!!";
    }
    else if (this.twoPair(hand) === true) {
      return "TWO PAIR!!";
    }
    else if (this.pair(hand) === true) {
      return "PAIR!";
    }
    else {
      return "COMPLETE AIR";
    }
  },
  
  evaluateHand: function(hand) {
    
    if (HandCalculator.straightFlush(hand) === "royal flush") {
      return 10;
    }
    else if (HandCalculator.straightFlush(hand) === true) {
      return 9;
    }
    else if (HandCalculator.quads(hand) === true) {
      return 8;
    }
    else if (HandCalculator.fullHouse(hand) === true) {
      return 7;
    }
    else if (HandCalculator.flush(hand) === true) {
      return 6;
    }
    else if (HandCalculator.straight(hand) === true) {
      return 5;
    }
    else if (HandCalculator.trips(hand) === true) {
      return 5;
    }
    else if (HandCalculator.twoPair(hand) === true) {
      return 3;
    }
    else if (HandCalculator.pair(hand) === true) {
      return 2;
    }
    else {
      return 1;
    }
  },
  
  bestHand: function(hands) {
    
    var bestHand = [], handValues = hands.map(this.evaluateHand), bestHandScore;
    
    handValues.reduce(function(maxVal, val, i) {
      if (val > maxVal) {
        bestHand = [hands[i]];
        bestHandScore = val;
        return val;
      }
      else if (val === maxVal) {
        bestHand.push(hands[i]);
        return val;
      }
      else {
        return maxVal;
      }
    }, 0);
    
    if (bestHand.length > 1) {
      
      if (bestHandScore === 1) {
        return this.bestAir(bestHand);
      }
      else if (bestHandScore === 2) {
        return this.bestPair(bestHand);
      }
      else if (bestHandScore === 3) {
        return this.bestTwoPair(bestHand);
      }
      else if (bestHandScore === 4) {
        return this.bestTrips(bestHand);
      }
      else if (bestHandScore === 5 || bestHandScore === 9) {
        return this.bestStraight(bestHand);
      }
      else if (bestHandScore === 6) {
        return this.bestFlush(bestHand);
      }
      else if (bestHandScore === 7) {
        return this.bestFullHouse(bestHand);
      }
      else if (bestHandScore === 8) {
        return this.bestQuads(bestHand);
      }
      else {
        return bestHand;
      }
    }
    else {
      return bestHand;
    }
  }

};
// console.log(HandCalculator.winningHand(HandCalculator.bestHand([["6a","6b","3a","4c","4a"],["5a","5b","3a","6c","6a"],["6a","6b","4a","5c","5a"]])));
// console.log(HandCalculator.winningHand(["2a","4b","9a","11a","10a"]));
// console.log(HandCalculator.bestAir([["9a","10b","3a","6c","7a"],["10a","9b","4a","7c","6a"],["10a","9b","2a","6c","7a"]]));
// console.log(HandCalculator.bestPair([["9a","9b","4a","6c","7a"],["8a","8b","4a","6c","5a"],["9a","9b","5a","6c","7a"]]));
// console.log(HandCalculator.bestTwoPair([["6a","6b","3a","4c","4a"],["5a","5b","3a","6c","6a"],["6a","6b","4a","5c","5a"]]));
// console.log(HandCalculator.bestTrips([["6a","6b","3a","6c","4a"],["5a","5b","3a","5c","6a"],["6a","6b","4a","6c","2a"]]));
// console.log(HandCalculator.bestStraight([["6a","3a","2a","5a","4a"],["5a","4a","3a","7a","6a"],["14a","4a","3a","5a","2a"]]));
// console.log(HandCalculator.bestFlush([["3a","6a","9a","10a","14a"],["2a","6a","9a","10a","14a"]]));
// console.log(HandCalculator.bestFullHouse([["3a","3b","3c","2a","2c"],["3a","4b","4c","3c","3c"]]));
// console.log(HandCalculator.bestQuads([["13a","13b","13c","13d","2a"],["13a","13b","13c","13d","3a"]]));
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