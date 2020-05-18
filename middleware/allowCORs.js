module.exports = function(options){
    let CORsMiddleware = function(req, res, next){

        if(req.application){
            req.application.origins.split(",").forEach(origin => {
                res.header("Access-Control-Allow-Origin", origin);
            });
        }else{
            res.header("Access-Control-Allow-Origin", "*");
        }

        // Tipos de encabezados que se pueden recibir cuando el cliente AJAX realice una solicitud
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Application");

        next();
    }

    CORsMiddleware.unless = require('express-unless');

    return CORsMiddleware;
}