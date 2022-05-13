

const errorHandler = ( msg, param ) => {
    const errors = [];
    const error = { msg };
    if ( param ) error.param = param 
    errors.push( error );
    return errors;
}


module.exports = {
    errorHandler
};