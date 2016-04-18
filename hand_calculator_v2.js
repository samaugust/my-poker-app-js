var HandCalculator = (function () {

  //////////////////////////////////////////////////////////////////////
  /////////////////////////HELPER METHODS///////////////////////////////
  //////////////////////////////////////////////////////////////////////

  
  var rank = function(cards) {
    
    var rankArr = [];
    
    for (var i in cards) {
      cards[i].length === 2 ? rankArr.push(Number(cards[i].slice(0,1))) : rankArr.push(Number(cards[i].slice(0,2)));
    }
    return rankArr.sort(function(a,b){return a > b});
  };
  
  var suit = function(cards) {
    
    var suitArr = [];
    
    for (var i in cards) {
      cards[i].length === 2 ? suitArr.push(cards[i].slice(1,2)) : suitArr.push(cards[i].slice(2,3));
    }
    return suitArr;
  };
  
  var shuffle = function(cards) {
    return cards.sort(function(){
      return 0.5 - Math.random();
    });
  };
  
  var flatten = function(arr) {
    return arr.reduce(function(current, next) {
      return current.concat(next);
    });
  };
  
  var unique = function(arr) {
    var hash = {}, result = [];
    for (var i = 0, l = arr.length; i < l; ++i) {
      if (!hash.hasOwnProperty(arr[i])) {
        hash[arr[i]] = true;
        result.push(arr[i]);
      }
    }
    return result;
  };

  var whichRankOccursNTimes = function(rankArr, n) {
    
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
  };
  
  var isolateKickers = function(rankArr, n) {
    
    var kickers = [];
  
    for (let i in rankArr) {
      if (rankArr[i] !== whichRankOccursNTimes(rankArr, n)) {
        kickers.push(rankArr[i]);
      }
    }
    return kickers;
  };
  
  var assessKickers = function(hands, cardIndex, n) {
    
    var bestHand = [], kickerMax = 0;
    
    for (let i in hands) {
      let uniqueRanks = isolateKickers(rank(hands[i]), n);  
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
      return assessKickers(hands, cardIndex, n);
    }
    return bestHand;
  };
  
  var deduceBestHand = function(arr, bestHand, hands, bestHandScore) {
    
    arr.reduce(function(maxVal, val, i) {
      if (val > maxVal) {
        if (bestHandScore !== undefined) {
          bestHandScore = val;
        }
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
    if (bestHandScore !== undefined) {
      return [bestHand, bestHandScore];
    }
    else {
      return bestHand;
    }
  };

  var allHandsFromCards = function(cards) {
    
    var allHands = [];
    
    if (cards.length === 6) {
      while (allHands.length !== 6) {
        cards = shuffle(cards);
        let randomHand = cards.slice(0,5);
        allHands.push(randomHand.sort());
        allHands = unique(allHands);
      }
      return allHands;
    }

    else if (cards.length === 7) {
      while (allHands.length !== 21) {
        cards = shuffle(cards);
        let randomHand = cards.slice(0,5);
        allHands.push(randomHand.sort());
        allHands = unique(allHands);
      }
      return allHands;
    }

    else {
      return [cards];
    }
  };

  
  //////////////////////////////////////////////////////////////////////
  ////////////////////HAND STRENGTH METHODS/////////////////////////////
  //////////////////////////////////////////////////////////////////////
  

  var straightFlush = function(cards) {
  
    var s = suit(cards), r = rank(cards);
  
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
  };

  var quads = function(cards) {
    
    var r = rank(cards);
    
    if ((r[0] == r[1] && r[1] == r[2] && r[2] == r[3]) || (r[1] == r[2] && r[2] == r[3] && r[3] == r[4])) {
      return true;
    }
    else {
      return false;
    }
  };
  
  var fullHouse = function(cards) {
    
    var r = rank(cards);
    
    if (((r[0] == r[1] && r[1] == r[2]) && r[3] == r[4]) || (r[0] == r[1] && (r[2] == r[3] && r[3] == r[4]))) {
      return true;
    }
    else {
      return false;
    }
  };
  
  var flush = function(cards) {
    
    var s = suit(cards);
    
    if (s[0] == s[1] && s[1] == s[2] && s[2] == s[3] && s[3] == s[4]) {
      return true;
    }
    else {
      return false;
    }
  };

  var straight = function(cards) {
    
    var r = rank(cards);
    
    if (r[4] - r[3] == 1 && r[3] - r[2] == 1 && r[2] - r[1] == 1 && r[1] - r[0] == 1) {
      return true;
    }
    else if (r[3] - r[2] == 1 && r[2] - r[1] == 1 && r[1] - r[0] == 1 && r[4] - r[0] == 12 && r[4] == 14) {
      return true;
    }
    else {
      return false;
    }
  };
  
  var trips = function(cards) {
    
    var r = rank(cards);
    
    if ((r[0] == r[1] && r[1] == r[2]) || (r[1] == r[2] && r[2] == r[3]) || (r[2] == r[3] && r[3] == r[4])) {
      return true;
    }
    else {
      return false;
    }
  };
  
  var twoPair = function(cards) {
    
    var r = rank(cards);
    
    if ((r[0] == r[1] && r[2] == r[3]) || (r[1] == r[2] && r[3] == r[4]) || (r[0] == r[1] && r[3] == r[4])) {
      return true;
    }
    else {
      return false;
    }
  };
  
  var pair = function(cards) {
    
    var r = rank(cards);
    
    if (r[0] == r[1] || r[1] == r[2] || r[2] == r[3] || r[3] == r[4]) {
      return true;
    }
    else {
      return false;
    }   
  };
  
  
  //////////////////////////////////////////////////////////////////////
  /////////////////////TIE-BREAKER METHODS//////////////////////////////
  //////////////////////////////////////////////////////////////////////
  
  
  var bestQuads = function(hands) {
    
    var bestHand = [], rankArrs = hands.map(rank);
    
    var quadCards = rankArrs.map(function(hand){
      return whichRankOccursNTimes(hand, 4);
    });
    
    bestHand = deduceBestHand(quadCards, bestHand, hands);
    
    if (bestHand.length === 1) {
      return bestHand;
    }
    else {
      return assessKickers(bestHand, 0, 4);
    }
  };
  
  var bestFullHouse = function(hands) {
  
    var bestHand = [], rankArrs = hands.map(rank);
    
    var tripCards = rankArrs.map(function(hand){
      return whichRankOccursNTimes(hand, 3);
    });
    
    var pairCards = rankArrs.map(function(hand){
      return whichRankOccursNTimes(hand, 2);
    });
    
    bestHand = deduceBestHand(tripCards, bestHand, hands);
    
    if (bestHand.length > 1) {
      bestHand = deduceBestHand(pairCards, bestHand, hands);
      return bestHand;
    }
    else {
      return bestHand;
    }
  };
  
  var bestFlush = function(hands) {
    return assessKickers(hands, 4, 2);
  };
  
  var bestStraight = function(hands) {
    
    var bestHand = [], rankArrs = hands.map(rank);
    
    var totalsArr = rankArrs.map(function(rankArr){
      if (rankArr[4] == 14) {
        rankArr[4] = 1;
      }
      return rankArr.reduce(function(rankValueSum, cardRankValue) {
        return rankValueSum + cardRankValue;
      });
    });

    bestHand = deduceBestHand(totalsArr, bestHand, hands);
    return bestHand;
  };
  
  var bestTrips = function(hands) {
    
    var bestHand = [], rankArrs = hands.map(rank);
    
    var tripCards = rankArrs.map(function(hand){
      return whichRankOccursNTimes(hand, 3);
    });
    
    bestHand = deduceBestHand(tripCards, bestHand, hands);
    
    if (bestHand.length > 1) {
      return assessKickers(bestHand, 1, 3);
    }
    else {
      return bestHand;
    }
  };
  
  var bestTwoPair = function(hands) {
    
    var bestHand = [], rankArrs = hands.map(rank);
    
    var topPairs = rankArrs.map(function(rankArr) {
      return Math.max.apply(Math, whichRankOccursNTimes(rankArr, 2));
    });
    var bottomPairs = rankArrs.map(function(rankArr){
      return Math.min.apply(Math, whichRankOccursNTimes(rankArr, 2));
    });
    var kickers = rankArrs.map(function(rankArr) {
      return whichRankOccursNTimes(rankArr, 1);
    });
    
    bestHand = deduceBestHand(topPairs, bestHand, hands);
    
    if (bestHand.length > 1) {
      bestHand = deduceBestHand(bottomPairs, bestHand, hands);
      
      if (bestHand.length > 1) {
        bestHand = deduceBestHand(kickers, bestHand, hands);
        return bestHand;
      }
      else {
        return bestHand;
      }
    }
    else {
      return bestHand;
    }
  };
  
  var bestPair = function(hands) {
    
    var bestHand = [], ranksArr = hands.map(rank);
    
    var pairCards = ranksArr.map(function(rankArr) {
      return whichRankOccursNTimes(rankArr, 2);
    });
    
    bestHand = deduceBestHand(pairCards, bestHand, hands);
    
    if (bestHand.length > 1) {
      return assessKickers(bestHand, 2, 2);
    }
    else {
      return bestHand;
    }
  };
  
  var bestAir = function(hands) {
    return assessKickers(hands, 4, 1);
  };
  
  //////////////////////////////////////////////////////////////////////
  ////////////////////////MASTER METHODS////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  
  
  var evaluateHand = function(hand) {
    
    if (straightFlush(hand) === "royal flush") {
      return 9;
    }
    else if (straightFlush(hand)) {
      return 8;
    }
    else if (quads(hand)) {
      return 7;
    }
    else if (fullHouse(hand)) {
      return 6;
    }
    else if (flush(hand)) {
      return 5;
    }
    else if (straight(hand)) {
      return 4;
    }
    else if (trips(hand)) {
      return 3;
    }
    else if (twoPair(hand)) {
      return 2;
    }
    else if (pair(hand)) {
      return 1;
    }
    else {
      return 0;
    }
  };
  
  var theBestHand = function(hands) {
    
    var bestHand = [], handValues = hands.map(evaluateHand), bestHandScore = 0;
    
    bestHand = deduceBestHand(handValues, bestHand, hands, bestHandScore)[0];
    bestHandScore = deduceBestHand(handValues, bestHand, hands, bestHandScore)[1];
    
    if (bestHandScore === 9) {
      return bestHand;
    }
    
    var tieBreakerMethodsArr = [bestAir, bestPair, bestTwoPair, bestTrips, bestStraight, bestFlush,
      bestFullHouse, bestQuads, bestStraight];
    
    if (bestHand.length > 1) {
      return tieBreakerMethodsArr[bestHandScore](bestHand);
    }
    else {
      return bestHand;
    }
  };

  var winningHandLabel = function(hand) {
    
    hand = hand.length == 1 ? flatten(hand) : hand[0];
    
    if (straightFlush(hand) === "royal flush") {
      return "ROYAL FLUSH!!!!!!";
    }
    else if (straightFlush(hand) === true) {
      return "STRAIGHT FLUSH!!!!!";
    }
    else if (quads(hand) === true) {
      return "FOUR OF A KIND!!!!";
    }
    else if (fullHouse(hand) === true) {
      return "FULL HOUSE!!!";
    }
    else if (flush(hand) === true) {
      return "FLUSH!!!";
    }
    else if (straight(hand) === true) {
      return "STRAIGHT!!!";
    }
    else if (trips(hand) === true) {
      return "THREE OF A KIND!!";
    }
    else if (twoPair(hand) === true) {
      return "TWO PAIR!!";
    }
    else if (pair(hand) === true) {
      return "PAIR!";
    }
    else {
      return "COMPLETE AIR";
    }
  };

  return {
    theBestHand : theBestHand,
    winningHandLabel : winningHandLabel
  };

})();

// console.log(HandCalculator.theBestHand([["9a","10b","3a","6c","7a"],["10a","9b","4a","7c","6a"],["10a","9b","2a","6c","7a"]]));
// console.log(HandCalculator.winningHandLabel(["2a","4b","9a","11a","10a"]));
// console.log(HandCalculator.theBestHand([["9a","10b","3a","6c","7a"],["10a","9b","4a","7c","6a"],["10a","9b","2a","6c","7a"]]));
// console.log(HandCalculator.theBestHand([["9a","9b","4a","6c","7a"],["8a","8b","4a","6c","5a"],["9a","9b","5a","6c","7a"]]));
// console.log(HandCalculator.theBestHand([["6a","6b","3a","4c","4a"],["5a","5b","3a","6c","6a"],["6a","6b","4a","5c","5a"]]));
// console.log(HandCalculator.theBestHand([["6a","6b","3a","6c","4a"],["5a","5b","3a","5c","6a"],["6a","6b","4a","6c","2a"]]));
// console.log(HandCalculator.theBestHand([["6a","3a","2a","5a","4a"],["5a","4a","3a","7a","6a"],["14a","4a","3a","5a","2a"]]));
// console.log(HandCalculator.theBestHand([["3a","6a","9a","10a","14a"],["2a","6a","9a","10a","14a"]]));
// console.log(HandCalculator.theBestHand([["3a","3b","3c","2a","2c"],["3a","4b","4c","3c","3c"]]));
// console.log(HandCalculator.theBestHand([["13a","13b","13c","13d","2a"],["13a","13b","13c","13d","3a"]]));