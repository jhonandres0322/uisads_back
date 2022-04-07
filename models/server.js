// * Llamado de dependencias
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

// * Llamado de rutas
const profileRoutes = require('../routes/profile');
const adRoutes = require('../routes/ad');
const authRoutes = require('../routes/auth');
const categoryRoutes = require('../routes/category');
const uploadRoutes = require('../routes/upload');
const errorHandler = require('../middlewares/error_handler');

// * Llamado de la conexión a la base de datos
const MongoConnection = require('../database/db');
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

    // * Conexión a la base de datos
    async connectDatabase(){
        await new MongoConnection().connect();
    }
    
    // * Middlewares del servidor
    middlewares(){
        this.app.use( cors()) ;
        this.app.use( express.json() );
        this.app.use( express.urlencoded({ extended: true }) );
        this.app.use( morgan('dev') );
        this.app.use( errorHandler );
    }
    
    // * Rutas del servidor
    routes(){
        this.app.use(this.authPath, authRoutes);
        this.app.use(this.adPath, adRoutes);
        this.app.use(this.profilePath, profileRoutes);
        this.app.use(this.categoryPath, categoryRoutes);
        this.app.use(this.uploadPath, uploadRoutes);
    }

    // * Activación del servidor
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
