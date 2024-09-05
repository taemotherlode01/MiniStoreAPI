const express = require('express');
const router = express.Router();
const customerControllerv2 = require('../controller/customersv2');

router.get('/customers/q/:term', customerControllerv2.getCustomersByTerm);

module.exports = router;