const express = require('express');
let router = express.Router();

const usersController = require('./../controllers/UsersController');

router.route('/')
    // .get(usersController.index)
    .post(usersController.create);

router.route('/places')
    .get(usersController.myPlaces);

router.route('/:id')
    // .get(usersController.find, usersController.show)
    // .put(usersController.find, usersController.update)
    // .delete(usersController.find, usersController.destroy);

module.exports = router;