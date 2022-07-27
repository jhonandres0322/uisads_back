// * Importación de las depedencias
const { response, request } = require('express');
const jwt = require('jsonwebtoken');

// * Importación del modelo
const User = require('../models/user');

// * Middleware que valida un token enviado desde el request
// * Ademas valida si el usuario se encuentra registrado
const validateJWT = async ( req = request,res = response, next) => {
    const token = req.header("access-token");
    if ( !token ) {
        return res.status(400).json({ msg: 'No hay token en la petición' });
    }
    try {
        const { uid } = jwt.verify( token, process.env.JWT_SECRET_KEY );
        const userAuth = await User.findById(uid);
        if( !userAuth ) {
            return res.status(401).json({ msg: 'Token no valido' });
        }
        if( !userAuth.state ) {
            return res.status(401).json({ msg: 'Token no valido' });
        }
        req.user = userAuth;
        console.log('validado el token');
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token no valido' });
    }
    
}

module.exports = {
    validateJWT
}