const Upload = require('../models/upload');


deleteUploads = async ( listUploads = [] ) => {
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

organizeImage = ( file ) => {
    const content = file.buffer;
    const fileNameParts = file.originalname.split('.');
    const name = fileNameParts[0];
    const type = fileNameParts[1];
    return {
        content,name,type
    }
}



module.exports = {
    deleteUploads,
    organizeImage
}