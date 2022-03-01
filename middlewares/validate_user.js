const User = require('../models/user');


const isEmailExists = async ( email = '' ) => {
    const existsEmail = await User.findOne({ email });
    if( existsEmail ) {
        throw new Error(`El correo ${email} ya existe en la base de datos`);
    }
}

module.exports = {
    isEmailExists
}