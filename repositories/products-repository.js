'use strict';

const Product = require('../models/product-model');
const mongoose = require('mongoose');

class ProductRepository{
    constructor(mongoDBUrl){
        this.mongoDBUrl = mongoDBUrl;
    }

    /**
     * Helper method creating a new product on mongo database
     * @param {*} jsonPayload JSON payload of product sent by client
     * @param {*} callback 1st argument error and 2nd argument : result
     */
    createProduct(jsonPayload, callback){
        //Instantiate a Product instance which wraps the Json Payload
        const newProduct = new Product(jsonPayload);
        //Validate new Product fields
        const errValidation = newProduct.validateSync();

        // Examine the validation error object
        if(errValidation){ //log error
            console.log(`[ERROR] - details : \n`,errValidation);
            // Return the error to outside
            // return res.status(400).send(errValidation); //bad request
            return callback({
                error: err, 
                message: 'Unable to create new record on database', 
                status : 400
            });
        }

        //Connect to mongoDB using mongoose
        mongoose.connect(this.mongoDBUrl);

        //Handle connection error through listenning to emitted error event emiter
        mongoose.connection.on('error',(err)=>{
            console.log(`[ERROR] - details : \n`,err);
            callback({
                error: err, 
                message: 'Unable to connect to database', 
                status : 500
            });
        });

        //save the product instance into mongoDB server
        newProduct.save((err,createdProduct)=>{
            // /Close the connection
            mongoose.disconnect();
            
            // Handle error response
            if(err){
                console.log(`[ERROR] - details : \n`,err);
                return callback({
                    error: err, 
                    message: 'Unable to create new record on database', 
                    status : 500});
            }
            // return the saved record to caller
            callback(null,createdProduct);
        });
    }

    getAll(callback,filter = {}) {
        mongoose.connect(this.mongoDBUrl);
        const db = mongoose.connection;

        db.on('error',(err)=>{
            console.log('[ERROR] - ',err);
            callback({
                error:err,
                message:'unable to connect to database',
                status : 500
            })
        });

        Product.find( filter,(err,products) => {
            mongoose.disconnect();

            if(err) {
                console.log('[ERROR]- ProductRepository.getAll Details : \n');
                return callback(err);
            }

            callback(null,products);
        });
    }
};



module.exports = ProductRepository;