const buildParams = require('./HelpersController').buildParams;
const Application = require('./../models/Application');
const validParams = ['origins', 'name'];

function find(req, res, next){
    Application.findById(req.params.id)
        .then(application => {
            req.application = application;
            req.mainObj = application;
            next();
        })
        .catch(next);
}

function index(req, res){

}

function create(req, res, next){
    let params = buildParams(validParams, req.body);

    Application.create(params)
        .then(application => {
            res.json(application);
        }).catch(error => {
            res.status(422).json({ error });
        });
}

function destroy(req, res, next){
    req.application.remove().then(doc => {
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