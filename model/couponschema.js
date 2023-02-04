const mongoose = require('mongoose');

const couponschema= mongoose.Schema({
    couponName :{
        type :String,
        required:true
        
    },
    couponCode:{
        type:String,
        
    },
    discount:{
        type:Number,
        
    },
    minAmount:{
        type:Number,
        
    },
    maxAmount:{
        type:Number,
        
    },
    startingDate:{
        type:Date,
        
        
    },
    expiryDate:{
        type:Date,
        
    },
    
    active: {
        type: Boolean,
        default: true,
      },
    isDeleted:{
        type:Boolean,
        default : false
    },
  
   
   
   
   
})


const Coupon= mongoose.model('coupon',couponschema)
module.exports = Coupon;