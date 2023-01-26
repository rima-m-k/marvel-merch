const mongoose = require('mongoose');
const User = require('../model/userschema');
const Product = require('../model/productschema');

const cartschema= mongoose.Schema({
    userid :{
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required:true
    },
    product :[{
        productid:{ 
        type:mongoose.Schema.Types.ObjectId,
         ref:Product
        },
        quantity:{
            type:Number 
        },
       
    }]
    
     
})


const Cart= mongoose.model('cart',cartschema)
module.exports = Cart;