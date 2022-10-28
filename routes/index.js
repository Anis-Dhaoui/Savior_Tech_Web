var express = require('express');
const client = require('twilio')('AC9c5723a3dbf5d984670a70ae540b6942', 'f0da52b7b743823388efc36495926ccc');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
 sendTextMessage();
 <div style="text-align:center; padding-top:40px;">
  <h1>welcome to Our Savior Tech</h1>
  <p>this is a hello world app</p>
 </div>

});


function sendTextMessage() {
  client.messages.create({
    body: 'Hello from Savior Tech',
    to: '+21653591611',
    from: '+12345678901'
 }).then(message => console.log(message))
   // here you can implement your fallback code
   .catch(error => console.log(error))
}

module.exports = router;
