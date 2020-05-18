const mongoose = require('mongoose');
const randomstring = require('randomstring');

function assingRandomAndUniqueValueToField(app, field, next){
    const randomString = randomstring.generate(20);

    let searchCriteria = {};
    searchCriteria[field] = randomString;

    Application.count(searchCriteria).then(count => {
        if(count > 0) return assingRandomAndUniqueValueToField(app, field, next);

        app[field] = randomString;
        next();
    });
}

let applicationSchema = new mongoose.Schema({
    // Clientes con javaScript donde el codigo es publico
    applicationId: {
        type: String,
        required: true,
        unique: true
    },
    // Para aplicaciones de servidor que consumen el servicio web se les envia un secreto
    secret: {
        type: String,
        required: true,
        unique: true
    },
    // para la seguridad donde se use el aplicationId, donde 
    // que dominios es valido donde se ejecute Ajax
    origins: String,
    name: String
});

applicationSchema.pre('validate', function(next){
    assingRandomAndUniqueValueToField(this, 'applicationId', () => {
        assingRandomAndUniqueValueToField(this, 'secret', next);
    });
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;

/*
    Los valores "secret" y "applicationId" tiene 2 requisitos se llenaran con
    String aleatorios y deben ser unicos
*/