//* Importación de los modelos
const Upload = require('../models/upload_model');

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
    const content = file.content;
    const name = file.name;
    const type = file.type;
    return {
        content, name, type
    }
}


module.exports = {
    deleteUploads,
    organizeImage,
}