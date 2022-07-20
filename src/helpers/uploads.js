// * Importación de las dependencias;
const fs = require('fs');

//* Importación de los modelos
const Upload = require('../models/upload');

// * Función para eliminar los uplods de la base de datos
const deleteUploads = async ( listUploads = [] ) => {
    for (const upload of listUploads) {
        const deletedUplaod = await Upload.findByIdAndDelete( upload );
        if ( !deletedUplaod ) {
            return false;
        }
    }
    return true;
}

// * Función para organizar las imagenes para guardarlas en la base de datos
const organizeImage = ( file ) => {
    console.log( 'file -->', file );
    const content = convertFileToBase64( file.path );
    const name = file.originalname;
    const type = file.mimetype;
    return {
        content,name,type
    }
}

// * Función para convertir la imagen a base64
const convertFileToBase64 = ( path ) => {
    const buffer = fs.readFileSync( path );
    let bufferStr = JSON.stringify( buffer );
    console.log('type -->', typeof bufferStr);
    return bufferStr ;
}

module.exports = {
    deleteUploads,
    organizeImage,
    convertFileToBase64
}