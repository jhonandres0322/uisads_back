const Report = require('../models/report_model');
const { searchProfile } = require('../helpers/profile_helper');
const { request, response } = require('express');

const manageReport = async ( req = request, res = response ) => {
    try {
        const { ad } = req.body;
        const { user } = req;
        const profile = searchProfile( user._id );
        const reportExists = await Report.findOne({ reporter: profile._id, ad });
        if( reportExists ) {
            const reportDeleted = await Report.findByIdAndDelete( reportExists._id );
            if( !reportDeleted ) {
                return res.status(400).json({
                    msg: 'No se pudo eliminar el reporte'
                });
            }
            return res.status(200).json({
                msg: 'El reporte se ha eliminado correctamente',
            })
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
            msg: 'El reporte se ha creado correctamente',
        });
    } catch (error) {
        return res.status(404).json({ msg : `No se pueden visualizar los anuncios ${error}` });
    }
}

module.exports = {
    manageReport
}