const mongoose = require('mongoose');

const categoryschema= mongoose.Schema({
    categoryname :{
        type :String,
        required:true
        
    },
    categoryImage:{
        type :String,
        required:true
    }
})


const Category= mongoose.model('category',categoryschema)
module.exports = Category;