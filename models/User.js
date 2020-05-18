const mongoose = require('mongoose');
const Place = require('./Place');
const FavoritePlace = require('./FavoritePlace');

let userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    admin: {
        type: Boolean,
        default: false
    }
});

userSchema.virtual('places').get(function(){
    return Place.find({'_user': this._id });
});

userSchema.virtual('favorites').get(function(){
    return FavoritePlace.find({'_user': this._id }, {'_place': true})
            .then(favs => {
                let placeIds = favs.map(fav => fav._place);
                return placeIds;
                // return Place.find({ '_id': { $in: placeIds } });
                // Place.find({ '_id': { $in: placeIds } }).then(places => {
                //     console.log(places)
                //     return places;
                // })
            });
});

userSchema.plugin(require('mongoose-bcrypt'));

const User = mongoose.model('User', userSchema);

module.exports = User;