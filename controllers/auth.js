// * Llamado de dependencias
const { request, response } = require('express');

// * Llamado de helpers
const { generarJWT } = require('../helpers/generate_jwt');
const { validatePassword, createPassword } = require('../helpers/user');
const { errorHandler } = require('../helpers/error_handler');

// * Llamado de modelos
const User = require('../models/user');

// * Llamado de servicios
const { generateOTP } = require('../services/otp');
const { sendEmail } = require('../services/mail');

// * Controlador para iniciar sesión en el servidor
const login = async (req = request,res = response ) => {
    const { email, password } = req.body;
    try {
        // Verificar si el email existe
        const user = await User.findOne({ email });
        if ( !user ) {
            const msg = `No existe una cuenta con el correo ${email}`;
            const errors = errorHandler( msg, 'email');
            return res.status(400).json({ errors });
        }
        // Verificar si el usuario se encuentra bloqueado
        if ( user.blocked ) {
            const msg = 'El usuario se encuentra bloqueado';
            const errors = errorHandler( msg, 'blocked');
            return res.status(400).json({ errors });
        }
        // Si el usuario esta activo en la base de datos
        if ( !user.state ) {
            const msg = 'Usuario no encontrado';
            const errors = errorHandler( msg, 'state');
            return res.status(404).json({ errors });
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
            const msg = 'Contraseña Incorrecta';
            const errors = errorHandler( msg, 'password');
            return res.status(400).json( errors );
        }
        const token = await generarJWT( user._id );
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
        const msg = 'Error al loguearse';
        const errors = errorHandler(msg,'server');
        return res.status(500).json( errors );
    }
}

// * Controlador para registrar usuarios en la plataforma
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
        const token = await generarJWT( userSaved._id );
        return res.status(200).json({
            msg: 'Usuario Creado con Exito',
            token,
            userSaved
        });
    } catch (error) {
        console.log('ERROR CONTROLER REGISTER USER -->', error);
        return res.status(500).json({
            msg: 'No se pudo guardar el usuario'
        });
    }
}

// * Controlador para cambiar la contraseña
const changePassword = async ( req = request, res = response ) => {
    try {
        const { passwordOld, passwordNew } = req.body;
        const { user } = req;
        const userPass = await User.findOne( { email: user.email } ).select('password');
        const isPassword = validatePassword( userPass.password, passwordOld ); 
        if ( !isPassword ) {
            return res.status(400).json({
                msg: 'La contraseñas no coinciden'
            });
        }
        const password = createPassword( passwordNew );
        const userUpdated = await User.findByIdAndUpdate( userPass._id, {
            password
        });
        if ( !userUpdated ) {
            return res.status(400).json({
                msg: 'No se pudo guardar la nueva contraseña'
            });
        }
        return res.status(200).json({
            msg: 'Contraseña cambiada con exito'
        });
    } catch (error) {
        console.log('ERROR CONTROLLER CHANGE PASSWORD -->', error);
        return res.status(500).json({
            msg: 'Problemas para cambiar la contraseña'
        })
    }
}

// * Controlador para enviar mensaje otp para la recuperación de la contraseña
const forgotPassword = async ( req = request, res = response ) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if ( !user ) {
            return res.status(400).json({
                msg: 'Usuario no encontrado'
            });
        }
        const otp = generateOTP();
        const userUpdated = await User.findByIdAndUpdate( user._id, {
            otp
        });
        if ( !userUpdated ) {
            return res.status(400).json({
                msg: 'Problemas para generar el codigo'
            });
        }
        const sentEmail = await sendEmail({
            email: user.email,
            OTP: otp
        });
        if ( !sentEmail ) {
            return res.status(500).json({
                msg: 'No se pudo enviar el mensaje con el codigo'
            });
        }
        res.status(200).json({
            msg: 'Mensaje enviado con exito. Por favor revisar el correo electronico'
        });
    } catch (error) {
        console.log('ERROR CONTROLLER FORGOT PASSWORD -->', error);
        return res.status(500).json({
            msg: 'No se pudo generar el codigo de verificación'
        });
    }
}

// * Controlador para validar el codigo OTP
const validateCodeOTP = async ( req = request, res = response ) => {
    try {
        const { otp, email } = req.body;
        const user = await User.findOne({otp, email});
        if ( !user ) {
            return res.status(400).json({
                msg: 'OTP invalido'
            });
        }
        res.status(200).json({
            msg: 'Codigo valido'
        });
    } catch (error) {
        console.log(' CONTROLLER VALIDATE OTP -->', error );
        return res.status(500).json({
            msg: 'No se pudo validar el codigo'
        });
    }
}

module.exports = {
    login,
    registerUser,
    changePassword,
    forgotPassword,
    validateCodeOTP
}

