// Modelo intermediario relacion muchos a muchos 
// 1 usuario tiene muchos lugares favoritos y un lugar puede ser el favorito de muchos usuarios

const mongoose = require('mongoose');

let favoriteSchema = new mongoose.Schema({
    _user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    _place:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
        required: true
    }
});

const FavoritePlace = mongoose.model('FavoritePlace', favoriteSchema);

module.exports = FavoritePlace;