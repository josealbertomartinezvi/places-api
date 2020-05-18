const Place = require('./../models/Place');
const upload = require('./../config/upload');
const uploader = require('./../models/Uploader');
const buildParams = require('./HelpersController').buildParams;

const validParams = ['title', 'address', 'description', 'acceptsCreditCard', /*'avatar', 'cover',*/ 'openHour', 'closeHour'];

function find(req, res, next){
    Place.findOne({slug: req.params.id})
    .then(place => {
        req.place = place;
        req.mainObj = place;
        next();
    }).catch(err => {
        next(err);
    });
}

function index(req, res) {
    // con paginacion
    Place.paginate({},{ page: req.query.page || 1, limit: 8, sort: { '_id': -1 } })
    .then(doc => {
        res.json(doc);
    }).catch(err => {
        res.json(err);
    });
}

function show(req, res) {
    res.json(req.place);
}

function create(req, res, next) {

    const params = buildParams(validParams, req.body);
    params['_user'] = req.user.id;
    Place.create(params).then(doc => {
        // res.json(doc);
        req.place = doc;
        next();
    }).catch(err => {
        // res.json(err);
        next(err);
    });
}

function update(req, res) {

    const params = buildParams(validParams, req.body);

    // usando middleware
    req.place = Object.assign(req.place, params);
    req.place.save().then(doc => {
        res.json(doc);
    }).catch(err => {
        res.json(err);
    });
}

function destroy(req, res) {

    // Usando un Middleware
    req.place.remove().then(doc => {
        res.json({});
    }).catch(err => {
        res.json(err)
    }); 
}

function multerMiddleware(){
    // para un archivo
    // return upload.single('nombre_archivo');

    // para mas de un archivo
    return upload.fields([
        {name: 'avatar', maxCount: 1},
        {name: 'cover', maxCount: 1},
    ]);
}

function saveImage(req, res){
    if(req.place){
        const files = ['avatar', 'cover'];
        const promises = [];

        files.forEach(imageType => {
            if(req.files && req.files[imageType]){
                const path = req.files[imageType][0].path;
                promises.push(req.place.updateImage(path, imageType));
            }
        });

        Promise.all(promises).then(result => {
            console.log(result);
            res.json(req.place);
        }).catch(err => {
            console.log(err);
            res.json(err);
        });

    }else{
        res.status(422).json({
            error: req.error || 'Could not save place'
        });
    }
}

module.exports = {
    index,
    show,
    create,
    update,
    destroy,
    find,
    multerMiddleware,
    saveImage
}