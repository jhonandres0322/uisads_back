// * Llamado de las dependencias
const bcryptjs = require('bcryptjs');

const salt = bcryptjs.genSaltSync();

// * Función para validar el password de la base de datos
const validatePassword = ( passDB, passUser ) => bcryptjs.compareSync( passUser, passDB );

// * Función para crer el password de una cuenta
const createPassword = ( pass ) => bcryptjs.hashSync( pass, salt )

module.exports = {
    validatePassword,
    createPassword
}