const express = require('express');
// const fileUpload = require('express-fileupload');
const routers = express.Router();
const {getAllAccounts, createNewAccount, updateAccount, deleteAccount, findAccountById} = require('../controllers/account.controller');

// const {uploadImage} = require('../middleware/upload');
// const Product = require('../Models/Product.model');

//get all products
routers.get('/', getAllAccounts);
// get all in cart
// router.get('/add-to-cart', getAllProductsInCart);
//create product
routers.post('/create', createNewAccount);
//add to cart
// router.post('/add-to-cart',addToCart);
//get product by id
routers.get('/:id',findAccountById);
//update product by id
routers.patch('/:id', updateAccount);
//delete product by id
routers.delete('/:id', deleteAccount);
//upload
// router.post('/upload', ProductController.uploadImage);
module.exports = routers;