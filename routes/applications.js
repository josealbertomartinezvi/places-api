const express = require('express');
let router = express.Router();

const applicationsController = require('../controllers/applicationsController');
const authenticateAdmin = require('../middleware/authenticateAdmin');
const findUser = require('../middleware/findUser');

const jwtMiddleware = require('express-jwt');
const secrets = require('./../config/secrets');

router.all('*', jwtMiddleware({secret: secrets.jwtSecret}), findUser, authenticateAdmin);

router.route('/')
    .get(applicationsController.index)
    .post(applicationsController.create);

router.route('/:id')
    .delete(applicationsController.find, applicationsController.destroy);

module.exports = router;