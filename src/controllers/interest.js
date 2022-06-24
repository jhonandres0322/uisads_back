const { request, response } = require('express');


const createInterest = async ( req = request, res = response ) => {
    try {
        
    } catch (error) {
        console.log(' CONTROLLER CREATE INTEREST  -->', error );
        return res.status(500).json({
            msg: 'No se pudo ingresar al aplicativo'
        });
    }
}

const getInterests = async ( req = request, res = response ) => {
    try {
        
    } catch (error) {
        console.log(' CONTROLLER GET INTERESTS  -->', error );
        return res.status(500).json({
            msg: 'No se pudo ingresar al aplicativo'
        });
    }
}

const removeInterests = async ( req = request, res = response ) => {
    try {
        
    } catch (error) {
        console.log(' CONTROLLER GET INTERESTS  -->', error );
        return res.status(500).json({
            msg: 'No se pudo ingresar al aplicativo'
        });
    }
}

module.exports = {
    createInterest,
    getInterests,
    removeInterests
}