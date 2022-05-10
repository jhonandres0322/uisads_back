

const errorHandler = ( msg, param ) => {
    const errors = [];
    const error = { msg, param };
    errors.push( error );
    return errors;
}


module.exports = {
    errorHandler
};