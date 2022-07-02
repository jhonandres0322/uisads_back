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
const { createProfile } = require('../helpers/profile');

let msg;
let errors;

// * Controlador para iniciar sesión en el servidor
const login = async (req = request,res = response ) => {
    const { email, password } = req.body;
    try {
        // Verificar si el email existe
        const user = await User.findOne({ email });
        if ( !user ) {
            msg = `No existe una cuenta con el correo ${email}`;
            errors = errorHandler( msg, 'email');
            return res.status(400).json({ errors });
        }
        // Verificar si el usuario se encuentra bloqueado
        if ( user.blocked ) {
            msg = 'El usuario se encuentra bloqueado';
            errors = errorHandler( msg, 'blocked');
            return res.status(400).json({ errors });
        }
        // Si el usuario esta activo en la base de datos
        if ( !user.state ) {
            msg = 'Usuario no encontrado';
            errors = errorHandler( msg, 'state');
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
            msg = 'Contraseña Incorrecta';
            errors = errorHandler( msg, 'password');
            return res.status(400).json({ errors });
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
        msg = 'Error al loguearse';
        errors = errorHandler(msg,'server');
        return res.status(500).json({ errors });
    }
}

// * Controlador para registrar usuarios en la plataforma
const registerUser = async (req = request,res = response ) => {
    const { email, password } = req.body;
    try {
        console.log("email controller -->",email);
        const userCreated = new User();
        userCreated.email = email;
        userCreated.password = createPassword( password );
        const userSaved = await userCreated.save();
        if( !userSaved ) {
            msg = 'No se pudo guardar el anuncio';
            errors = errorHandler( msg );
            return res.status(500).json({ errors });
        }
        const token = await generarJWT( userSaved._id );
        const profileSaved = await createProfile(req, res, userSaved );
        if( !profileSaved ) {
            msg = 'No se pudo crear el perfil';
            errors = errorHandler( msg );
            return res.status(404).json({ errors });
        }
        return res.status(200).json({
            msg: 'Usuario Creado con Exito',
            token,
            user: userSaved,
            profile: profileSaved
        });
    } catch (error) {
        console.log('ERROR CONTROLER REGISTER USER -->', error);
        msg = 'No se pudo guardar el usuario';
        errors = errorHandler( msg );
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
            msg = 'La contraseñas no coinciden'
            errors = errorHandler( msg );
            return res.status(400).json({ errors });
        }
        const password = createPassword( passwordNew );
        const userUpdated = await User.findByIdAndUpdate( userPass._id, {
            password
        });
        if ( !userUpdated ) {
            msg = 'No se pudo guardar la nueva contraseña';
            errors = errorHandler( msg );
            return res.status(400).json({ errors });
        }
        return res.status(200).json({
            msg: 'Contraseña cambiada con exito'
        });
    } catch (error) {
        console.log('ERROR CONTROLLER CHANGE PASSWORD -->', error);
        msg = 'Problemas para cambiar la contraseña';
        errors = errorHandler( msg );
        return res.status(500).json({ msg });
    }
}

// * Controlador para enviar mensaje otp para la recuperación de la contraseña
const forgotPassword = async ( req = request, res = response ) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if ( !user ) {
            msg = 'Usuario no encontrado';
            errors =  errorHandler( msg );
            return res.status(400).json({ errors });
        }
        const otp = generateOTP();
        const userUpdated = await User.findByIdAndUpdate( user._id, {
            otp
        });
        if ( !userUpdated ) {
            msg = 'Problemas para generar el codigo';
            errors = errorHandler( msg );
            return res.status(400).json({ errors });
        }
        const sentEmail = await sendEmail({
            email: user.email,
            OTP: otp
        });
        if ( !sentEmail ) {
            msg = 'No se pudo enviar el mensaje con el codigo';
            errors = errorHandler( msg );
            return res.status(500).json({ errors });
        }
        res.status(200).json({
            msg: 'Mensaje enviado con exito. Por favor revisar el correo electronico'
        });
    } catch (error) {
        console.log('ERROR CONTROLLER FORGOT PASSWORD -->', error);
        msg = 'No se pudo generar el codigo de verificación';
        errors = errorHandler( msg );
        return res.status(500).json({ errors });
    }
}

// * Controlador para validar el codigo OTP
const validateCodeOTP = async ( req = request, res = response ) => {
    try {
        const { otp, email } = req.body;
        const user = await User.findOne({otp, email});
        if ( !user ) {
            msg = 'OTP Invalido';
            errors = errorHandler( msg );
            return res.status(400).json({ errors });
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

