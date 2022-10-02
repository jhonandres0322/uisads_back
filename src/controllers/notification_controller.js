const Profile = require('../models/profile_model');
const Ad = require('../models/ad_model');

const sendNotifications = async ( req = request, res = response ) => {
    try {
        const { user } = req;
        const profile = await Profile.findOne({ user : user._id });
        if ( !profile ) {
            return res.status(404).json({ msg : 'No se pudo enviar la notificación.' });
        }
        const notifications = profile.notifications;
        const query = {
            state: true,
            visible: true,
            id: {
                $in: notifications
            }
        }
        const options = {
            page,
            limit: process.env.PAGE_SIZE,
            select: 'title main_page createdAt category score publisher',
            sort,
            populate: 'main_page'
        };
        const ads = await Ad.paginate(query,options);
        res.status(200).json({
            notifications: ads.docs,
            totalRows: ads.docs.length
        });
        res.status(200).json({
            msg: 'Notificación enviada con exito'
        });
    
    } catch (error) {
        console.log(' CONTROLLER SEND NOTIFICATIONS -->', error );
        return res.status(500).json({
            msg: 'No se pudo ingresar al aplicativo'
        });
    }
} 

const manageNotifications = async ( req = request, res = response ) => {
    try {
        const { choice } = req.body;
        const { user } = req;
        const profileUpdated = await Profile.findOneAndUpdate( { user : user._id } ,{
            isNotify: choice == 'active' ? true : false 
        });
        if ( !profileUpdated ) {
            return res.status(404).json({ msg : 'No se pudo actualizar la configuración de notificaciones.' });
        }
        res.status(200).json({
            msg: 'Configuración de notificaciones actualizada con exito'
        });
    } catch (error) {
        console.log(' CONTROLLER DISABLED NOTIFICATIONS -->', error );
        return res.status(500).json({
            msg: 'No se pudo ingresar al aplicativo'
        });
    }
}

module.exports = {
    sendNotifications,
    manageNotifications
}