const Report = require('../models/report');
const { request, response } = require('express');
const { errorHandler } = require('../helpers/error_handler');

let msg;
let errors;

const createReport = async ( req = request, res = response ) => {
    try {
        const { profile, description, ad } = req.body;
        const reportExists = await Report.findOne({ reporter: profile, ad });
        if( reportExists ) {
            msg = 'Ya ha reportado este anuncio';
            errors = errorHandler(msg);
            return res.status(400).json({ errors });
        }
        const reportNew = new Report({
            reporter: profile,
            description,
            ad
        });
        const reportSaved = await reportNew.save();
        if( !reportSaved ) {
            msg = 'No se pudo guardar el reporte';
            errors = errorHandler( msg ); 
            return res.status(500).json({ errors });
        }
        return res.status(200).json({
            msg: 'Se creo el reporte con exito'
        });
    } catch (error) {
        console.log(` ERROR CONTROLER GET ADS --> ${error} `)
        msg = 'No se pueden visualizar los anuncios';
        errors = errorHandler(msg);
        return res.status(500).json({ errors });
    }
}

module.exports = {
    createReport
}