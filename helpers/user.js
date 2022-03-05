const bcryptjs = require('bcryptjs');


const validatePassword = ( passDB, passUser ) => {
    return bcryptjs.compareSync( passUser, passDB );
}

const createPassword = ( pass ) => {
    const salt = bcryptjs.genSaltSync();
    return bcryptjs.hashSync( pass, salt )
}

module.exports = {
    validatePassword,
    createPassword
}