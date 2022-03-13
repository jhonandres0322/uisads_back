const mongoose = require('mongoose');

//* Clase para realizar la conexión con MongoDB
class MongoConnection {
    
    constructor() {
        if ( process.env.NODE_ENV === 'development' ) {
            this.URI = process.env.MONGO_URI_DEV;
        } else {
            this.URI = process.env.MONGO_URI_PRD;
        }
    }

    // * Metodo para realizar la conexión
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