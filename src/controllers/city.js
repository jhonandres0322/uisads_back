const City = require('../models/city');
const { request, response } = require('express');
const { errorHandler } = require("../helpers/error_handler");

const createCity = async ( req = request, res = response ) => {
    const { name } = req.body;
    const newCity = new City({
        name
    });
    const citySaved = await newCity.save();
    if( !citySaved ) {
        msg = 'No se pudo crear la ciudad';
        errors = errorHandler( msg );
        return res.status(400).json({ errors });
    }
    return res.status(200).json({
        msg : 'Ciudad creada con exito'
    });
}


const getCities = async( req = request, res = response ) => {
    const cities = await City.find();
    if( !cities ) {
        msg = 'No se pudo crear la ciudad';
        errors = errorHandler( msg );
        return res.status(400).json({ errors });
    }
    return res.status(200).json({
        cities
    });
}

module.exports = {
    createCity,
    getCities
}