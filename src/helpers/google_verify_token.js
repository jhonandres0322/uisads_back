
// Se importa la libreria de Google
const {OAuth2Client} = require('google-auth-library');

const CLIENT_ID_1 = process.env.GOOGLE_CLIENT_ID_1; 
const CLIENT_ID_2 = process.env.GOOGLE_CLIENT_ID_2; 
// El CLIENT_ID se obtiene desde la consola de Google
const client = new OAuth2Client(CLIENT_ID_1);

// * Funcion para validar el token de Google
// Se envia el token de Google desde el cliente y validara si es valido
const validarGoogleIdToken = async ( token) => {

    // Los CLIENT_ID se obtienen desde la consola de Google, hay que tener en cuenta que para cada plataforma sea web, android o ios se debe crear un CLIENT_ID, esto se hace en la consola de Google
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: [
                CLIENT_ID_1,
                CLIENT_ID_2
            ],  
        });
        const payload = ticket.getPayload();
        // console.log(' PAYLOAD -->', payload );
        return {
            name: payload['name'],
            picture: payload['picture'],
            email: payload['email'],
        }
    } catch (error) {
        // En caso de error el token no es valido
        return null;
    }
}

module.exports = {
    validarGoogleIdToken
}