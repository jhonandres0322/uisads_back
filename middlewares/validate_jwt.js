const { response, request } = require('express');

const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateJWT = async ( req = request,res = response, next) => {
    const token = req.header("access-token");
    if ( !token ) {
        return res.status(400).json({
            msg: 'No hay token en la petición'
        });
    }
    try {
        const { uid } = jwt.verify( token, process.env.SECRET_KEY );
        // Leer al usuario
        const userAuth = await User.findById(uid);
        if( !userAuth ) {
            return res.status(401).json({
                msg: 'Token no valido'
            });
        }
        // Verificar si el uid tiene estado true
        if( !userAuth.state ) {
            return res.status(401).json({
                msg: 'Token no valido'
            });
        }
        req.user = userAuth;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        });
    }
    
}

module.exports = {
    validateJWT
}