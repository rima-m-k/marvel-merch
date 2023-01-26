const mongoose= require('mongoose');


const userschema=mongoose.Schema({
    firstname:{
        type:String,
        required:[true,' first name is required'],
        maxlength: [64, 'name cant be longer than 64 characters'],
        minlength: [3,'name cant be lesser than 3 characters']
    },lastname:{
        type:String,
        required:[true,' last name is required'],
        maxlength: [64, 'name cant be longer than 64 characters'],
     },email:{
        type:String,
        required:[true,'email is required'],
        maxlength: [128, 'email cant be longer than 128 characters'],
        index:true,
        
    },phone:{
        type:Number,
        required:[true,'name is required'],
        maxlength: [64, 'name cant be longer than 64 characters'],
        minlength: [3,'camr cant be lesser than 3 characters']
    },password:{
        type:String,
        required:[true,'password is required'],
        maxlength: [100, 'password cant be longer than 100 characters'],
        minlength: [3,'password cant be lesser than 3 characters']
    },blocked :{ 
    type:Boolean,
    required:true,
    default:"false"
    },addresses:[{
        address_name:{  
            type:String
        },
        user_name:{
            type:String
        },house_no:{
            type:String
        },mobile_no:{
            type:Number
        },village:{
            type:String
        },country:{
            type:String
        },city:{
            type:String
        },state:{
            type:String
        },landmark:{
            type:String
        },pincode:{
            type:Number
        },isdefault:{
            type:Boolean
        },
    }]

})

const User= mongoose.model('user',userschema)
module.exports = User