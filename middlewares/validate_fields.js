// * Llamado de las dependencias
const { validationResult } = require("express-validator");

// * Middleware para validar los campos que sone evaluados con 
// * la dependencia express-validator
const validateFields = ( req , res , next ) => {
    const errors = validationResult(req);
    if( !errors.isEmpty() ) {
        return res.status(400).json(errors);
    } else {
        next();
    }
}

module.exports = {
    validateFields
}