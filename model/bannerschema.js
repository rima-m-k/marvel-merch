const mongoose = require('mongoose');

const bannerschema= mongoose.Schema({
    image :{
        type:String,
        required:true
    },
    inUse:{
        type:Boolean,
        default:false
    },
    isDeleted :{
        type:Boolean,
        default:false
    }
    
     
})


const Banner= mongoose.model('banner',bannerschema)
module.exports = Banner;