const uploader = require('./../models/Uploader');
const buildParams = require('./HelpersController').buildParams;
const FavoritePlace = require('./../models/FavoritePlace');
const User = require('./../models/User');
const Place = require('./../models/Place');
const validParams = ['_place'];

function find(req, res, next){
    FavoritePlace.findById(req.params.id)
        .then(fav => {
            req.favorite = fav;
            req.mainObj = fav;
            next();
        })
        .catch(next);
}

function index(req, res){

    req.fullUser.favorites.then(places => {
        Place.find({ '_id': { $in: places } }).then(places => {
            res.json(places);
        }).catch(error => {
            res.json({error});
        })
    }).catch(error => {
        res.json({error});
    });

}

function create(req, res, next){
    let params = buildParams(validParams, req.body);
    params['_user'] = req.user.id;

    FavoritePlace.create(params)
        .then(favorite => {
            res.json(favorite);
        }).catch(error => {
            res.status(422).json({ error });
        });
}

function destroy(req, res, next){
    req.favorite.remove().then(doc => {
        res.json({});
    }).catch(error => {
        res.status(500).json({ error });
    });
}

module.exports = {
    find,
    create,
    destroy,
    index
}
