const client = require('twilio')('AC9c5723a3dbf5d984670a70ae540b6942', 'f0da52b7b743823388efc36495926ccc');

const sendSMS = (sendTo, smsCode) => {
    client.messages.create({
      body: "Your confirmation code is: " + smsCode,
      to: sendTo,
      from: process.env.SMSSENDER
   }).then(message => console.log(message))
     // here you can implement your fallback code
     .catch(error => console.log(error))
  }

  module.exports = sendSMS;