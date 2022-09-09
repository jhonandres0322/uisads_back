const Report = require('../models/report_model');
const { searchProfile } = require('../helpers/profile_helper');
const { request, response } = require('express');

const createReport = async ( req = request, res = response ) => {
    try {
        const { ad } = req.body;
        const { user } = req;
        const profile = searchProfile( user._id );
        const reportExists = await Report.findOne({ reporter: profile._id, ad });
        if( reportExists ) {
            return res.status(400).json({ msg : 'Ya ha reportado este anuncio!' });
        }
        const reportNew = new Report({
            reporter: profile._id,
            ad
        });
        const reportSaved = await reportNew.save();
        if( !reportSaved ) {
            return res.status(400).json({ msg : 'No se pudo guardar el reporte' });
        }
        return res.status(200).json({
            msg: 'Se creo el reporte con exito'
        });
    } catch (error) {
        return res.status(404).json({ msg : `No se pueden visualizar los anuncios ${error}` });
    }
}

module.exports = {
    createReport
}