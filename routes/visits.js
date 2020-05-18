const express = require('express');
let router = express.Router();

const visitsController = require('../controllers/VisitsController');
const authenticateOwner = require('../middleware/authenticateOwner');

const jwtMiddleware = require('express-jwt');
const secrets = require('./../config/secrets');

router.route('/')
    .get(jwtMiddleware({secret: secrets.jwtSecret}), visitsController.index)
    .post(visitsController.create);

router.route('/:vist_id')
    .delete(visitsController.find, authenticateOwner, visitsController.destroy);

module.exports = router;