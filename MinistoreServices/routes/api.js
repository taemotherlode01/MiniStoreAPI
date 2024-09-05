const express = require('express');
const router = express.Router();
const customerController = require('../controller/customers');
const productController = require('../controller/products');
const orderController = require('../controller/orders');
const authController = require('../controller/auth');
const userController = require('../controller/users');

const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
    windowMs: 1000*60*1,   // 3 minutes
    max: 5, // in 3 minute connect 10
    message: 'Too many requests, please try again after 1 minutes!'
});

router.post('/customers',apiLimiter,customerController.createCustomer);
router.put('/customers',apiLimiter,customerController.updateCustomer);
router.delete('/customers/:id',apiLimiter,customerController.deleteCustomer);
router.get('/customers/:id',customerController.getCustomer); // No limit
router.get('/customers/q/:term',apiLimiter,customerController.getCustomersByTerm);
router.get('/customers', authController.verifyToken, customerController.getCustomers);

router.post('/products',apiLimiter,productController.createProduct);
router.put('/products',apiLimiter,productController.updateProduct);
router.delete('/products/:id',apiLimiter,productController.deleteProduct);
router.get('/products',apiLimiter,productController.getProducts);
router.get('/products/:id', apiLimiter, productController.getProduct);
router.get('/products/:q/:term',apiLimiter,productController.getProductsByTerm);
router.post('/orders', apiLimiter, orderController.createOrder);

router.post('/users', userController.createUser);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;

/**
 * @swagger
 * components:
 *    schemas:
 *      Customer:
 *        type: object
 *        properties:
 *          customer_id:
 *            type: integer
 *            description: The unique identifier of the customer.
 *          first_name:
 *            type: string
 *            description: The customer's firstname.
 *          last_name:
 *            type: string
 *            description: The customer's lastname.
 *          email:
 *            type: string
 *            description: The customer's email (unique).
 *          address:
 *            type: string
 *            description: The customer's address.
 *          phone_number:
 *            type: string
 *            description: The customer's phone number.
 *        required:
 *          - none
 */

/**
 * @swagger
 * /api/v1/customers:
 *   get:
 *     summary: Get All Customers
 *     tags: [Customers]
 *     description: Returns a list of all customers in the database.
 *     responses:
 *       200:
 *         description: A list of customers.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/Customer'
 *       500:
 *         description: Internal server error.
 * 
 */

/**
 * @swagger
 * /api/v1/customers/{id}:
 *   get:
 *     summary: Get Customer by ID
 *     tags: [Customers]
 *     description: Returns a single customer object based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The unique identifier of the customer.
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Customer object found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       404:
 *         description: Customer not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating customer not found.
 *       500:
 *         description: Internal server error.
 *
 */

/**
 * @swagger
 * /api/v1/customers:
 *   post:
 *     summary: Create a new Customer 
 *     tags: [Customers]
 *     description: create a new customer on database 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       200:
 *         description: Customer object created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       500:
 *         description: Internal server error.
 *
 */

/**
 * @swagger
 * /api/v1/customers:
 *   put:
 *     summary: Update an existing Customer
 *     tags: [Customers]
 *     description: Update an existing customer in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                id:
 *                   type: integer
 *                   description: The unique identifier of the customer.
 *                first_name:
 *                   type: string
 *                   description: The customer's firstname.
 *                last_name:
 *                   type: string
 *                   description: The customer's lastname.
 *                email:
 *                   type: string
 *                   description: The customer's email (unique).
 *                address:
 *                   type: string
 *                   description: The customer's address.
 *                phone_number:
 *                   type: string
 *                   description: The customer's phone number.
 *     responses:
 *       200:
 *         description: Customer object updated.
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: integer
 *                    description: The unique identifier of the customer.
 *                  first_name:
 *                    type: string
 *                    description: The customer's firstname.
 *                  last_name:
 *                    type: string
 *                    description: The customer's lastname.
 *                  email:
 *                    type: string
 *                    description: The customer's email (unique).
 *                  address:
 *                    type: string
 *                    description: The customer's address.
 *                  phone_number:
 *                    type: string
 *                    description: The customer's phone number.
 *       404:
 *         description: Customer not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating customer not found.
 *       500:
 *         description: Internal server error.
 *
 */

