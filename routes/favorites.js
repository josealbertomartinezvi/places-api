const express = require('express');
let router = express.Router();
const jwtMiddleware = require('express-jwt');
const secrets = require('./../config/secrets');
const findUser = require('../middleware/findUser');

const favoritesController = require('./../controllers/FavoritesController');
const authenticateOwner = require('./../middleware/authenticateOwner');

router.route('/')
    .get(jwtMiddleware({secret: secrets.jwtSecret}), findUser, favoritesController.index)
    .post(favoritesController.create);

router.route('/:id')
.delete(favoritesController.find, authenticateOwner, favoritesController.destroy);




module.exports = router;