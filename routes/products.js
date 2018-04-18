const express = require('express');
const router = express.Router();
const ProductsRepository = require('../repositories/products-repository');

const MONGODB_URL="mongodb://localhost/demo-api";

/**
 * Create a new Product on the database
 * HTTP Verb: POST
 * Path Endpoint : /api/products
 */
router.post('/', (req, res, next) => {

	//Get Submitted JSON Payload
	const jsonPayload = req.body;
	const productRepo = new ProductsRepository(MONGODB_URL);
	productRepo.createProduct(jsonPayload,(err,createdProduct)=>{
		if(err){
			return res.status(err.status).send(err);
		}
		// return the saved record to caller
		res.status(200).send(createdProduct);
	})

});

router.get('/',(req,res,next)=>{

	const repository = new ProductsRepository(MONGODB_URL);
	repository.getAll((err,products)=>{
		if(err){
			return res.status(err.status).send(err);
		}
		res.send(products);
	});

})

module.exports = router;