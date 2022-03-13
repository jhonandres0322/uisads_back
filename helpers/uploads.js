// * Llamado de las dependencias;
const fs = require('fs');

//* Llamado de los modelos
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
    const content = convertFileToBase64( file.path );
    const fileNameParts = file.originalname.split('.');
    const name = fileNameParts[0];
    const type = fileNameParts[1];
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