const errorHandler = (err,req,res,next) => {

    res.status(500).json({
        mensaje: err.message
    })
}

module.exports = errorHandler