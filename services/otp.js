// * Llamado de las dependencias
const otpGenerator = require('otp-generator');

const OTP_LENGTH = 6;
const OTP_CONFIG = {
    upperCaseAlphabets: true,
    specialChars: false,
}

// * Función para generar el codigo OTP que se envia por correo
const generateOTP = () => otpGenerator.generate( OTP_LENGTH, OTP_CONFIG );

module.exports = {
    generateOTP
};