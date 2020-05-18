const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const uploader = require('./Uploader');
const slugify = require('./../plugins/slugify');

const User = require('./User');
const Visit = require('./Visit');

let placeSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    slug:{
        type: String,
        unique: true
    },
    address: String,
    description: String,
    acceptsCreditCard:{
        type: Boolean,
        default: false
    },
    coverImage: String,
    avatarImage: String,
    openHour: Number,
    closeHour: Number,
    _user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

placeSchema.methods.updateImage = function(path, imageType){
    return uploader(path)
        .then(secure_url => this.saveImageUrl(secure_url, imageType));
}

placeSchema.methods.saveImageUrl = function(secureUrl, imageType){
    this[imageType+"Image"] = secureUrl;
    return this.save();
}
// Hooks before of save
placeSchema.pre('save', function(next){
    if(this.slug) return next();
    generateSlugsAndContinue.call(this, 0, next);
});

placeSchema.virtual('visits').get(function(){
    return Visit.find({'_place': this._id}).sort('-id');
});

placeSchema.statics.validateSlugCount = function(slug){
    return Place.countDocuments({ slug }).then(count => {
        if(count > 0) return false;
        return true;
    });
}

placeSchema.plugin(mongoosePaginate);

function generateSlugsAndContinue(count, next){
    this.slug = slugify(this.title);

    if(count != 0)
        this.slug = this.slug + "-" + count;

    Place.validateSlugCount(this.slug)
        .then(isValid => {
            if(!isValid)
                return generateSlugsAndContinue.call(this, count+1, next);

            next();
        });
}



let Place = mongoose.model('Place', placeSchema);

module.exports = Place;