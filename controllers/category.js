const { request, response } = require('express');
const Category = require('../models/category');


const getCategories = async ( req = request, res = response ) => {
    try {
        const categories = await Category.find();
        if ( !categories ) {
            return res.status(400).json({
                msg: 'No se pueden listar las categorias'
            })
        }
        if ( !categories.length ) {
            return res.status(200).json({
                msg: 'No existen categorias'
            });
        }
        res.status(200).json({
            totalRows: categories.length,
            categories
        })
    } catch (error) {
        console.log(' ERROR CONTROLLER GET CATEGORIES -->', error);
        return res.status(500).json({
            msg: 'No se pueden listar las categorias'
        })
    }
}

const createCategory = async ( req = request, res = response ) => {
    try {
        const { name } = req.body;
        const key = name.toLowerCase().split(' ').join('_');
        const category = await Category.findOne({
            key
        });
        if ( category ){
            return res.status(400).json({
                msg :'La categoria ya existe'
            });
        }
        const newCategory = new Category({
            name,
            key
        });
        const createdCategory = await newCategory.save();
        if ( !createdCategory ) {
            return res.status(400).json({
                msg: 'No se pudo crear la categoria'
            });
        }
        res.status(200).json({
            msg: 'Categoria creada con exito'
        });
    } catch (error) {
        console.log('CONTROLLER ERROR CREATE CATEGORY -->', error);
        return res.status(500).json({
            msg: 'No se pueden cargar las categorias'
        });
    }
}

module.exports = {
    createCategory,
    getCategories
}