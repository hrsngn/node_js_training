const mongoose = require('mongoose');
const MODEL_NAME = 'Product';

// Define product schema
const productSchema = mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    price:{
        amount:{
            type : Number,
            required: true
        },
        currency:{
            type: String,
            required: true
        }
    }
});

//Define product model
const Product = mongoose.model(MODEL_NAME,productSchema);

//TODO : export the product model
module.exports = Product;