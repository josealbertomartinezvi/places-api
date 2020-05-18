const Place = require('./../models/Place');

function find(req, res, next){
    Place.findById(req.params.id)
    .then(place => {
        req.place = place;
        next();
    }).catch(err => {
        next(err);
    });
}

function index(req, res) {
    // sin paginacion
    // Place.find({}).then(doc => {
    //     res.json(doc);
    // }).catch(err => {
    //     res.json(err);
    // });

    // con paginacion
    Place.paginate({},{ page: req.query.page || 1, limit: 8, sort: { '_id': -1 } })
    .then(doc => {
        res.json(doc);
    }).catch(err => {
        res.json(err);
    });
}

function show(req, res) {
    // Place.findOne({_id: req.params.id})
    // Place.findById(req.params.id).then(doc => {
    //     res.json(doc);
    // }).catch(err => {
    //     res.json(err);
    // });

    // Usando un Middleware
    res.json(req.place);
}

function create(req, res) {
    Place.create({
        title: req.body.title,
        description: req.body.description,
        acceptsCreditCard: req.body.acceptsCreditCard,
        openHour: req.body.openHour,
        closeHour: req.body.closeHour
    }).then(doc => {
        res.json(doc);
    }).catch(err => {
        console.log(err);
        res.json(err);
    });
}

function update(req, res) {
      // OPCION 1
      // Place.findById(req.params.id).then(doc => {
      //   doc.title = req.body.title,
      //   doc.desciption = req.body.desciption

      //   updatedDoc = doc.save();

      //   res.json(updatedDoc);
      // }).catch(err => {
      //   res.json(err);
      // });
    let attributes = ['title', 'description', 'acceptsCreditCard', 'openHour', 'closeHour'];
    let placeParams = {};
    attributes.forEach(attr => {
        // valida si existen los atributos de la lista
        if(Object.prototype.hasOwnProperty.call(req.body, attr))
            placeParams[attr] = req.body[attr];
    });

    // OPCION 2
    // Place.findOneAndUpdate({'_id': req.params.id}, placeParams, {new: true})
    // Place.findByIdAndUpdate(req.params.id, placeParams, {new: true}).then(doc => {
    //     res.json(doc);
    // }).catch(err => {
    //     res.json(err);
    // });

    // usando middleware
    req.place = Object.assign(req.place, placeParams);
    req.place.save().then(doc => {
        res.json(doc);
    }).catch(err => {
        res.json(err);
    });
}

function destroy(req, res) {
    // Place.findByIdAndRemove(req.params.id).then(doc => {
    //     res.json({});
    // }).catch(err => {
    //     res.json(err)
    // });

    // Usando un Middleware
    req.place.remove().then(doc => {
        res.json({});
    }).catch(err => {
        res.json(err)
    }); 
}

module.exports = {
    index,
    show,
    create,
    update,
    destroy,
    find
}