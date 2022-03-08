const otpGenerator = require('otp-generator');
const OTP_LENGTH = 6;
const OTP_CONFIG = {
    upperCaseAlphabets: true,
    specialChars: false,
}

const generateOTP = () => {
    return otpGenerator.generate( OTP_LENGTH, OTP_CONFIG );
}


module.exports = {
    generateOTP
};