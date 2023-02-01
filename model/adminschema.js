const mongoose= require('mongoose');

const adminschema=mongoose.Schema({
    name:String,
    email:String,
    password:String,
})
const Admin= mongoose.model('admin',adminschema)
module.exports = Admin