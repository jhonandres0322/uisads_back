// * Importación de las dependencias
const { response, request } = require('express');

// * Importación de los modelos
const Upload = require('../models/upload_model');

// * Controlador para eliminar una imagen
const deleteUpload = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const deleteUpload = await Upload.findByIdAndDelete(id);
        if ( !deleteUpload ) {
            return res.status(404).json({ msg : 'No se pudo calcular la califación del usuario.' });
        }
        res.status(200).json({ msg: 'Imagen eliminada con exito' });
    } catch (error) {
        return res.status(500).json({ msg : 'No se pudo eliminar las imagenes.' });
    }
}


module.exports = {
    deleteUpload
}