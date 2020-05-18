const Application = require('./../models/Application');

module.exports = function(req, res, next){
    // Saber si una peticion es ajax
    if(req.application) return next();

    const applicationId = req.headers.application;
    if(!applicationId) return next();

    Application.findOne({applicationId})
        .then(app => {
            if(!app) return next(new Error('Invalid Application'));
            req.application = app;

            req.validRequest = req.application.origins.split(",").find(origin =>{
                origin = origin.replace(/\s/g,''); // eliminar espacios en blanco
                console.log(req.headers.origin);
                return origin == req.headers.origin;
            })

            next();
        }).catch(error => {
            next(error);
        });
}