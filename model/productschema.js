const mongoose = require('mongoose');
const Category = require('../model/categoryschema')

const productschema = mongoose.Schema({
    product_title: {
        type: String,
        required: true
    },
    product_description: {
        type: String,
        required: true
    },
    product_category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Category,
        required:true
    },
    price: {
        type: Number,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    images: {
        type:Array,
        required :true
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
})


const products = mongoose.model('products', productschema)
module.exports = products;