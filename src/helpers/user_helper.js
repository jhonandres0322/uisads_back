// * Importación de las dependencias
const bcryptjs = require('bcryptjs');
const User = require('../models/user_model');
const salt = bcryptjs.genSaltSync();

// * Función para validar el password de la base de datos
const validatePassword = ( passDB, passUser ) => bcryptjs.compareSync( passUser, passDB );

// * Función para crer el password de una cuenta
const createPassword = ( pass ) => bcryptjs.hashSync( pass, salt )

//  *Funcion para verificar un usuario y un email
const verifyUser = async( email ) => {
    // Si el usuario existe se procede a generar el token de autenticacion
    const user = await User.findOne({email});
    if ( !user ) {
        return res.status(401).json({ 
            error: true, 
            msg : `No existe una cuenta con el correo ${email}`
        });
    }
    // Verificar si el usuario se encuentra bloqueado
    if ( user.blocked ) {
        return res.status(400).json({ msg :  'El usuario se encuentra bloqueado' });
    }
    // Si el usuario esta activo en la base de datos
    if ( !user.state ) {
        return res.status(404).json({ msg : 'Usuario no encontrado' });
    }
    return user;   
}

module.exports = {
    validatePassword,
    createPassword,
    verifyUser
}