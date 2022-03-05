const { request, response } = require('express');
const User = require('../models/user');
const { generarJWT } = require('../helpers/generate_jwt');
const { validatePassword, createPassword } = require('../helpers/user');

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
        const isPassword = validatePassword( user.password, password );
        if ( !isPassword ) {
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
        userCreated.password = createPassword( password );
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

const changePassword = async ( req = request, res = response ) => {
    try {
        const { passwordOld, passwordNew } = req.body;
        const { user } = req;
        const userPass = await User.findOne( { email: user.email } ).select('password');
        const isPassword = validatePassword( userPass.password, passwordOld ); 
        if ( !isPassword ) {
            return res.status(400).json({
                msg: 'La antigua contraseña esta mal'
            });
        }
        const password = createPassword( passwordNew );
        console.log( password );
        const userUpdated = await User.findByIdAndUpdate( userPass._id, {
            password
        });
        console.log(userUpdated);
        if ( !userUpdated ) {
            return res.status(400).json({
                msg: 'No se pudo guardar la nueva contraseña'
            });
        }
        return res.status(200).json({
            msg: 'Contraseña cambiada con exito'
        });
    } catch (error) {
        console.log('CONTROLLER CHANGE PASSWORD -->', error);
        return res.status(500).json({
            msg: 'Problemas para cambiar la contraseña'
        })
    }
}


module.exports = {
    login,
    registerUser,
    changePassword
}

