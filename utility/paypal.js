const paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AaauMdWzXcMYJ4O-E52wRkpb3KLrFi5744tKaCMhHp2bjHttTLHU6JdcXebLrAO6aZ4ods2ocZ1NY_Wj',
    'client_secret': 'EBs9SM2WMgLaVycxwETdGdnPwh6-zUAclYLTlmKuW_6Ged7gbnXM1-HAj0G2xlEaqRiw2kdE-0Dvvk_F'
  });

const create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://localhost:8000/orderSuccess",
        "cancel_url": "http://localhost:8000/orderFail"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "item",
                "sku": "item",
                "price": "1.00",
                "currency": "USD",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "USD",
            "total": "1.00"
        },
        "description": "This is the payment description."
    }]
};
 
paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
        throw error;
    } else {
        console.log("Create Payment Response");
        console.log(payment);
    }
});
