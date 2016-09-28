// Automated Legal Entity
// Nomenclature follows Savings Circles
// Nomenclature reflects Revolving Loan Funds
// http://energy.gov/eere/slsc/revolving-loan-funds

// Data store
var ledger = 'ledger/';  // GitHub 

// Model and Configuration 
var company = process.env.ALE_COMPANY;
var account = process.env.ALE_LOAN_ACCESS_KEY;
var accountSecret = process.env.ALE_LOAN_ACCESS_SECRET;
var paypal = process.env.ALE_PAYPAL_KEY
var paypalSecret = process.env.ALE_PAYPAL_KEY

// s/PRESIDENT/COMPANY
var events = {
  COMPANY_ACCOUNT: '',
  STATE_INCORPORATES: '',
  // COMPANY_PROMOTE: '',
  USER_LOAN_APPLICATION: '',
  COMPANY_LOAN_DECISION: '',
  COMPANY_LOAN_CONTRACT: '',
  COMPANY_LOAN_DISPURSE: '', 
  USER_LOAN_PAYMENT: '',
  USER_DEFAULT: '',
  COMPANY_BALANCE: '',
  COMPANY_RESOLUTION: ''
}
console.log(events);

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

