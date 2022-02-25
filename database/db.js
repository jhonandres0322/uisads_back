const mongoose = require('mongoose');

class MongoConnection {
    
    constructor() {
        this.URI = process.env.MONGO_URI_DEV;
    }

    async connect () {
        try {
            const connection = await mongoose.connect( this.URI );
            console.log(`The database is running successfully in ${connection.connection.host}`)
        }
        catch(error){
            throw new Error(`Error while initializing the database: ${error}`);
        }
    }
}

module.exports = MongoConnection;