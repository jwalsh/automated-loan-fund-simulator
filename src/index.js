// Revolving Loan Fund
// Automated Legal Entity
// Nomenclature follows Savings Circles
// Nomenclature reflects Revolving Loan Funds
// http://energy.gov/eere/slsc/revolving-loan-funds

var stoch = require('@jwalsh/stochastic');
var faker = require('faker');

// Savings Circle: Community Bank
var app = {
  bank: {
    name: 'DRWB', // 'Banqo de la Pam'
    president: { },
    treasurer: { },
    type: 'MFI' // define types that affect use of attributes
  },
  applications: [],
  open: [],
  closed: []
};

// Identity
// oauth impl

// Data store
var ledger = 'ledger/';  // GitHub

// Model and Configuration
var company = process.env.ALE_COMPANY;
var account = process.env.ALE_LOAN_ACCESS_KEY;
var accountSecret = process.env.ALE_LOAN_ACCESS_SECRET;
var paypal = process.env.ALE_PAYPAL_KEY;
var paypalSecret = process.env.ALE_PAYPAL_KEY;

var User = function() {
  // this.id =
  this.name = faker.name.findName();
  // pull from faker
  this.gender = Math.random() > .5 ? 'female' : 'male';
  this.creditScore = Math.ceil(Math.random() * 100);
  // this.created = (new Date()).getTime();
  // Possible derived from consistent location and time
  this.verifiedEmployment = Math.random() > .8 ? true : false;
  this.contractedCell = Math.random() > .2 ? true : false;
  this.loanAmount = Math.floor(Math.random() * 10000);
  // this.topUpHistory = stoch.brown();
  // Maintained area of non-owned but maintained land control
  this.landTitleProxyVerified = Math.random() > .8 ? true : false;
  // this.debtHistory = stoch.brown(1.0, -0.1, +0.1, 100, true); // Test
  this.existingDebt = Math.floor(Math.random() * 10000);
  this.existingCredit = Math.floor(Math.random() * 10000);
  // Village Savings: fair trade certified
  this.existingSavings = Math.floor(Math.random() * 10000);
  // TODO: Convert to time series
  this.flowCert = {
    farmed: 0, // harvested in kg
    sold: 0,
    got: 0
  };
  // property rights vary by gender and location; assume to be land (Latin America and Africa)
  this.collateral = 0;
  // Example: plow
  this.moveableProperty = 0;
  this.warehoused = 0;
  this._debtCreditRatio = this.existingDebt / this.existingCredit;
  // this._locationHistory = [];
  // console.log(this);
  // this.payments = stoch.brown(1.0, -0.1, +0.1, 100, true); // Test
};


var loanRates = function(creditScore) {
  return 5 +  12 * (100 - parseInt(creditScore)) / 100;
};

var scoreCredit = function(user) {
  console.log('scoring credit', user.creditScore);
  var MIN_SCORE = 20;
  // move to 0
  var marketImpact = parseInt((new Date()).getTime().toString().split('').pop());
  // var loanRate = loanRates(user.creditScore);
  var employmentImpact = !user.verifiedEmployment ? 10 : 0;
  var scoreMin = MIN_SCORE + marketImpact + employmentImpact;
  console.log('MIN_SCORE', MIN_SCORE,  'marketImpact', marketImpact, 'employmentImpact', employmentImpact);
  var rate = loanRates(user.creditScore);
  if (user.creditScore > scoreMin) {
    console.log('accept loan', 'score',  user.creditScore, 'of', user.loanAmount,'at', rate + '%' , 'scoreMin', scoreMin);
  } else {
    console.log('reject loan', 'score', user.creditScore, 'scoreMin', scoreMin);
  }
  console.log('--------------------------------------');

};

var accepted = 0;
var rejected = 0;
var users = [];
for (var i = 0; i < 10; i++) {
  var user = new User();
  console.log(user);
  scoreCredit(user);
}

