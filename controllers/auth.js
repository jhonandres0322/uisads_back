const { request, response } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');
const { generarJWT } = require('../helpers/generate_jwt');

const login = async (req = request,res = response ) => {
    const { email, password } = req.body;
    try {
        // Verificar si el email existe
        const user = await User.findOne({ email });
        if ( !user ) {
            return res.status(400).json({
                msg: `No existe una cuenta con el correo ${email}`
            });
        }
        // Verificar si el usuario se encuentra bloqueado
        if ( user.blocked ) {
            return res.status(400).json({
                msg: 'El usuario se encuentra bloqueado'
            })
        }
        // Si el usuario esta activo en la base de datos
        if ( !user.state ) {
            return res.status(400).json({
                msg: 'Usuario no encontrado'
            });
        }
        // Verificar la contraseña
        const validatePassword = bcryptjs.compareSync(password, user.password );
        if ( !validatePassword ) {
            user.retry++;
            await User.findByIdAndUpdate( user._id, {
                retry: user.retry
            });
            if( user.retry == 5 ) {
                await User.findByIdAndUpdate( user._id, {
                    retry: 0,
                    blocked: true
                });
            } 
            return res.status(400).json({
                msg: 'Contraseña Incorrecta'
            });
        }
        const token = await generarJWT( user._id     );
        const lastEntry = new Date();
        await User.findByIdAndUpdate( user._id, {
            lastEntry,
            available: true
        });
        res.json({
            msg: 'Login Ok',
            user,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: `500 - SERVER ERROR`
        });
    }
}

const registerUser = async (req = request,res = response ) => {
    const { email, password } = req.body;
    try {
        const userCreated = new User();
        userCreated.email = email;
        const salt = bcryptjs.genSaltSync();
        userCreated.password = bcryptjs.hashSync( password, salt );
        const userSaved = await userCreated.save();
        if( !userSaved ) {
            return res.status(500).json({
                msg: 'No se pudo guardar el usuario'
            });
        }
        return res.status(200).json({
            msg: 'Usuario Creado con Exito'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: `500 - SERVER ERROR`
        });
    }
}


module.exports = {
    login,
    registerUser
}
