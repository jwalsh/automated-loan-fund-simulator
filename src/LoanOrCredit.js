var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blogSchema = new Schema(
  {
    "loanTerm":{
      "@type": String,
      "value": String,
      "unitCode": String
    },
    "annualPercentageRate":[
      {
        "@type": String,
        "name": String,
        "minValue": String,
        "maxValue": String
      }
    ],
    "amount":[
      {
        "@type": String,
        "name": String,
        "value": String,
        "currency": String
      },
      {
        "@type": String,
        "name": String,
        "value": String,
        "currency": String
      }
    ]
  });
