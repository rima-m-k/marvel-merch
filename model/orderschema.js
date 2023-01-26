const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref : 'user',
    },
    name:{
        type:String
    },
    phone:{
        type:Number
    },
    deliveryAddress:{
        address_name : String,
        user_name : String,
        house_no : String,
        mobile_no: Number,
        village : String,
        country : String,
        city :String,
        state :String,
        landmark :String,
        pincode :Number,
        
    },
    orderedItems:[
        {
            productid : {
                type : mongoose.Types.ObjectId,
                ref : 'products'
            },
            qty : Number,
            
        }
        
    ],
       
    totalAmount:{
        type:Number
    },
    couponUsed:{
        type:mongoose.Types.ObjectId,
        default:null
    },
    discountPrice:{
        type:Number,
        default:0
    },
    paidAmount:{
        type:Number
    },
    orderStatus:{
        type:String,
        default:'processing'
    },
    paymentMethod:{
        type:String
    },
    orderDate:{
        type:Date,
        default:Date.now()
    },
    deliveryDate:{
        type:String,
        default:new Date(Date.now() + 5*24*60*60*1000).toISOString().slice(0,10)
    }
})

const Order = new mongoose.model("order",orderSchema);
module.exports = Order;
