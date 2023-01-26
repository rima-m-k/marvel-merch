const mongoose = require('mongoose');
const User = require('./userschema');
const Product = require('./productschema');

const wishlistschema= mongoose.Schema({
    userid :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    product :[{
        productid:{ 
        type:mongoose.Schema.Types.ObjectId,
         ref:Product
        }
    }] 
})

const Wishlist= mongoose.model('wishlist',wishlistschema)
module.exports = Wishlist;  