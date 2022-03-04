const Upload = require('../models/upload');
const fs = require('fs');
const lz = require('lz-string');

const deleteUploads = async ( listUploads = [] ) => {
    try {
        for (const upload of listUploads) {
            await Upload.findByIdAndDelete( upload );
        }
        return true;
    } catch (error) {
        console.log( "error -->", error);
        throw new Error('No se pueden eliminar los archivos'); 
    }
}

const organizeImage = ( file ) => {
    const content = convertFileToBase64( file.path );
    const fileNameParts = file.originalname.split('.');
    const name = fileNameParts[0];
    const type = fileNameParts[1];
    return {
        content,name,type
    }
}

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