var HandCalculator = {
  
  rank: function(cards) {
    var rankArr = [];
    for (var i in cards) {
      cards[i].length === 2 ? rankArr.push(Number(cards[i].slice(0,1))) : rankArr.push(Number(cards[i].slice(0,2)));
    }
    return rankArr.sort(function(a, b) {return a > b});
  },
  
  suit: function(cards) {
    var suitArr = [];
    for (var i in cards) {
      cards[i].length === 2 ? suitArr.push(cards[i].slice(1,2)) : suitArr.push(cards[i].slice(2,3));
    }
    return suitArr;
  },

  whichRankOccursNTimes: function(rankArr, n) {
    var desiredRank,
        rankDic = {};
    
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
        console.log(rankArr[i]);
        console.log(this.whichRankOccursNTimes(rankArr, n));
      }
    }
    return kickers;
  }

};