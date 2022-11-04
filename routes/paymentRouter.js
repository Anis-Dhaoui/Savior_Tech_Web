const express = require('express');
const paypal = require('paypal-rest-sdk');
const paymentRouter = express.Router();
const db = require('../models');
const EVENT = db.Events;

paypal.configure({
    'mode': process.env.MODE,
    'client_id': process.env.CLIENT_ID,
    'client_secret': process.env.CLIENT_SECRET
});


paymentRouter.post('/pay/:eventId', (req, res, next) => {
    EVENT.findOne({ where: { id: req.params.eventId }, raw: true })
        .then((event) => {
            if (event != null) {
                var create_payment_json = {
                    "intent": "sale",
                    "payer": {
                        "payment_method": "paypal"
                    },
                    "redirect_urls": {
                        "return_url": `http://localhost:3000/payment/success?event_id=${event.id}`,
                        "cancel_url": "http://localhost:3000/cancel"
                    },
                    "transactions": [{
                        "item_list": {
                            "items": [{
                                "name": event.event_title,
                                "sku": event.id,
                                "price": event.event_price,
                                "currency": "USD",
                                "quantity": 1
                            }]
                        },
                        "amount": {
                            "currency": "USD",
                            "total": event.event_price
                        },
                        "description": `You are going to pay ${event.event_price} USD for the event ${event.event_title}`,
                        "payment_options": {
                            "allowed_payment_method": "INSTANT_FUNDING_SOURCE"
                        }
                    }]
                };

                paypal.payment.create(create_payment_json, function (error, payment) {
                    if (error) {
                        throw error;
                    } else {
                        payment.links.map(item => {
                            if (item.rel == "approval_url") {
                                res.redirect(item.href);
                                console.log(item.href);
                            }
                        })
                    }
                });
            } else {
                err = new Error("Event not found");
                next(err);
            }
        },
            err => next(err))
        .catch(err => next(err))
});

paymentRouter.get('/success', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    EVENT.findOne({ where: { id: req.query.event_id }, raw: true })
        .then((event) => {
            const execute_payment_json = {
                "payer_id": payerId,
                "transactions": [{
                    "amount": {
                        "currency": "USD",
                        "total": event.event_price
                    }
                }]
            };

            paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
                if (error) {
                    console.log(error.response);
                    throw error;
                } else {
                    console.log(JSON.stringify(payment));
                    res.send('Success');
                }
            });
        },
            err => next(err))
        .catch(err => next(err))
});
module.exports = paymentRouter;


// {
//     id: 'PAYID-MNSFF5Y0BT571566M002734B',
//         intent: 'sale',
//             state: 'created',
//                 payer: { payment_method: 'paypal' },
//     transactions: [
//         {
//             amount: [Object],
//             description: 'This is the payment description.',
//             item_list: [Object],
//             related_resources: []
//         }
//     ],
//         create_time: '2022-11-03T23:47:02Z',
//             links: [
//                 {
//                     href: 'https://api.sandbox.paypal.com/v1/payments/payment/PAYID-MNSFF5Y0BT571566M002734B',
//                     rel: 'self',
//                     method: 'GET'
//                 },
//                 {
//                     href: 'https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-1XK87478WB592581G',
//                     rel: 'approval_url',
//                     method: 'REDIRECT'
//                 },
//                 {
//                     href: 'https://api.sandbox.paypal.com/v1/payments/payment/PAYID-MNSFF5Y0BT571566M002734B/execute',
//                     rel: 'execute',
//                     method: 'POST'
//                 }
//             ],
//                 httpStatusCode: 201
// }