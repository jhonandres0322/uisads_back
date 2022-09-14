// * Importación de dependencias
const { request, response } = require('express');

// * Importación de helpers
const { generarJWT } = require('../helpers/generate_jwt');
const { validatePassword, createPassword } = require('../helpers/user_helper');
const { createProfile } = require('../helpers/profile_helper');
const { validarGoogleIdToken } = require('../helpers/google_verify_token');
const { validarFacebookIdTokenUser } = require('../helpers/facebook_verify_token');

// * Importación de modelos
const User = require('../models/user_model');
const Profile = require('../models/profile_model');

// * Importación de servicios
const { generateOTP } = require('../services/otp_service');
const { sendEmail } = require('../services/mail_service');


// * Controlador para iniciar sesión en el servidor
const login = async (req = request,res = response ) => {
    const { email, password } = req.body;
    try {
        // Verificar si el email existe
        const user = await User.findOne({ email });
        if ( !user ) {
            return res.status(400).json({ msg : `No existe una cuenta con el correo ${email}` });
        }
        // Verificar si el usuario se encuentra bloqueado
        if ( user.blocked ) {
            return res.status(400).json({ msg :  'El usuario se encuentra bloqueado' });
        }
        // Si el usuario esta activo en la base de datos
        if ( !user.state ) {
            return res.status(404).json({ msg : 'Usuario no encontrado' });
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
            return res.status(400).json({ msg : 'Contraseña Incorrecta', error: true });
        }
        const token = await generarJWT( user._id );
        const lastEntry = new Date();
        await User.findByIdAndUpdate( user._id, {
            lastEntry,
            available: true,
            retry: 0,
            blocked : false
        });
        const profile = await Profile.findOne({user: user._id}).populate('image');
        const userEmail = await User.findById(user).select('email');
        res.json({
            msg: 'Inicio de sesión correcto',
            user,
            token,
            profile,
            email: userEmail,
            error: false
        });
    } catch (error) {
        return res.status(500).json({ msg : 'Error al loguearse' });
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
            return res.status(500).json({ msg : 'No se pudo crear el perfil' });
        }
        const token = await generarJWT( userSaved._id );
        const profileSaved = await createProfile(req, res, userSaved );
        if( !profileSaved ) {
            return res.status(404).json({ msg : 'No se pudo crear el perfil' });
        }
        return res.status(200).json({
            msg: 'Usuario Creado con Exito',
            token,
            user: userSaved,
            profile: profileSaved,
            error: false
        });
    } catch (error) {
        return res.status(500).json({ msg : 'No se pudo crear el perfil' });
    }
}

// * Controlador para cambiar la contraseña
const changePassword = async ( req = request, res = response ) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const { user } = req;
        const userPass = await User.findOne( { email: user.email } ).select('password');
        const isPassword = validatePassword( userPass.password, oldPassword ); 
        if ( !isPassword ) {
            return res.status(400).json({ msg : 'La contraseñas no coinciden' });
        }
        const password = createPassword( newPassword );
        const userUpdated = await User.findByIdAndUpdate( userPass._id, {
            password
        });
        if ( !userUpdated ) {
            return res.status(400).json({ msg : 'No se pudo guardar la nueva contraseña' });
        }
        return res.status(200).json({  msg: 'Contraseña cambiada con exito' });
    } catch (error) {
        return res.status(500).json({ msg : 'Problemas para cambiar la contraseña' });
    }
}

// * Controlador para enviar mensaje otp para la recuperación de la contraseña
const forgotPassword = async ( req = request, res = response ) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if ( !user ) {
            return res.status(400).json({ msg : 'Usuario no encontrado' });
        }
        const otp = generateOTP();
        const userUpdated = await User.findByIdAndUpdate( user._id, {
            otp
        });
        if ( !userUpdated ) {
            return res.status(400).json({ msg : 'Problemas para generar el codigo' });
        }
        const sentEmail = await sendEmail({
            email: user.email,
            OTP: otp
        });
        if ( !sentEmail ) {
            return res.status(500).json({ msg : 'No se pudo enviar el mensaje con el codigo' });
        }
        res.status(200).json({ msg: 'Mensaje enviado con exito. Por favor revisar el correo electronico' });
    } catch (error) {
        return res.status(500).json({ msg : 'No se pudo generar el codigo de verificación' });
    }
}

