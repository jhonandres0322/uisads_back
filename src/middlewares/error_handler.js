
// * Middleware para manejo de errores en el servidor
const errorHandler = (err,req,res,next) => res.status(500).json({ msg: err.message })

module.exports = errorHandler