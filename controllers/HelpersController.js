function buildParams(validParams, body){
    let params = {};

    validParams.forEach(attr => {
        // valida si existen los atributos de la lista
        if(Object.prototype.hasOwnProperty.call(body, attr))
            params[attr] = body[attr];
    });

    return params;
}

module.exports = { buildParams };