/**
 * @swagger
 * /api/v1/customers/{id}:
 *   delete:
 *     summary: Delete a Customer by ID
 *     tags: [Customers]
 *     description: Delete a customer from the database based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The unique identifier of the customer.
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Customer object deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating customer deleted.
 *       404:
 *         description: Customer not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating customer not found.
 *       500:
 *         description: Internal server error.
 *
 */

/**
 * @swagger
 * /api/v1/customers/q/{term}:
 *   get:
 *     summary: Search Customers by Term
 *     tags: [Customers]
 *     description: Returns a list of customers that match the search term.
 *     parameters:
 *       - in: path
 *         name: term
 *         description: The search term to filter customers.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of customers matching the search term.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 *       404:
 *         description: No customers found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating no customers found.
 *       500:
 *         description: Internal server error.
 *
 */

/*----------------------------------------------------------------------*/

/**
 * @swagger
 * components:
 *    schemas:
 *      Product:
 *        type: object
 *        properties:
 *          product_id:
 *            type: integer
 *            description: The unique identifier of the product.
 *          name:
 *            type: string
 *            description: The product's name.
 *          description:
 *            type: string
 *            description: The product's description.
 *          price:
 *            type: integer
 *            description: The product's price.
 *          category:
 *            type: string
 *            description: The product's category.
 *          image_url:
 *            type: string
 *            description: The product's url of image.
 *        required:
 *          - none
 */

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Get All Products
 *     tags: [Products]
 *     description: Returns a list of all products in the database.
 *     responses:
 *       200:
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/Product'
 *       500:
 *         description: Internal server error.
 * 
 */

/**
 * @swagger
 * /api/v1/products/{id}:
 *   get:
 *     summary: Get Product by ID
 *     tags: [Products]
 *     description: Returns a single product object based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The unique identifier of the product.
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Product object found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating product not found.
 *       500:
 *         description: Internal server error.
 *
 */

/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     summary: Create a new Product 
 *     tags: [Products]
 *     description: create a new product on database 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product object created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Internal server error.
 *
 */

/**
 * @swagger
 * /api/v1/products:
 *   put:
 *     summary: Update an existing Product
 *     tags: [Products]
 *     description: Update an existing product in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: The ID of the product to update.
 *               name:
 *                 type: string
 *                 description: The product's name.
 *               description:
 *                 type: string
 *                 description: The product's description.
 *               price:
 *                 type: integer
 *                 description: The product's price.
 *               category:
 *                 type: string
 *                 description: The product's category.
 *               image_url:
 *                 type: string
 *                 description: The product's url of image.
 *     responses:
 *       200:
 *         description: Product object updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *               id:
 *                 type: integer
 *                 description: The ID of the product to update.
 *               name:
 *                 type: string
 *                 description: The product's name.
 *               description:
 *                 type: string
 *                 description: The product's description.
 *               price:
 *                 type: integer
 *                 description: The product's price.
 *               category:
 *                 type: string
 *                 description: The product's category.
 *               image_url:
 *                 type: string
 *                 description: The product's url of image.
 *       404:
 *         description: Product not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating product not found.
 *       500:
 *         description: Internal server error.
 *
 */

/**
 * @swagger
 * /api/v1/products/{id}:
 *   delete:
 *     summary: Delete a Product by ID
 *     tags: [Products]
 *     description: Delete a product from the database based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The unique identifier of the product.
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Product object deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating product deleted.
 *       404:
 *         description: Product not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating product not found.
 *       500:
 *         description: Internal server error.
 *
 */

/**
 * @swagger
 * /api/v1/products/q/{term}:
 *   get:
 *     summary: Search Products by Term
 *     tags: [Products]
 *     description: Returns a list of products that match the search term.
 *     parameters:
 *       - in: path
 *         name: term
 *         description: The search term to filter products.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of products matching the search term.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       404:
 *         description: No products found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating no products found.
 *       500:
 *         description: Internal server error.
 *
 */