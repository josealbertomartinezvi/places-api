const uploader = require('./../models/Uploader');
const buildParams = require('./HelpersController').buildParams;
const Visit = require('./../models/Visit');
const User = require('./../models/User');
const validParams = ['_place', 'reaction', 'observation'];

function find(req, res, next){
    Visit.findById(req.params.visit_id)
        .then(visit => {
            req.visit = visit;
            req.mainObj = visit;
            next();
        })
        .catch(next);
}

function index(req, res){
    let promise = null;

    if(req.place){
        promise = req.place.visits;
    }else if(req.user){
        promise = Visit.forUser(req.user.id, req.query.page || 1);
    }

    if(promise){
        promise.then(visits => {
            res.json(visits);
        }).catch(error =>{
            res.status(500).json({error});
        });
    }else{
        res.status(404).json({});
    }
}

function create(req, res, next){
    let params = buildParams(validParams, req.body);
    params['_user'] = req.user.id;

    Visit.create(params)
        .then(visit => {
            res.json(visit);
        }).catch(error => {
            res.status(422).json({ error });
        });
}

function destroy(req, res, next){
    req.visit.remove().then(doc => {
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