const mongoose = require('mongoose');

const dbName = 'places_api';

module.exports = {
    connect: () => mongoose.connect(`mongodb://localhost/${dbName}`, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }),
    dbName, // dbName: dbName (shorthand properties)
    connection: () => {
        if(mongoose.connection)
            return mongoose.connection;
        return this.connect()
    }
}