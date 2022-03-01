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



module.exports = {
    deleteUploads
}