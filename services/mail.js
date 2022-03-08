const nodemailer = require('nodemailer');

const MAIL_SETTINGS = {
    service: 'gmail',
    auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASSWORD
    }
}

const transporter = nodemailer.createTransport( MAIL_SETTINGS );

const sendEmail = async ( params ) => {
    try {
        let info = await transporter.sendMail({
            from: MAIL_SETTINGS.auth.user,
            to: params.email,
            subject: 'Codigo para cambio de contraseña',
            html: `
                <div
                    class="container"
                    style="max-width: 90%; margin: auto; padding-top: 20px"
                >
                <h2>Recuperación de contraseña.</h2>
                <p style="margin-bottom: 30px;">Por favor use este codigo para crear una nueva contraseña</p>
                <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${params.OTP}</h1>
                </div>
            `
        });
        return info;
    } catch (error) {
        console.log('ERROR SERVICE SEND EMAIL -->', error);
        return false;
    }
}


module.exports = {
    sendEmail
};