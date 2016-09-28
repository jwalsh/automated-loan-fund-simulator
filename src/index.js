// Automated Legal Entity
// Nomenclature follows Savings Circles
// Nomenclature reflects Revolving Loan Funds
// http://energy.gov/eere/slsc/revolving-loan-funds

var stoch = require('@jwalsh/stochastic');

// Data store
var ledger = 'ledger/';  // GitHub 

// Model and Configuration 
var company = process.env.ALE_COMPANY;
var account = process.env.ALE_LOAN_ACCESS_KEY;
var accountSecret = process.env.ALE_LOAN_ACCESS_SECRET;
var paypal = process.env.ALE_PAYPAL_KEY
var paypalSecret = process.env.ALE_PAYPAL_KEY

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
console.log(events);


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
console.log('NxN transMtrx', transMtrx.length, transMtrx[0].length);


var CTMC = stoch.CTMC(transMtrx, 20, 0, true);
// console.log(CTMC);
var ctmcEvents = Object.keys(CTMC).map((e, i, c) => {
  return events[CTMC[e]].e;
});
console.log(ctmcEvents);

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
console.log(forms);

var contract = {
  LOAN_APPLICATION:  function(template) { return template.name === 'Sally Smith' && template.amount < 5.5; },
  LOAN_REPAYMENT: function(template) { return }
}
console.log(contract);