// * Controlador para validar el codigo OTP
const validateCodeOTP = async ( req = request, res = response ) => {
    try {
        const { otp, email } = req.body;
        const user = await User.findOne({otp, email});
        if ( !user ) {
            return res.status(400).json({ msg : 'Codigo Invalido' });
        }
        const userUpdated = await User.findByIdAndUpdate( user._id, {
            otp: null
        });
        if ( !userUpdated ) {
            return res.status(400).json({ msg : 'Problemas para validar el codigo' });
        }
        res.status(200).json({ msg: 'Codigo valido' });
    } catch (error) {
        return res.status(500).json({ msg : 'Problemas para validar el codigo' });
    }
}
// * Controlador para validar authenticacion con Google
const loginGoogleAuth = async ( req = request, res = response ) => {
    
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ 
                ok: false,
                msg: 'No se recibio el token en la peticion' 
            });
        }
        // Verificacion Token de Google
        const googleUser = await validarGoogleIdToken( token );
        // Se verifica si es diferente de nulo para revisar el procesamiento del token si fue o no valido
        if (!googleUser) {
            return res.status(400).json({
                ok: false,
                msg: 'Token de google no valido'
            });
        }
        // Se verifica si el usuario existe en la base de datos para el inicio de sesion
        const user = await User.findOne({ email: googleUser.email });
        // Si el usuario existe se procede a generar el token de autenticacion
        if ( !user ) {
            return res.status(401).json({ 
                error: true, 
                msg : `No existe una cuenta con el correo ${googleUser.email}`
            });
        }
        // Verificar si el usuario se encuentra bloqueado
        if ( user.blocked ||  !user.state ) {
            return res.status(404).json({ msg :  'El usuario se encuentra bloqueado, Contacte al administrador' });
        }
        const tokenJWT = await generarJWT( user._id );
        const lastEntry = new Date();
        await User.findByIdAndUpdate( user._id, {
            lastEntry,
            available: true,
            retry: 0,
            blocked : false
        });
        const profile = await Profile.findOne({user: user._id}).populate('image');
        res.json({
            msg: 'Inicio de sesión correcto por medio de Google',
            user,
            token: tokenJWT,
            profile,
            email: user.email,
            error: false
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'No se pudo ingresar al aplicativo'
        });
    }
}

const loginFacebookAuth = async ( req = request, res = response ) => {

    try {
        const { token, userId } = req.body;
        if (!token) {
            return res.status(400).json({
                ok: false,
                msg: 'No se recibio el token en la peticion'
            });
        }
        if (!userId) {
            return res.status(400).json({
                ok: false,
                msg: 'No se recibio el id del usuario en la peticion'
            });
        }

        // Verificacion Token de Facebook
        const facebookUser = await validarFacebookIdTokenUser( token, userId );
        // Se verifica si es diferente de nulo para revisar el procesamiento del token si fue o no valido
        if (!facebookUser) {
            return res.status(400).json({
                ok: false,
                msg: 'Token de facebook no valido, por favor verifique'
            });
        }
        // Se verifica si el usuario existe en la base de datos para el inicio de sesion
        const user = await User.findOne({ email: facebookUser.email });
        //  // Si el usuario existe se procede a generar el token de autenticacion
        if ( !user ) {
            return res.status(401).json({ 
                error: true, 
                msg : `No existe una cuenta con el correo ${facebookUser.email}`
            });
        }
        // Verificar si el usuario se encuentra bloqueado
        if ( user.blocked ||  !user.state ) {
            return res.status(404).json({ msg :  'El usuario se encuentra bloqueado, Contacte al administrador' });
        }
        const tokenJWT = await generarJWT( user._id );
        const lastEntry = new Date();
        await User.findByIdAndUpdate( user._id, {
            lastEntry,
            available: true,
            retry: 0,
            blocked : false
        });
        const profile = await Profile.findOne({user: user._id}).populate('image');
        res.json({
            msg: 'Inicio de sesión correcto por medio de Facebook',
            user,
            token: tokenJWT,
            profile,
            email: user.email,
            error: false
        });
        res.json({
            token,
            userId,
            msg: 'Inicio de sesión correcto por medio de Facebook'
        });
    } catch (error) {
        console.log(' CONTROLLER LOGIN  FACEBOOK -->', error );
        return res.status(500).json({
            msg: 'No se pudo ingresar al aplicativo'
        });
    }
}
const loginGuest = async ( req = request, res = response ) => {

    console.log(' CONTROLLER LOGIN GUEST  -->', error );
    return res.status(500).json({
        msg: 'Error al autenticar'
    });
    
}

module.exports = {
    login,
    registerUser,
    changePassword,
    forgotPassword,
    validateCodeOTP,
    loginGoogleAuth,
    loginFacebookAuth,
    loginGuest
}

