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
        return res.status(400).json({ msg : 'No se pudo crear la ciudad' });
    }
    return res.status(200).json({ msg : 'Ciudad creada con exito' });
}


const getCities = async( req = request, res = response ) => {
    try {
        const cities = await City.find();
        if( !cities ) {
            return res.status(400).json({ msg : 'No se encontraron las ciudades' });
        }
        return res.status(200).json({
            cities
        });        
    } catch (error) {
        return res.status(400).json({ msg : 'No se encontraron las ciudades' });
    }
}

const getCityById = async ( req = request, res = response ) => {
    try {
        const { id } = req.params;
        const city = await City.findById( id );
        if( !city ) {
            return res.status(400).json({ msg : 'No se encontro la ciudad' });
        }
        return res.status(200).json({
            city
        });   
    } catch (error) {
        return res.status(400).json({ msg : 'No se encontro la ciudad' });
    }
}

module.exports = {
    createCity,
    getCities,
    getCityById
}