// s/PRESIDENT/COMPANY
var events = [
  { e: 'COMPANY_INC_REQUEST' },
  { e: 'STATE_INC_ACCEPT' },
  { e: 'STATE_INC_REJECT' },
  { e: 'END' },
  { e: 'COMPANY_ACCOUNT_FUNDS_ADD' },
  { e: 'COMPANY_ACCOUNT_FUNDS_WD' },
  { e: 'USER_LOAN_APPLICATION' },
  { e: 'COMPANY_LOAN_DECISION' },
  { e: 'COMPANY_LOAN_CONTRACT' },
  { e: 'COMPANY_LOAN_DISPURSE' },
  { e: 'USER_LOAN_PAYMENT' },
  { e: 'USER_LOAN_BALANCE' },
  { e: 'USER_LOAN_DEFAULT' },
  { e: 'COMPANY_BALANCE' },
  { e: 'UNKNOWN' },
  { e: 'UNKNOWN' },
  { e: 'UNKNOWN' },
  { e: 'UNKNOWN' },
  { e: 'UNKNOWN' },
  { e: 'UNKNOWN' }
];
// console.log(events);


// Discrete Time Markof Chain of transition events (unbalanced):

var transMtrx = [
  [.1, .5, .1, .1, .1, .1, .1, .1, .5, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, 0 ],
  [.1, .1, .5, .1, .1, .1, .1, .1, .5, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, 0 ],
  [.1, .1, .1, .5, .1, .1, .1, .1, .5, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, 0 ],
  [.2, .1, .1, .1, .5, .1, .1, .1, .5, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, 0 ], // END
  [.1, .1, .1, .1, .1, .5, .1, .1, .5, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, 0 ],
  [.1, .1, .1, .1, .1, .1, .5, .1, .5, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, 0 ],
  [.1, .1, .1, .1, .1, .1, .1, .5, .5, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, 0 ],
  [.1, .1, .1, .1, .1, .2, .2, .2, .5, .2, .2, .2, .1, .1, .1, .1, .1, .1, .1, 0 ],
  [.1, .1, .1, .1, .1, .2, .2, .2, .2, .5, .2, .2, .1, .1, .1, .1, .1, .1, .1, 0 ],
  [.1, .1, .1, .1, .1, .2, .2, .2, .2, .2, .5, .1, .1, .1, .1, .1, .1, .1, .1, 0 ],
  [.1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .5, .1, .1, .1, .1, .1, .1, .1, 0 ],
  [.1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .5, .1, .1, .1, .1, .1, .1, 0 ],
  [.1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .5, .1, .1, .1, .1, .1, 0 ],
  [.1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .5, .1, .1, .1, .1, 0 ],
  [.1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .5, .1, .1, .1, 0 ],
  [.1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .5, .1, .1, 0 ],
  [.1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .5, .1, 0 ],
  [.1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, 0 ],
  [1., .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, .1, 0 ],
  [.0, .0, .0, .0, .0, .0, .0, .0, .0, .0, .0, .0, .0, .0, .0, .0, .0, .0, .0, 0 ]
];
// console.log('NxN transMtrx', transMtrx.length, transMtrx[0].length);


var CTMC = stoch.CTMC(transMtrx, 20, 0, true);
// console.log(CTMC);
var ctmcEvents = Object.keys(CTMC).map((e, i, c) => {
  return events[CTMC[e]].e;
});
// console.log(ctmcEvents);

var forms = {
  LOAN_APPLICATION: {
    date: new Date(),
    name: new String(),
    amount: new Number()
  },
  LOAN: {
    amount: new Number(),
    term_days: new Number()
  }
}
// console.log(forms);

var contract = {
  LOAN_APPLICATION:  function(template) { return template.name === 'Sally Smith' && template.amount < 5.5; },
  LOAN_REPAYMENT: function(template) { return }
}
// console.log(contract);
