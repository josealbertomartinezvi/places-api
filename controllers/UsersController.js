const User = require('./../models/User');
const buildParams = require('./HelpersController').buildParams;

const validParams = ['email', 'name', 'password'];

function create(req, res){
    const params = buildParams(validParams, req.body);

    User.create(params).then(user => {
        res.status(200).json({message: 'user successfully created'});
    }).catch(error => {
        console.log(error);
        res.status(422).json({ error });
    });
}

function myPlaces(req, res){
    User.findOne({ '_id': req.user.id })
        .then(user => {
            user.places.then(places => {
                res.json(places);
            })
        }).catch(err => {
            res.json(err);
        })
}



module.exports = { create, myPlaces };