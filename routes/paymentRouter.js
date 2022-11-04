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
                        "cancel_url": "http://localhost:3000/payment/cancel"
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

// $$$$$$$$$$$$$$$$$$ WHEN PURCHASE SUCCESS $$$$$$$$$$$$$$$$$$
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
                    res.render('purchaseSuccess', { eventTitle: event.event_title });
                }
            });
        },
            err => next(err))
        .catch(err => next(err))
});

// $$$$$$$$$$$$$$$$$$ WHEN PURCHASE CANCELLED $$$$$$$$$$$$$$$$$$
paymentRouter.get('/cancel', (req, res, next) =>{
    res.render('purchaseCancel');
})
module.exports = paymentRouter;