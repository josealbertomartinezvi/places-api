const express = require('express');
let router = express.Router();

const sessionsController = require('./../controllers/SessionsControllers');

router.route('/')
    .post(sessionsController.authenticate,
        sessionsController.generateToken,
        sessionsController.sendToken
    );

module.exports = router;