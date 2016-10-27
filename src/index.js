// Revolving Loan Fund
// Automated Legal Entity
// Nomenclature follows Savings Circles
// Nomenclature reflects Revolving Loan Funds
// http://energy.gov/eere/slsc/revolving-loan-funds

import * as stoch from '@jwalsh/stochastic';
import faker from 'faker';
import  sample from 'lodash.sample';
import { createStore } from 'redux';

// gender
// creditScore
// verifiedEmployment
// contractedCell
// landTitleProxyVerified
// existingDebt
// existingCredit
// existingSavings
// flowCert.farmed
// flowCert.sold
// flowCert.got
// collateral
// moveableProperty
// warehoused

// Locations that require different risk and information models
const locations = [
  {
    name: 'MIT',
    creditAttributes: ['creditScore', 'contractedCell', 'collateral', 'existingDebt', 'existingCredit']
  },
  // http://blogs.worldbank.org/psd/how-3-banks-emerging-economies-are-banking-women
  {
    name: 'Dominican Republic',
    creditAttributes: ['gender', 'verifiedEmployment', 'contractedCell', 'landTitleProxyVerified']
  },
  {
    name: 'India',
    creditAttributes: ['creditScore', 'verifiedEmployment']
  },
  {
    name: 'Kenya',
    creditAttributes: ['creditScore', 'verifiedEmployment']
  }

];

// Savings Circle: Community Bank
let app = {
  bank: {
    reputation: 50, // board confidence
    president: faker.name.findName(),
    treasurer: faker.name.findName(),
    location: sample(locations) // define types that affect use of attributes
  },
  balance: 100000,
  applications: [],
  open: [],
  closed: [], // completed, collections
  inDefault: [],
  recovery: [], // repo, lien
  defaulted: []
};

// Identity
// oauth impl

// Data store
var ledger = 'ledger/';  // GitHub

// Model and Configuration
app.bank.name = process.env.ALE_COMPANY || faker.company.companyName() + ' Bank';
app.bank.taxid = process.env.ALE_LOAN_ACCESS_KEY || faker.finance.account();

var accountSecret = process.env.ALE_LOAN_ACCESS_SECRET;
var paypal = process.env.ALE_PAYPAL_KEY;
var paypalSecret = process.env.ALE_PAYPAL_KEY;

var users = [];


// When a loan is in default (in days)
var defaultingThresholds = {
  a: 30,
  b: 60,
  c: 90
};

var notificationStrategies = [
  {
    name: 'txt'
  },
  {
    name: 'credit-score'
  },
  {
    name: 'call'
  }
];

var recoveryStrategies = [
  {
    name: 'txt'
  },
  {
    name: 'e-mail'
  },
  {
    name: 'mail'
  },
  {
    name: 'call'
  },
  {
    name: 'in-person'
  }
];

// Nature of the loan request
var loanSegments = [
  {
    type: 'agriculture',
    rate: 5

  },
  {
    type: 'health',
    rate: 16

  },
  {
    type: 'hurricane'
  }
];


// Origination
var User = function() {
  // Core Bankable: Regulatory criteria (Banks / Credit Unions)
  this.identity = {
    name: faker.name.findName(),
    govtid: Math.floor(Math.random() * 10000000)
  };

  this.address =  faker.address.street;

  // Social
  this.references = [];

  // Unbankable: (NGO, Non-Profit)
  // Parameters for risk assessment
  // pull from faker
  this.blacklisted = false;

  this.creditScore = Math.ceil(Math.random() * 100);
  // this.created = (new Date()).getTime();
  // Possible derived from consistent location and time
  this.verifiedEmployment = Math.random() > .8 ? true : false;
  this.contractedCell = Math.random() > .2 ? true : false;
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

  this.publicKey = 'TODO';

  this.paymentsHistory = stoch.brown(1.0, -0.1, +0.1, 100, true).slice(1,10);
  // console.log(this);

  // Loan
  this.loanAmount = Math.floor(Math.random() * 10000);

  // Methods
  this.repay = function() {

  };

  // what incentives the user or the higher score would reduce default risk
  // this.motivation = ['social', 'credit'];
  // this.topUpHistory = stoch.brown();
  // Maintained area of non-owned but maintained land control

  // Discrimination
  this.male = Math.random() > .5 ? true : false;
  this.christian = Math.random() > .3 ? true : false;
  this.medical = Math.random() > .1 ? false : true;
  this.age = Math.ceil(Math.random() * 100);
};

// User + app.Bank
var requestLoan = function(amount) {

};

var loanRates = function(creditScore) {
  return 5 +  12 * (100 - parseInt(creditScore)) / 100;
};

var scoreCredit = function(user) {
  if (!user || user.creditScrore) {
    return;
  }
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
    console.log('accepted', 'score',  user.creditScore, 'of', user.loanAmount,'at', rate + '%' , 'scoreMin', scoreMin);
    var terms = {
      user: user,
      amount: user.loanAmount,
      rate: rate,
      _scoreMin: scoreMin,
      created: (new Date()).getTime()
    };
    app.open.push(terms);
  } else {
    console.log('rejected', 'score', user.creditScore, 'scoreMin', scoreMin);
  }
  console.log('Open loans:', app.open.length);
  console.log('--------------------------------------');
};


for (var i = 0; i < 100; i++) {
  var user = new User();
  // console.log(user);
  users.push(user);
  // scoreCredit(user);
}

// A day passes every 2 seconds
var appMonths = 3;  // months
var simulationMinutes = 3; // minutes
var appStart = (new Date()).getTime();
var appMonthsMs = 60 * 60 * 24 * 3 * appMonths;
console.log(appMonths, 'months;', appMonthsMs, 'duration');
var appEvents = stoch.poissP(1, appMonthsMs, true);
// console.log(appEvents);

// Create a time simulation
console.log('Starting Automated Loan Funds Simulation');
console.log('Application:', app);
console.log('Population:', users.length);
console.log('Duration (months):', appMonths);

// Loan Applications
setInterval(function() {

  // Pick a new random time
  // Pick a new random event
  var diff = appEvents[0] * 1000;
  //  console.log(diff);
  if (diff < (new Date()).getTime() - appStart) {
    var e = Math.floor(appEvents.shift());
    var action = {};

    if (Math.random() < .5) {
      action = users.shift();
      scoreCredit(action);
      console.log('Originization:', e, '(seconds)', action );
    }

  }
}, 100);

// Disbursement
setInterval(function() {
  console.log('Disbursement:', 'Payment');
}, 1000);

// Repayment
setInterval(function() {
  var loan = sample(app.open);
  if (loan) {
    console.log('Collection:', 'Payment', loan.user.name, loan.amount);
    if (loan.amount > 0) {
      loan.amount -= 100;;
    }
  }
}, 1000);

// Defaulted
setInterval(function() {
  var loan = sample(app.open);
  if (loan) {
    console.log('Recovery:', 'Check defaults', loan.user.name, loan.amount);
    if (loan.amount > 0) {
      loan.amount -= 100;;
    }
  }
}, 1000);


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
};
// console.log(forms);

var contract = {
  LOAN_APPLICATION:  function(template) { return template.name === 'Sally Smith' && template.amount < 5.5; },
  LOAN_REPAYMENT: function(template) { return }
};
// console.log(contract);
