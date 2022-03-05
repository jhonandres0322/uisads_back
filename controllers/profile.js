const { request, response } = require("express");
const Profile = require('../models/profile');
const Ad = require('../models/ad');
const Rating = require('../models/rating');

const getProfile = async ( req = request, res = response ) => {
    try {
        const { id } = req.params;
        const profile = await Profile.findById( id )
                                    .populate('image')
                                    .populate('rating');
        if ( !profile ) {
            return res.status(400).json({
                msg: 'No se encntro el perfil'
            });
        }
        res.status(200).json({
            profile
        });
    } catch (error) {
        console.log('Controller Get Profile Error -->', error);
        return res.status(500).json({
            msg: 'No se pudo crear el perfil'
        })
    }
}


const createProfile = async (req = request, res = response ) => {
    try {
        const { name, cellphone, city } = req.body;
        const { user } = req;
        const { image } = req;
        const newProfile = new Profile({
            name,
            cellphone,
            city,
            user: user._id,
            image
        });
        const savedProfile = await newProfile.save();
        if( !savedProfile ) {
            return res.status(400).json({
                msg: 'No se pudo crear el perfil'
            });
        }
        res.status(200).json({
            msg: 'Perfil creado con exito',
            profile: savedProfile
        });
    } catch (error) {
        console.log('Controller Create Profile Error -->', error);
        return res.status(500).json({
            msg: 'No se pudo crear el perfil'
        })
    }
}

const updateProfile = async ( req = request, res = response ) => {
    try {
        const { id } = req.params;
        const { name, cellphone, city } = req.body;
        const { user } = req;
        const { image } = req;
        const updatedProfile = await Profile.findByIdAndUpdate( id, {
            name, cellphone, city, user : user._id, image 
        });
        if ( !updatedProfile ) {
            return res.status(400).json({
                msg: 'No se pudo crear el perfil'
            });
        }
        res.status(200).json({
            msg: 'Perfil actualizado con exito'
        });
    } catch (error) {
        console.log('Controller Update Profile Error -->', error);
        return res.status(500).json({
            msg: 'No se pudo actualizar el perfil'
        })
    }
}

const calculateRatingProfile = async ( req = request, res = response ) => {
    try {
        const { user } = req;
        const profile = await Profile.findOne({ user });
        if ( !profile ) {
            return res.status(400).json({
                msg: 'No se pudo calcular la calificación del usuario'
            });
        } 
        const ads = await Ad.find({ publisher: profile._id }).populate('rating');
        let positive_points = 0;
        let negative_points = 0;
        let score = 0;
        for (const ad of ads) {
            if ( ad.rating ) {
                positive_points += ad.rating.positive_points;
                negative_points += ad.rating.negative_points;
                score = positive_points - negative_points;
            }
        }
        if ( profile.rating ) {
            const updatedRating = await Rating.findByIdAndUpdate( profile.rating, {
                positive_points, negative_points, score
            });
            if ( !updatedRating ) {
                return res.status(400).json({
                    msg: 'No se pudo calcular la calificación del usuario'
                });
            }
        } else {
            const newRating = new Rating({
                positive_points,
                negative_points,
                score
            });
            const createdRating = await newRating.save();
            if ( !createdRating ) {
                return res.status(400).json({
                    msg: 'No se pudo calcular la calificación del usuario'
                });
            }
            const updatedProfile = await Profile.findByIdAndUpdate( profile._id, {
                rating: createdRating._id
            })
        }
        res.status(200).json({
            msg: 'Calificación calculada con exito'
        })
    } catch (error) {
        console.log('Controller Calculate Rating Profile Error -->', error);
        return res.status(500).json({
            msg: 'No se pudo calcular la calificación del usuario'
        })
    }
}


module.exports = {
    createProfile,
    getProfile,
    updateProfile,
    calculateRatingProfile
}