var clone = function (obj) {
  return JSON.parse(JSON.stringify(obj))
}

const initialABTnR = {
  AllowedBetTypes: [],
  PotentialReturns: {
    PerBetType: {},
    PerSelection: {}
  }
}

const initialABTnRperTab = {
  REGULAR: clone(initialABTnR),
  TEASER: {
    BASKETBALL: clone(initialABTnR),
    COLLBB: clone(initialABTnR),
    NFL: clone(initialABTnR),
    COLLFB: clone(initialABTnR),
    MIXED: clone(initialABTnR)
  },
  RR: clone(initialABTnR),
  S1: clone(initialABTnR),
  XP: {
    PerEvent: {},
    BetFairXPBettingProvider: {
      SGP: {
        PerEvent: {}
      }
    }
  }
}

const initialBetTypeStakes = {
  PerSelection: {},
  PerBetType: {},
  PerBetType4T: {},
  PerTab: {},
  totals: {
    REGULAR: 0,
    TEASER: 0,
    RR: 0
  },
  S: '',
  REGULAR: {
    PerSelection: {},
    PerBetType: {}
  },
  TEASER: {
    BASKETBALL: {
      PerSelection: {},
      PerBetType: {}
    },
    COLLBB: {
      PerSelection: {},
      PerBetType: {}
    },
    NFL: {
      PerSelection: {},
      PerBetType: {}
    },
    COLLFB: {
      PerSelection: {},
      PerBetType: {}
    },
    MIXED: {
      PerSelection: {},
      PerBetType: {}
    }
  },
  RR: {
    PerSelection: {},
    PerBetType: {}
  },
  XP: {
    PerEvent: {},
    BetFairXPBettingProvider: {
      SGP: {
        PerEvent: {}
      }
    }
  }
}

const initialReturns = {
  PerSelection: {},
  PerBetType: {},
  PerBetType4T: {},
  PerTab: {},
  S: '',
  REGULAR: {
    PerSelection: {},
    PerBetType: {}
  },
  TEASER: {
    BASKETBALL: {
      PerSelection: {},
      PerBetType: {}
    },
    COLLBB: {
      PerSelection: {},
      PerBetType: {}
    },
    NFL: {
      PerSelection: {},
      PerBetType: {}
    },
    COLLFB: {
      PerSelection: {},
      PerBetType: {}
    },
    MIXED: {
      PerSelection: {},
      PerBetType: {}
    }
  },
  RR: {
    PerSelection: {},
    PerBetType: {}
  },
  XP: {
    PerEvent: {},
    BetFairXPBettingProvider: {
      SGP: {
        PerEvent: {}
      }
    }
  },
  total: {
    PerSelection: {},
    PerBetType: {},
    S: '',
    PARLAY: 0,
    SPARLAY: 0,
    TEASER: 0,
    RR: 0
  }
}

const initialPromotions = {
  PerSelection: {},
  PerBetType: {},
  PerBetType4T: {},
  PerTab: {},
  totals: {
    REGULAR: 0,
    TEASER: 0,
    RR: 0
  },
  S: '',
  REGULAR: {
    PerSelection: {},
    PerBetType: {}
  },
  TEASER: {
    BASKETBALL: {
      PerSelection: {},
      PerBetType: {}
    },
    COLLBB: {
      PerSelection: {},
      PerBetType: {}
    },
    NFL: {
      PerSelection: {},
      PerBetType: {}
    },
    COLLFB: {
      PerSelection: {},
      PerBetType: {}
    },
    MIXED: {
      PerSelection: {},
      PerBetType: {}
    }
  },
  RR: {
    PerSelection: {},
    PerBetType: {}
  },
  XP: {
    PerEvent: {},
    BetFairXPBettingProvider: {
      SGP: {
        PerEvent: {}
      }
    }
  }
}

const initialTeasers = {
  T1: {},
  T2: {},
  T3: {},
  T4: {},
  T5: {}
}

const initialBetSlipChanges = {
  price: [],
  currenthandicap: [],
  upperband: [],
  lowerband: [],
  isclosed: 0,
  istradable: 0,
  closed: [],
  suspended: [],
  NR: [],
  interRelated: 0,
  changeNo: 0
}

const teaserSpreads = {
  NFL: {
    T1: '+ 6',
    T2: '+ 6.5',
    T3: '+ 7',
    T4: '+ 7.5',
    T5: '+ 8'
  },
  BASKETBALL: {
    T1: '+ 4',
    T2: '+ 4.5',
    T3: '+ 5',
    T4: '+ 5.5',
    T5: '+ 6'
  }
}

export default {
  initialABTnR,
  initialABTnRperTab,
  initialBetTypeStakes,
  initialReturns,
  initialPromotions,
  initialTeasers,
  initialBetSlipChanges,
  teaserSpreads
}
