// * Importación de las dependencias
const jwt = require('jsonwebtoken');

// * Función para generar el token de usuario
const generarJWT = ( uid = '' ) => {
    return new Promise( (resolve, reject) => {
        const payload = { uid };
        jwt.sign( payload, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRES_TIME
        }, (error, token) => {
            if ( error ) {
                reject('No se pudo generar el token');
            } else {
                resolve( token );
            }
        } );
    });
}

module.exports = {
    generarJWT
};