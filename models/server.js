const express = require('express');
const cors = require('cors');
const MongoConnection = require('../database/db');
const authRoutes = require('../routes/auth');
const adRoutes = require('../routes/ad');
const profileRoutes = require('../routes/profile');
const morgan = require('morgan');
const path = require('path');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        // Paths Route
        this.adPath = '/api/ad';
        this.authPath = '/api/auth';
        this.categoryPath = '/api/category';
        this.profilePath = '/api/profile';
        this.ratingPath = '/api/rating';
        this.uploadPath = '/api/upload';
        // Connection Database
        this.connectDatabase();
        // Middlewares
        this.middlewares();
        // App Routes
        this.routes();
    }

    async connectDatabase(){
        await new MongoConnection().connect();
    }
    

    middlewares(){
        this.app.use( cors()) ;
        this.app.use( express.json() );
        this.app.use( express.urlencoded({ extended: true }) );
        this.app.use('/public', express.static(path.join(__dirname, '/public')));
        this.app.use( morgan('dev') );
    }
    
    routes(){
        this.app.use(this.authPath, authRoutes);
        this.app.use(this.adPath, adRoutes);
        this.app.use(this.profilePath, profileRoutes );
    }

    listen(){
        this.app.listen( this.port, () => {
            console.log(`Server running on port ${this.port}`);
        })
    }
}

module.exports = Server;

// Conclusiones
// Primero hablar sobre lo que se hizo y sus resultados
// Tomar cada objetivo especifico y comenzar a concluirlo
