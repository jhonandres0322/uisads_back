
// Importar Librerias
const axios = require('axios');
// * Funcion para validar las credenciales de Facebook

const validarFacebookIdTokenUser = async ( accessToken, userId) => {
    // Los CLIENT_ID se obtienen desde la consola de Google, hay que tener en cuenta que para cada plataforma sea web, android o ios se debe crear un CLIENT_ID, esto se hace en la consola de Google
    try {
        const { data } = await axios({
            url: `https://graph.facebook.com/${userId}`,
            method: 'get',
            params: {
                fields: ['id', 'name', 'email'].join(','),
                access_token: accessToken,
            },
        });// { id, email, first_name, last_name }
        return data;
    } catch (error) {
        // En caso de error el token no es valido
        return null;
    }
}

// middleware para validar el token de Google
module.exports = {
    validarFacebookIdTokenUser
}