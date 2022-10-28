const Profile = require('../models/profile_model');
const Ad = require('../models/ad_model');

const validateNotifcations = async ( req = request, res = response ) => {
    try {
        const { user } = req;
        const profile = await Profile.findOne({ user : user._id });
        if ( !profile ) {
            return res.status(404).json({ msg : 'No se pudo enviar la notificación.'});
        }
        const isNotify = profile.isNotify;
        if( !isNotify ) {
            return res.status(200).json({
                msg : 'Las notificaciones se encuentran desactivadas',
            });
        }
        
        const notifications = profile.notifications;
        if( notifications.length == 0 ) {
            return res.status(200).json({
                msg : 'No tiene notificaciones nuevas',
            });
        }
        return res.status(200).json({
            msg : 'Tiene notificaciones nuevas',
        });
    } catch (error) {
        console.log(' CONTROLLER VALIDATE NOTIFICATIONS  -->', error );
        return res.status(500).json({
            msg: 'No se pudo ingresar al aplicativo'
        });
    }
}

const getNotifications = async ( req = request, res = response ) => {
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
            return res.status(404).json({ msg : 'No se pudo actualizar la configuración de notificaciones.', error: true });
        }
        res.status(200).json({
            msg: 'Configuración de notificaciones actualizada con exito',
            error: false
        });
    } catch (error) {
        console.log(' CONTROLLER DISABLED NOTIFICATIONS -->', error );
        return res.status(500).json({
            msg: 'No se pudo ingresar al aplicativo',
            error: true
        });
    }
}

module.exports = {
    getNotifications,
    manageNotifications,
    validateNotifcations
}